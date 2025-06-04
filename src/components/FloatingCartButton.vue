<template>
  <button 
    v-if="isVisible" 
    class="floating-cart-button" 
    @click="openCart"
    :class="{ 'has-items': cartItemCount > 0 }"
  >
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"></path>
    </svg>
    <span v-if="cartItemCount > 0" class="floating-cart-count">{{ cartItemCount }}</span>
  </button>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  hideOnPages: {
    type: Array,
    default: () => ['checkout', 'cart']
  }
});

const cartStore = useCartStore();
const route = useRoute();
const isVisible = ref(true);
const scrollingUp = ref(false);
const lastScrollY = ref(0);
const scrollThreshold = 50;
const cartItemCount = computed(() => cartStore.cartItemCount);

const shouldHideOnCurrentPage = computed(() => {
  return props.hideOnPages.some(page => 
    route.path.includes(page) || route.name === page
  );
});

const openCart = () => {
  cartStore.toggleCartDrawer();
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (Math.abs(currentScrollY - lastScrollY.value) > scrollThreshold) {
    scrollingUp.value = currentScrollY < lastScrollY.value;
    lastScrollY.value = currentScrollY;
  }
  isVisible.value = scrollingUp.value || currentScrollY < 100;
  if (shouldHideOnCurrentPage.value) {
    isVisible.value = false;
  }
};

onMounted(() => {
  lastScrollY.value = window.scrollY;
  isVisible.value = !shouldHideOnCurrentPage.value;
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
.floating-cart-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #19ADCF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 900;
  cursor: pointer;
  transition: transform 0.3s, opacity 0.3s, background-color 0.2s;
  opacity: 0.9;
}

.floating-cart-button:hover {
  opacity: 1;
  transform: scale(1.05);
  background-color: #148da8;
}

.floating-cart-button:active {
  transform: scale(0.95);
}

.floating-cart-button.has-items {
  animation: pulse 2s infinite;
}

.floating-cart-button svg {
  width: 24px;
  height: 24px;
}

.floating-cart-count {
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 173, 207, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 173, 207, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 173, 207, 0);
  }
}

/* Hide on larger screens */
@media (min-width: 1024px) {
  .floating-cart-button {
    display: none;
  }
}
</style>