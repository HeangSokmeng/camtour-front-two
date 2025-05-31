<template>
  <div class="cart-header-icon" @click="toggleCart">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      ></path>
    </svg>
    <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";
import { computed } from "vue";

const cartStore = useCartStore();
const cartItemCount = computed(() => cartStore.cartItemCount);

const toggleCart = () => {
  cartStore.toggleCartDrawer();
};
</script>

<style>
.cart-header-icon {
  position: relative;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: color 0.2s;
}

.cart-header-icon:hover {
  color: #19adcf;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-theme .cart-header-icon {
  color: #f5f5f5;
}

@media (max-width: 768px) {
  .cart-header-icon {
    width: 22px;
    height: 22px;
  }
  .cart-count {
    width: 16px;
    height: 16px;
  }
}
</style>
