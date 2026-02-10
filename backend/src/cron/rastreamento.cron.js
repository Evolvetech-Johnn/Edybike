const cron = require('node-cron');
const Order = require('../../models/Order');
const jadlogService = require('../services/jadlog.service');

/**
 * Cron Job para atualizar rastreamento automaticamente
 * Executa a cada 6 horas
 */
function iniciarCronRastreamento() {
  
  // Executar a cada 6 horas: '0 */6 * * *'
  // Para testes: '*/5 * * * *' (a cada 5 minutos)
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('[CRON] Iniciando atualização de rastreamento...');

      // Buscar pedidos enviados que têm código Jadlog
      const pedidos = await Order.find({
        'jadlog.codigo': { $exists: true, $ne: null },
        status: { $in: ['ENVIADO', 'EM_TRANSITO'] }
      });

      console.log(`[CRON] ${pedidos.length} pedidos para atualizar`);

      let atualizados = 0;
      let erros = 0;

      for (const pedido of pedidos) {
        try {
          if (!jadlogService.isConfigured()) {
            console.log('[CRON] Jadlog não configurado, pulando atualização');
            break;
          }

          const tracking = await jadlogService.rastrear(pedido.jadlog.codigo);

          if (tracking && tracking.consulta && tracking.consulta[0]) {
            const info = tracking.consulta[0];
            const statusAtual = info.tracking?.status;

            if (statusAtual && statusAtual !== pedido.jadlog.status) {
              pedido.jadlog.status = statusAtual;
              pedido.jadlog.ultimaAtualizacao = new Date();

              // Atualizar status geral do pedido
              if (statusAtual.includes('ENTREGUE')) {
                pedido.status = 'ENTREGUE';
              } else if (statusAtual.includes('TRANSITO')) {
                pedido.status = 'EM_TRANSITO';
              }

              // Salvar eventos de rastreamento
              if (info.tracking?.eventos) {
                pedido.jadlog.eventos = info.tracking.eventos.map(e => ({
                  data: e.data,
                  descricao: e.descricao,
                  local: e.local
                }));
              }

              await pedido.save();
              atualizados++;

              console.log(`[CRON] Pedido ${pedido._id} atualizado: ${statusAtual}`);
            }
          }

          // Delay entre requisições (evitar rate limit)
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (errorPedido) {
          console.error(`[CRON] Erro ao atualizar pedido ${pedido._id}:`, errorPedido.message);
          erros++;
        }
      }

      console.log(`[CRON] Finalizado: ${atualizados} atualizados, ${erros} erros`);

    } catch (error) {
      console.error('[CRON] Erro geral no rastreamento:', error);
    }
  });

  console.log('[CRON] Job de rastreamento agendado (a cada 6 horas)');
}

module.exports = { iniciarCronRastreamento };
