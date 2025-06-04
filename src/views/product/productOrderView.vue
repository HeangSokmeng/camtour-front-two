<template>
  <div class="product-orders-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">My Product Orders</h1>
        <p class="page-subtitle">View and manage your tour bookings</p>
      </div>
    </div>

    <div class="container">
      <div v-if="state.isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
      <div v-else-if="state.error" class="error-section">
        <div class="error-icon">⚠️</div>
        <h3>Error Loading Orders</h3>
        <p>{{ state.error }}</p>
        <button class="retry-btn" @click="fetchOrders">Try Again</button>
      </div>
      <div v-else-if="!hasItems" class="empty-section">
        <div class="empty-icon">
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
        <h3>No Orders Found</h3>
        <p>You haven't placed any orders yet</p>
        <button class="browse-btn" @click="browseTours">Browse Tour Packages</button>
      </div>
      <div v-else class="orders-content">
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-row">
            <div class="filter-group">
              <label for="status-filter">Filter by Status:</label>
              <select id="status-filter" v-model="statusFilter" @change="applyFilter">
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Confirmed</option>
                <option value="delivered">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="orders-summary">
              <span class="summary-text">
                Showing {{ filteredItems.length }} of {{ items.length }} orders
              </span>
            </div>
          </div>
        </div>
        <div class="orders-grid">
          <div
            v-for="item in filteredItems"
            :key="`${item.id}-${item.colorId || 'null'}-${item.sizeId || 'null'}`"
            class="order-card"
            :class="getOrderStatusClass(item.orderStatus)"
          >
            <router-link :to="`/product/detail/${item.product_id}`">
              <div class="order-header">
                <div class="order-info">
                  <h3 class="order-number">Order #{{ item.orderNo }}</h3>
                  <span class="order-status" :class="getStatusClass(item.orderStatus)">
                    {{ capitalizeStatus(item.orderStatus) }}
                  </span>
                </div>
                <div class="order-actions">
                  <button
                    v-if="canCancelOrder(item.orderStatus)"
                    @click="cancelOrder(item)"
                    class="action-btn cancel-btn"
                    :disabled="cancellingOrders.includes(item.orderId)"
                  >
                    <span v-if="cancellingOrders.includes(item.orderId)"
                      >Cancelling...</span
                    >
                    <span v-else>Cancel Order</span>
                  </button>
                </div>
              </div>
              <div class="product-details">
                <div class="product-image">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    @error="handleImageError($event)"
                  />
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ item.name }}</h4>
                  <div class="product-meta">
                    <div v-if="item.colorName" class="meta-item">
                      <span class="meta-label">Tour Option:</span>
                      <span class="meta-value">{{ item.colorName }}</span>
                    </div>
                    <div v-if="item.sizeName" class="meta-item">
                      <span class="meta-label">Date:</span>
                      <span class="meta-value">{{ item.sizeName }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Quantity:</span>
                      <span class="meta-value">{{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
            <div class="price-section">
              <div class="price-details">
                <div class="price-row">
                  <span class="price-label">Unit Price:</span>
                  <span class="price-value">{{ item.currency }}{{ item.price }}</span>
                </div>
                <div class="price-row total">
                  <span class="price-label">Total:</span>
                  <span class="price-value"
                    >{{ item.currency
                    }}{{ (item.price * item.quantity).toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="summary-section">
          <div class="summary-card">
            <h3>Order Summary</h3>
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-label">Total Orders:</span>
                <span class="stat-value">{{ filteredItems.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Items:</span>
                <span class="stat-value">{{ totalItems }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Amount:</span>
                <span class="stat-value">{{ formattedTotal }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-actions">
          <button @click="browseTours" class="primary-btn">Browse More Tours</button>
          <button
            @click="refreshOrders"
            class="secondary-btn"
            :disabled="state.isLoading"
          >
            <span v-if="state.isLoading">Refreshing...</span>
            <span v-else>Refresh Orders</span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="notification-modal-wrapper"
      v-if="showNotification"
      @click="closeNotification"
    >
      <div class="notification-modal" @click.stop>
        <div class="notification-icon" :class="notificationType">
          <svg
            v-if="notificationType === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div class="notification-content">
          <h3>{{ notificationTitle }}</h3>
          <p>{{ notificationMessage }}</p>
        </div>
        <button class="notification-close" @click="closeNotification">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const globalStore = useGlobalStore();
const placeholderImage = "https://placehold.co/200x150/19ADCF/ffffff?text=Cambodia+Tour";
const statusFilter = ref("");
const showNotification = ref(false);
const notificationType = ref("success");
const notificationTitle = ref("");
const notificationMessage = ref("");
const cancellingOrders = ref([]);
const state = reactive({
  users: [],
  isLoading: false,
  error: null,
});

const items = computed(() => {
  const allItems = [];
  state.users.forEach((user) => {
    if (user.orders && user.orders.length > 0) {
      user.orders.forEach((order) => {
        if (order.items && order.items.length > 0) {
          order.items.forEach((item) => {
            allItems.push({
              id: item.id || `${order.order_id}-${item.product_name}`,
              name: item.product_name,
              product_id: item.product_id,
              image: item.image || placeholderImage,
              colorName: item.color_name,
              colorId: item.color_name,
              sizeName: item.size,
              sizeId: item.size,
              price: parseFloat(item.price || 0),
              quantity: parseInt(item.qty || 1),
              // Additional order info
              orderId: order.order_id,
              orderNo: order.order_no,
              orderStatus: order.status,
              currency: order.currency || "$",
              createdAt: order.created_at,
              // User info
              userInfo: {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
              },
            });
          });
        }
      });
    }
  });
  return allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
const filteredItems = computed(() => {
  if (!statusFilter.value) return items.value;
  return items.value.filter((item) => item.orderStatus === statusFilter.value);
});

const hasItems = computed(() => items.value.length > 0);

const totalItems = computed(() => {
  return filteredItems.value.reduce((total, item) => total + item.quantity, 0);
});

const formattedTotal = computed(() => {
  const total = filteredItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return `$${total.toFixed(2)}`;
});

const capitalizeStatus = (status) => {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "status-pending";
    case "processing":
      return "status-processing";
    case "shipped":
      return "status-shipped";
    case "delivered":
      return "status-delivered";
    case "completed":
      return "status-completed";
    case "cancelled":
      return "status-cancelled";
    default:
      return "status-default";
  }
};

const getOrderStatusClass = (status) => {
  return `order-${status}`;
};

const canCancelOrder = (status) => {
  return ["pending", "processing"].includes(status);
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

const fetchOrders = async () => {
  state.isLoading = true;
  state.error = null;

  try {
    const res = await axios.get(
      "/api/web/product/order/my-order",
      globalStore.getAxiosHeader()
    );
    if (res.data.error === false && Array.isArray(res.data.data)) {
      state.users = res.data.data;
    } else {
      state.error = res.data.message || "Failed to fetch orders";
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    state.error = "An error occurred while fetching orders.";
  } finally {
    state.isLoading = false;
  }
};

const cancelOrder = async (item) => {
  if (!confirm(`Are you sure you want to cancel order #${item.orderNo}?`)) {
    return;
  }
  cancellingOrders.value.push(item.orderId);
  try {
    const res = await axios.put(
      `/api/web/product/order/update/status/${item.orderId}`,
      { status: "cancelled" },
      globalStore.getAxiosHeader()
    );
    if (res.data.error === false) {
      const user = state.users.find((u) =>
        u.orders.some((o) => o.order_id === item.orderId)
      );
      if (user) {
        const order = user.orders.find((o) => o.order_id === item.orderId);
        if (order) {
          order.status = "cancelled";
        }
      }
      showNotificationMessage(
        "success",
        "Order Cancelled",
        `Order #${item.orderNo} has been cancelled successfully.`
      );
    } else {
      throw new Error(res.data.message || "Failed to cancel order");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    showNotificationMessage(
      "error",
      "Cancellation Failed",
      "Failed to cancel order. Please try again."
    );
  } finally {
    cancellingOrders.value = cancellingOrders.value.filter((id) => id !== item.orderId);
  }
};

const applyFilter = () => {};

const browseTours = () => {
  router.push("/product");
};

const refreshOrders = () => {
  fetchOrders();
};

const showNotificationMessage = (type, title, message) => {
  notificationType.value = type;
  notificationTitle.value = title;
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    closeNotification();
  }, 5000);
};

const closeNotification = () => {
  showNotification.value = false;
};
// Lifecycle
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.product-orders-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  background: linear-gradient(135deg, #19adcf 0%, #148da8 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.page-subtitle {
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
}

.loading-section,
.error-section,
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #19adcf;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon,
.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #64748b;
  font-size: 3rem;
}

.empty-icon svg {
  width: 80px;
  height: 80px;
}

.error-section h3,
.empty-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.error-section p,
.empty-section p {
  margin: 0 0 2rem 0;
  color: #64748b;
  font-size: 1.125rem;
}

.retry-btn,
.browse-btn {
  padding: 0.75rem 2rem;
  background-color: #19adcf;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover,
.browse-btn:hover {
  background-color: #148da8;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select:focus {
  outline: none;
  border-color: #19adcf;
  box-shadow: 0 0 0 3px rgba(25, 173, 207, 0.1);
}

.orders-summary {
  color: #64748b;
  font-size: 0.875rem;
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #e5e7eb;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Order Status Classes */
.order-pending {
  border-left-color: #f59e0b;
}

.order-processing {
  border-left-color: #3b82f6;
}

.order-shipped {
  border-left-color: #8b5cf6;
}

.order-delivered {
  border-left-color: #10b981;
}

.order-completed {
  border-left-color: #059669;
}

.order-cancelled {
  border-left-color: #ef4444;
  opacity: 0.8;
}

/* Order Header */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.order-number {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-processing {
  background-color: #dbeafe;
  color: #2563eb;
}

.status-shipped {
  background-color: #e0e7ff;
  color: #5b21b6;
}

.status-delivered {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-completed {
  background-color: #d1fae5;
  color: #059669;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #dc2626;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #fecaca;
  border-color: #fca5a5;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Product Details */
.product-details {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.meta-label {
  color: #64748b;
  font-weight: 500;
  min-width: 80px;
}

.meta-value {
  color: #374151;
  font-weight: 600;
}

/* Price Section */
.price-section {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background-color: #f8fafc;
}

.price-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.price-row.total {
  font-size: 1rem;
  font-weight: 700;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
  color: #19adcf;
}

.price-label {
  color: #64748b;
  font-weight: 500;
}

.price-value {
  color: #1e293b;
  font-weight: 600;
}

.summary-section {
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.summary-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #19adcf;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  color: #1e293b;
  font-weight: 700;
  font-size: 1.125rem;
}

.page-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem 0;
}

.primary-btn,
.secondary-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.primary-btn {
  background-color: #19adcf;
  color: white;
}

.primary-btn:hover {
  background-color: #148da8;
}

.secondary-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.secondary-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.secondary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
  border-radius: 12px;
  padding: 2rem;
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.notification-icon.success {
  background-color: #dcfce7;
  color: #16a34a;
}

.notification-icon.error {
  background-color: #fee2e2;
  color: #dc2626;
}

.notification-icon svg {
  width: 30px;
  height: 30px;
}

.notification-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.notification-content p {
  margin: 0;
  color: #64748b;
}

.notification-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-close:hover {
  color: #6b7280;
  background-color: #f3f4f6;
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

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .orders-summary {
    text-align: center;
  }

  .order-header {
    flex-direction: column;
    gap: 1rem;
  }

  .product-details {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-image {
    align-self: center;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }

  .stat-item {
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 0.5rem;
  }

  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .page-header {
    padding: 1.5rem 0;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .order-card {
    margin: 0 -0.5rem;
  }

  .product-details {
    padding: 0.75rem 1rem;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .notification-modal {
    width: 95%;
    padding: 1.5rem;
  }
}
</style>
