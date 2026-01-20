<!-- src/CartIcon.svelte -->
<svelte:options customElement="cart-icon" />

<script lang="ts">
  export let staticBase = '';
  export let icon = 'breaker.svg';
  export let count: number = 0;

  let linkEl: HTMLAnchorElement;

  function handleClick(e: MouseEvent) {
    e.preventDefault();

    linkEl.dispatchEvent(
      new CustomEvent('cartClick', {
        bubbles: true,
        composed: true
      })
    );
  }
</script>

<a bind:this={linkEl} class="cart-link" on:click={handleClick} href="#">
  <img src={`${staticBase}/${icon}`} alt="cart" />
  {#if count > 0}
    <span class="cart-count">{count}</span>
  {/if}
</a>


<style>
  .cart-link {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
    position: relative;
    overflow: visible;
    cursor: pointer;
  }

  .cart-link:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  .cart-link img {
    width: 24px;
    height: 24px;
    transform: scale(1.3);
  }

  .cart-count {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 100;
  }
</style>