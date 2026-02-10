/**
 * Serviço de geração de imagens placeholder para produtos sem imagem
 * Gera SVG dinâmico baseado na categoria do produto
 */

interface PlaceholderOptions {
  category: string;
  productName: string;
  size?: number;
}

const categoryIcons: Record<string, string> = {
  'Bicicletas': '🚴',
  'Acessórios para Bike': '🔧',
  'Acessórios para Ciclista': '🪖',
  'Mountain Bikes': '🚵',
  'Urban Bikes': '🚲',
  'Electric Bikes': '⚡',
  'default': '🚴'
};

const categoryColors: Record<string, string> = {
  'Bicicletas': '#1e40af',
  'Acessórios para Bike': '#059669',
  'Acessórios para Ciclista': '#dc2626',
  'Mountain Bikes': '#7c3aed',
  'Urban Bikes': '#0891b2',
  'Electric Bikes': '#ea580c',
  'default': '#64748b'
};

export const generatePlaceholderSVG = ({ category, productName, size = 400 }: PlaceholderOptions): string => {
  const icon = categoryIcons[category] || categoryIcons.default;
  const color = categoryColors[category] || categoryColors.default;
  const initials = productName
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.2" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      
      <!-- Icon -->
      <text 
        x="50%" 
        y="40%" 
        font-size="${size * 0.3}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${icon}
      </text>
      
      <!-- Initials -->
      <text 
        x="50%" 
        y="70%" 
        font-size="${size * 0.12}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="${color}"
        font-family="Arial, sans-serif"
        font-weight="bold"
      >
        ${initials}
      </text>
      
      <!-- Placeholder indicator -->
      <text 
        x="50%" 
        y="90%" 
        font-size="${size * 0.06}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#9ca3af"
        font-family="Arial, sans-serif"
      >
        Imagem não disponível
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getProductImage = (imageUrl: string | null, category: string, productName: string): string => {
  // Se tem imagem, retornar a imagem
  if (imageUrl) {
    return imageUrl;
  }
  
  // Caso contrário, gerar placeholder
  return generatePlaceholderSVG({
    category,
    productName,
    size: 400
  });
};

export default {
  generatePlaceholderSVG,
  getProductImage
};
