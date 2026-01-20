import CartIcon from './CartIcon.svelte';

// важно: register один раз
if (!customElements.get('cart-icon')) {
  customElements.define('cart-icon', (CartIcon as any).element);
}
