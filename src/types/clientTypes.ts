// Define Product interface for client-side components
export interface ClientProduct {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  priceFormatted?: string;
  originalPrice?: number | string;
  category?: string;
  subcategory?: string;
  images?: string[];
  stock?: number;
  isNew?: boolean;
  specifications?: Record<string, string>;
  collection?: string;
  colors?: string[] | number;
  inStock?: boolean;
}

// Safe access helper functions
export function safeProductId(product: any): string {
  return product?.id || '';
}

export function safeProductName(product: any): string {
  return product?.name || '';
}

export function safeProductPrice(product: any): string | number {
  return product?.priceFormatted || product?.price || 0;
}

export function safeProductImage(product: any): string {
  return product?.images && product.images.length > 0
    ? product.images[0]
    : product?.image || '/images/placeholder.jpg';
}
