<template>
  <button 
    :class="buttonClasses" 
    @click="addToCart" 
    :disabled="disabled || isLoading"
  >
    <div class="button-content">
      <div v-if="isLoading" class="button-loader"></div>
      <svg v-else-if="showIcon" class="cart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" fill="currentColor"></path>
      </svg>
      <span>{{ buttonText }}</span>
    </div>
  </button>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { computed, defineEmits, defineProps, inject, ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  size: {
    type: [Number, String, null],
    default: null
  },
  sizeName: {
    type: String,
    default: null
  },
  color: {
    type: [Number, String, null],
    default: null
  },
  colorName: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Add To Cart'
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'small', 'text'].includes(value)
  }
});

const emit = defineEmits(['added-to-cart', 'add-error']);
const showSuccessNotification = inject('showSuccessNotification', null);
const showErrorNotification = inject('showErrorNotification', null);
const cartStore = useCartStore();
const isLoading = ref(false);
const buttonClasses = computed(() => {
  return {
    'add-to-cart-btn': true,
    [`btn-${props.variant}`]: true,
    'loading': isLoading.value
  };
});

const addToCart = async () => {
  if (props.disabled || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    const tourPackage = {
      id: props.product.id,
      name: props.product.name,
      name_km: props.product.name_km || '',
      code: props.product.code || '',
      price: props.variant?.price || props.product.price,
      quantity: props.quantity,
      image: props.product.thumbnail || props.product.image || '',
      colorId: props.color,
      colorName: props.colorName,
      sizeId: props.size,
      sizeName: props.sizeName,
      variantId: props.variant?.id,
      brand: props.product.brand?.name || '',
      category: props.product.category?.name || '',
      pcategory: props.product.pcategory?.name || '',
      maxQuantity: props.variant?.qty || props.product.quantity || 20
    };
    
    const result = cartStore.addToCart(tourPackage);
    if (result.success) {
      if (showSuccessNotification) {
        showSuccessNotification(result.message);
      }
      emit('added-to-cart', tourPackage);
    } else {
      if (showErrorNotification) {
        showErrorNotification(result.message);
      }
      emit('add-error', result.message);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (showErrorNotification) {
      showErrorNotification('Failed to add item to cart');
    }
    emit('add-error', 'Failed to add item to cart');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
.add-to-cart-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s, transform 0.1s;
  border: none;
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-to-cart-btn:not(:disabled):active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: #19ADCF;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-primary:not(:disabled):hover {
  background-color: #148da8;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-secondary:not(:disabled):hover {
  background-color: #e0e0e0;
}

.btn-small {
  background-color: #19ADCF;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-small:not(:disabled):hover {
  background-color: #148da8;
}

.btn-text {
  background-color: transparent;
  color: #19ADCF;
  padding: 0.5rem;
  text-decoration: underline;
  font-size: 0.875rem;
}

.btn-text:not(:disabled):hover {
  color: #148da8;
  background-color: rgba(25, 173, 207, 0.1);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cart-icon {
  width: 24px;
  height: 24px;
}

.button-loader {
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: button-spinner 0.8s linear infinite;
}

@keyframes button-spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>