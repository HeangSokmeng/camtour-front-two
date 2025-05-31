<template>
  <div class="cart-drawer-wrapper" :class="{ open: store.showCartDrawer }">
    <div class="cart-overlay" @click="store.toggleCartDrawer"></div>
    <div class="cart-drawer">
      <div class="cart-header">
        <h2>Product Bookings</h2>
        <button class="close-btn" @click="store.toggleCartDrawer">×</button>
      </div>
      <div v-if="!store.hasItems" class="empty-cart">
        <div class="empty-cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 11h-3.343a4 4 0 1 0-7.022-2.1L8 11H3a1 1 0 0 0-.993 1.142l2 12A1 1 0 0 0 5 25h14a1 1 0 0 0 .993-.858l2-12A1 1 0 0 0 21 11z"
            ></path>
            <circle cx="9" cy="9" r="4"></circle>
            <line x1="5" y1="23" x2="19" y2="23"></line>
          </svg>
        </div>
        <p>Your cart is empty</p>
        <button class="browse-packages-btn" @click="browseTours">
          Browse Tour Packages
        </button>
      </div>
      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in store.items"
            :key="`${item.id}-${item.colorId || 'null'}-${item.sizeId || 'null'}`"
            class="cart-item"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" @error="handleImageError($event)" />
            </div>
            <div class="item-details">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-meta" v-if="item.category">{{ item.category }}</div>
              <div class="item-options">
                <div v-if="item.colorName" class="item-option">
                  Tour Option: {{ item.colorName }}
                </div>
                <div v-if="item.sizeName" class="item-option">
                  Date: {{ item.sizeName }}
                </div>
              </div>
              <div class="item-price-qty">
                <div class="item-price">${{ item.price }}</div>
                <div class="quantity-control">
                  <button
                    @click="decrementQuantity(item)"
                    class="quantity-btn"
                    :disabled="item.quantity <= 1"
                  >
                    -
                  </button>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <button
                    @click="incrementQuantity(item)"
                    class="quantity-btn"
                    :disabled="item.maxQuantity && item.quantity >= item.maxQuantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              @click="removeItem(item)"
              class="remove-item-btn"
              aria-label="Remove item"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="cart-summary">
          <div class="summary-row">
            <span>Number of Items:</span>
            <span>{{ store.cartItemCount }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ store.formattedTotal }}</span>
          </div>
        </div>
        <div class="cart-actions">
          <button @click="store.toggleCartDrawer" class="continue-shopping-btn">
            Continue Browsing
          </button>
          <button @click="checkout" class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
    <!-- Notification Modal -->
    <div
      class="notification-modal-wrapper"
      v-if="showNotification"
      @click="closeNotification"
    >
      <div class="notification-modal" @click.stop>
        <div class="notification-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="notification-content">
          <h3>Proceeding to Checkout</h3>
          <p>You're being redirected to the secure checkout page.</p>
        </div>
        <button class="notification-close" @click="closeNotification">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useCartStore();
const showNotification = ref(false);
const placeholderImage = "https://placehold.co/200x150/19ADCF/ffffff?text=Cambodia+Tour";

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

const incrementQuantity = (item) => {
  if (!item.maxQuantity || item.quantity < item.maxQuantity) {
    store.updateItemQuantity(item.id, item.colorId, item.sizeId, item.quantity + 1);
  }
};

const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    store.updateItemQuantity(item.id, item.colorId, item.sizeId, item.quantity - 1);
  }
};

const removeItem = (item) => {
  store.removeItem(item.id, item.colorId, item.sizeId);
};

const browseTours = () => {
  store.toggleCartDrawer();
  router.push("/product");
};

const closeNotification = () => {
  showNotification.value = false;
};

const checkout = () => {
  store.toggleCartDrawer();
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
    router.push("/checkout");
  }, 1500);
};

onMounted(() => {
  store.loadCartFromLocalStorage();
});
</script>

<style>
/* Cart Drawer Styles */
.cart-drawer-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 0.3s, opacity 0.3s ease;
}

.cart-drawer-wrapper.open {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

.cart-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.cart-drawer {
  position: absolute;
  top: 0;
  right: -400px;
  width: 90%;
  max-width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease;
  overflow: hidden;
}

.cart-drawer-wrapper.open .cart-drawer {
  right: 0;
}

.cart-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #c5f1ff;
  background-color: #19aecfb4;
  color: white;
  border-radius: 10px;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  height: 100%;
}

.empty-cart-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #bdbdbd;
}

.empty-cart p {
  color: #757575;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.browse-packages-btn {
  padding: 0.75rem 1.5rem;
  background-color: #19adcf;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-packages-btn:hover {
  background-color: #148da8;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  position: relative;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  color: #757575;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.item-options {
  margin-bottom: 0.5rem;
}

.item-option {
  font-size: 0.875rem;
  color: #616161;
}

.item-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-weight: 600;
  color: #19adcf;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  margin: 0 0.5rem;
  min-width: 24px;
  text-align: center;
}

.remove-item-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: none;
  border: none;
  color: #bdbdbd;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.remove-item-btn:hover {
  color: #f44336;
}

.cart-summary {
  padding: 1rem;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.125rem;
  border-top: 1px solid #e0e0e0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  color: #19adcf;
}

.cart-actions {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.continue-shopping-btn,
.checkout-btn {
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.continue-shopping-btn {
  background-color: #f5f5f5;
  color: #424242;
  border: 1px solid #e0e0e0;
}

.continue-shopping-btn:hover {
  background-color: #e0e0e0;
}

.checkout-btn {
  background-color: #19adcf;
  color: white;
}

.checkout-btn:hover {
  background-color: #148da8;
}

/* Notification Modal Styles */
.notification-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  animation: fadeIn 0.3s ease;
}

.notification-modal {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.3s ease;
}

.notification-icon {
  width: 60px;
  height: 60px;
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.notification-icon svg {
  width: 30px;
  height: 30px;
}

.notification-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.notification-content p {
  margin: 0;
  color: #666;
}

.notification-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: none;
  border: none;
  color: #bdbdbd;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.notification-close:hover {
  color: #757575;
  background-color: #f5f5f5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile optimization */
@media (max-width: 480px) {
  .cart-drawer {
    max-width: 100%;
  }

  .cart-actions {
    grid-template-columns: 1fr;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .notification-modal {
    width: 95%;
  }
}
</style>
