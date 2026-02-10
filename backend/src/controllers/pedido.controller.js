const Order = require('../models/Order');
const jadlogService = require('../services/jadlog.service');

/**
 * Controller de Pedidos
 */
const pedidoController = {

  /**
   * POST /api/pedidos
   * Cria um novo pedido (ainda sem pagamento)
   */
  async criar(req, res) {
    try {
      const { cliente, endereco, itens, frete } = req.body;

      // Validações básicas
      if (!cliente || !endereco || !itens || itens.length === 0 || !frete) {
        return res.status(400).json({
          erro: 'Dados incompletos',
          detalhe: 'Cliente, endereço, itens e frete são obrigatórios'
        });
      }

      // Criar pedido
      const pedido = new Order({
        cliente,
        endereco,
        itens,
        frete,
        status: 'AGUARDANDO_PAGAMENTO'
      });

      // Calcular totais
      pedido.calcularTotais();

      await pedido.save();

      res.status(201).json({
        pedidoId: pedido._id,
        numeroPedido: pedido.numeroPedido,
        total: pedido.valores.total,
        status: pedido.status
      });

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({
        erro: 'Erro ao criar pedido',
        detalhe: error.message
      });
    }
  },

  /**
   * GET /api/pedidos/:id
   * Busca um pedido por ID
   */
  async buscarPorId(req, res) {
    try {
      const pedido = await Order.findById(req.params.id)
        .populate('itens.produtoId', 'name image');

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      res.json(pedido);

    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ erro: 'Erro ao buscar pedido' });
    }
  },

  /**
   * GET /api/pedidos/cliente/:email
   * Lista pedidos de um cliente
   */
  async listarPorCliente(req, res) {
    try {
      const pedidos = await Order.find({ 'cliente.email': req.params.email })
        .sort({ createdAt: -1 })
        .limit(20);

      res.json(pedidos);

    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ erro: 'Erro ao listar pedidos' });
    }
  },

  /**
   * POST /api/webhooks/pagamento
   * Recebe notificação de pagamento aprovado
   * 
   * IMPORTANTE: Este endpoint deve ser chamado pelo gateway de pagamento
   * após aprovação. Ele cria o embarque na Jadlog.
   */
  async webhookPagamento(req, res) {
    try {
      const { orderId, status, transactionId, gateway } = req.body;

      // Validar webhook secreto (adicionar em produção)
      // if (req.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
      //   return res.status(401).json({ erro: 'Não autorizado' });
      // }

      // Só processar se aprovado
      if (status !== 'approved' && status !== 'APROVADO') {
        return res.sendStatus(200);
      }

      const pedido = await Order.findById(orderId);

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      // Evitar processamento duplicado
      if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {
        console.log(`Pedido ${orderId} já processado`);
        return res.sendStatus(200);
      }

      // Atualizar pagamento
      pedido.pagamento = {
        gateway: gateway || 'EXTERNO',
        status: 'APROVADO',
        transactionId,
        aprovadoEm: new Date()
      };

      pedido.status = 'PAGAMENTO_APROVADO';

      await pedido.save();

      // Criar embarque na Jadlog (se configurado)
      if (jadlogService.isConfigured() && pedido.frete.transportadora === 'J adlog') {
        try {
          const resposta = await jadlogService.criarPedido({
            id: pedido._id.toString(),
            pesoTotal: pedido.itens.reduce((acc, i) => acc + (i.peso * i.quantidade), 0),
            valorTotal: pedido.valores.subtotal,
            modalidade: pedido.frete.modalidade || 3,
            conteudo: `Pedido ${pedido.numeroPedido}`,
            destinatario: {
              nome: pedido.cliente.nome,
              cpfCnpj: pedido.cliente.cpf,
              endereco: pedido.endereco.rua,
              numero: pedido.endereco.numero,
              bairro: pedido.endereco.bairro,
              complemento: pedido.endereco.complemento || '',
              cidade: pedido.endereco.cidade,
              uf: pedido.endereco.uf,
              cep: pedido.endereco.cep,
              telefone: pedido.cliente.telefone
            },
            volumes: pedido.itens.map((item, idx) => ({
              identificador: idx + 1,
              peso: item.peso * item.quantidade,
              altura: item.altura || 20,
              largura: item.largura || 30,
              comprimento: item.comprimento || 40
            }))
          });

          pedido.jadlog = {
            codigo: resposta.codigo || resposta.pedido?.[0]?.codigo,
            shipmentId: resposta.shipmentId || resposta.pedido?.[0]?.shipmentId,
            status: 'DESPACHADO',
            ultimaAtualizacao: new Date()
          };

          pedido.status = 'ENVIADO';

          await pedido.save();

          console.log(`Embarque Jadlog criado para pedido ${pedido._id}`);

        } catch (errorJadlog) {
          console.error('Erro ao criar embarque Jadlog:', errorJadlog);
          
          // Não falhar o webhook, apenas logar
          // O pedido fica como PAGAMENTO_APROVADO para processar manualmente
          pedido.observacoes = `Erro Jadlog: ${errorJadlog.message}`;
          await pedido.save();
        }
      }

      res.sendStatus(200);

    } catch (error) {
      console.error('Erro no webhook de pagamento:', error);
      res.status(500).json({ erro: 'Erro ao processar webhook' });
    }
  },

  /**
   * GET /api/pedidos/:id/rastreio
   * Consulta rastreamento de um pedido
   */
  async rastrear(req, res) {
    try {
      const pedido = await Order.findById(req.params.id);

      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }

      if (!pedido.jadlog?.codigo) {
        return res.json({
          status: pedido.status,
          mensagem: 'Aguardando código de rastreio'
        });
      }

      // Consultar Jadlog
      if (jadlogService.isConfigured()) {
        const tracking = await jadlogService.rastrear(pedido.jadlog.codigo);
        
        // Atualizar pedido com informações atualizadas
        if (tracking && tracking.consulta && tracking.consulta[0]) {
          const info = tracking.consulta[0];
          
          pedido.jadlog.status = info.tracking?.status || pedido.jadlog.status;
          pedido.jadlog.ultimaAtualizacao = new Date();
          
          await pedido.save();
        }

        return res.json(tracking);
      }

      // Sem integração, retornar dados do banco
      res.json({
        codigo: pedido.jadlog.codigo,
        status: pedido.jadlog.status,
        ultimaAtualizacao: pedido.jadlog.ultimaAtualizacao
      });

    } catch (error) {
      console.error('Erro ao rastrear pedido:', error);
      res.status(500).json({ erro: 'Erro ao rastrear pedido' });
    }
  }
};

module.exports = pedidoController;
