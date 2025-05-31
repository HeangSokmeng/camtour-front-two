<template>
  <button 
    :class="['wishlist-btn', { 
      'is-favorited': isInWishlist, 
      'is-loading': isLoading,
      'btn-small': size === 'small',
      'btn-large': size === 'large'
    }]"
    @click.prevent.stop="toggleWishlist"
    :disabled="isLoading"
    :title="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
  >
    <div class="btn-content">
      <!-- Heart icon -->
      <svg 
        class="heart-icon" 
        :class="{ filled: isInWishlist }"
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      
      <!-- Loading spinner -->
      <div v-if="isLoading" class="loading-spinner"></div>
      
      <!-- Text label (optional) -->
      <span v-if="showText" class="btn-text">
        {{ isInWishlist ? 'Saved' : 'Save' }}
      </span>
    </div>
    
    <!-- Success animation -->
    <div v-if="showSuccessAnimation" class="success-animation">
      <div class="success-checkmark">✓</div>
    </div>
  </button>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue';

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (item) => {
      return item && (item.id !== undefined || item.product_id !== undefined);
    }
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showText: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'ghost'].includes(value)
  }
});

// Emits
const emit = defineEmits(['added', 'removed', 'error']);

// State
const isLoading = ref(false);
const showSuccessAnimation = ref(false);

// Computed
const itemId = computed(() => {
  return props.item.id || props.item.product_id;
});

const isInWishlist = computed(() => {
  // Dynamic check to avoid early initialization
  try {
    const WishlistService = require('@/stores/WishlistService').default;
    return WishlistService.isInWishlist(itemId.value);
  } catch (error) {
    // Fallback to localStorage check if service not available
    try {
      const storageKey = 'camtour_wishlist_guest';
      const stored = localStorage.getItem(storageKey);
      const items = stored ? JSON.parse(stored) : [];
      return items.some(item => item.id === itemId.value);
    } catch {
      return false;
    }
  }
});

// Methods
const toggleWishlist = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // Prepare item data for wishlist
    const wishlistItem = {
      id: itemId.value,
      name: getItemName(),
      location: getItemLocation(),
      image: getItemImage(),
      price: props.item.price || null,
      rating: props.item.rate_star || props.item.rating || 0,
      views: props.item.total_view || props.item.views || 0,
      type: determineItemType(),
      ...props.item
    };
    
    const wasInWishlist = isInWishlist.value;
    
    // Import WishlistService dynamically to avoid initialization issues
    const { default: WishlistService } = await import('@/stores/WishlistService');
    const success = await WishlistService.toggleItem(wishlistItem);
    
    if (success) {
      // Show success animation
      showSuccessAnimation.value = true;
      setTimeout(() => {
        showSuccessAnimation.value = false;
      }, 1000);
      
      // Emit appropriate event
      if (wasInWishlist) {
        emit('removed', itemId.value);
      } else {
        emit('added', wishlistItem);
      }
      
      // Show toast notification (optional)
      showNotification(wasInWishlist);
      
    } else {
      emit('error', 'Failed to update wishlist');
    }
    
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    emit('error', error.message);
  } finally {
    isLoading.value = false;
  }
};

const getItemName = () => {
  return props.item.name || 
         props.item.product_name || 
         props.item.title || 
         'Unknown Item';
};

const getItemLocation = () => {
  return props.item.location || 
         props.item.name_local || 
         props.item.description || 
         '';
};

const getItemImage = () => {
  return props.item.is_thumbnail || 
         props.item.image || 
         props.item.thumbnail || 
         'https://placehold.co/400x300/19ADCF/ffffff?text=Camtour';
};

const determineItemType = () => {
  if (props.item.product_id || props.item.product_name) {
    return 'product';
  }
  return 'location';
};

const showNotification = (wasRemoved) => {
  // You can implement a toast notification system here
  const message = wasRemoved 
    ? `Removed "${getItemName()}" from wishlist`
    : `Added "${getItemName()}" to wishlist`;
    
  console.log(message);
  
  // Example: dispatch custom event for toast notifications
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: {
      message,
      type: wasRemoved ? 'info' : 'success',
      duration: 3000
    }
  }));
};

// Watch for external changes to the item
watch(() => props.item, (newItem) => {
  if (!newItem || (!newItem.id && !newItem.product_id)) {
    console.warn('WishlistButton: Invalid item prop', newItem);
  }
}, { immediate: true });
</script>

<style scoped>
.wishlist-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 40px;
  min-height: 40px;
  z-index: 10;
}

.wishlist-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #ff6b6b;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.wishlist-btn.is-favorited {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.wishlist-btn.is-favorited:hover {
  background: #ff5252;
  border-color: #ff5252;
}

.wishlist-btn.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

.wishlist-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Size variants */
.wishlist-btn.btn-small {
  min-width: 32px;
  min-height: 32px;
  padding: 6px;
}

.wishlist-btn.btn-small .heart-icon {
  width: 16px;
  height: 16px;
}

.wishlist-btn.btn-large {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}

.wishlist-btn.btn-large .heart-icon {
  width: 24px;
  height: 24px;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.heart-icon {
  transition: all 0.3s ease;
  stroke-width: 2;
}

.heart-icon.filled {
  fill: currentColor;
  stroke: currentColor;
  animation: heartBeat 0.6s ease-in-out;
}

.btn-text {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.success-checkmark {
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
  animation: checkmarkPop 0.6s ease-out;
}

/* Animations */
@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes checkmarkPop {
  0% { 
    transform: scale(0) rotate(45deg); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.2) rotate(45deg); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1) rotate(45deg); 
    opacity: 0; 
  }
}

/* Variant styles */
.wishlist-btn.variant-outline {
  background: transparent;
  border: 2px solid rgba(0, 0, 0, 0.3);
  color: #333;
}

.wishlist-btn.variant-outline:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.wishlist-btn.variant-ghost {
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.6);
}

.wishlist-btn.variant-ghost:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .wishlist-btn {
    min-width: 36px;
    min-height: 36px;
  }
  
  .btn-text {
    display: none;
  }
}

/* Focus styles for accessibility */
.wishlist-btn:focus {
  outline: 2px solid #ff6b6b;
  outline-offset: 2px;
}

.wishlist-btn:focus:not(:focus-visible) {
  outline: none;
}
</style>