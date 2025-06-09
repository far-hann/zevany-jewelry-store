// src/utils/cartWishlist.ts

export function getCart() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

export function addToCart(productId: string) {
  const cart = getCart();
  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    // Immediately dispatch event to update navbar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartWishlistUpdate'));
    }
  }
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((id: string) => id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  // Immediately dispatch event to update navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartWishlistUpdate'));
  }
}

export function getWishlist() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

export function addToWishlist(productId: string) {
  const wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    // Immediately dispatch event to update navbar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartWishlistUpdate'));
    }
  }
}

export function removeFromWishlist(productId: string) {
  const wishlist = getWishlist().filter((id: string) => id !== productId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  // Immediately dispatch event to update navbar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartWishlistUpdate'));
  }
}
