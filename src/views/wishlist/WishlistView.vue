<template>
  <div class="favorites-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {{ t("my-favorites") }}
          </h1>
          <p class="page-subtitle">{{ t("favorites-subtitle") }}</p>
        </div>
        
        <!-- Stats Bar -->
        <div class="stats-bar" v-if="wishlistStats">
          <div class="stat-item">
            <span class="stat-number">{{ wishlistStats.totalItems }}</span>
            <span class="stat-label">{{ t("total-items") }}</span>
          </div>
          <div class="stat-item" v-if="wishlistStats.locations > 0">
            <span class="stat-number">{{ wishlistStats.locations }}</span>
            <span class="stat-label">{{ t("locations") }}</span>
          </div>
          <div class="stat-item" v-if="wishlistStats.products > 0">
            <span class="stat-number">{{ wishlistStats.products }}</span>
            <span class="stat-label">{{ t("products") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Toolbar -->
      <div class="toolbar" v-if="wishlistItems.length > 0">
        <div class="toolbar-left">
          <!-- Filter Tabs -->
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'all' }"
              @click="setFilter('all')"
            >
              {{ t("all") }} ({{ wishlistItems.length }})
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'location' }"
              @click="setFilter('location')"
              v-if="getItemsByType('location').length > 0"
            >
              {{ t("locations") }} ({{ getItemsByType('location').length }})
            </button>
            <button 
              class="filter-tab" 
              :class="{ active: activeFilter === 'product' }"
              @click="setFilter('product')"
              v-if="getItemsByType('product').length > 0"
            >
              {{ t("products") }} ({{ getItemsByType('product').length }})
            </button>
          </div>
        </div>

        <div class="toolbar-right">
          <!-- Search -->
          <!-- <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="t('search-favorites')"
              class="search-input"
            />
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div> -->

          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="setViewMode('grid')"
              title="Grid View"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="setViewMode('list')"
              title="List View"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Clear All Button -->
          <button 
            class="clear-all-btn"
            @click="showClearModal = true"
            v-if="wishlistItems.length > 0"
          >
            {{ t("clear-all") }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>{{ t("loading-favorites") }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlistItems.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h2>{{ t("no-favorites") }}</h2>
        <p>{{ t("no-favorites-description") }}</p>
        <div class="empty-actions">
          <RouterLink to="/" class="cta-btn primary">
            {{ t("explore-locations") }}
          </RouterLink>
          <RouterLink to="/product" class="cta-btn secondary">
            {{ t("browse-products") }}
          </RouterLink>
        </div>
      </div>

      <!-- No Search Results -->
      <div v-else-if="filteredItems.length === 0 && searchQuery" class="no-results">
        <p>{{ t("no-search-results") }} "{{ searchQuery }}"</p>
        <button @click="clearSearch" class="clear-search-btn">{{ t("clear-search") }}</button>
      </div>

      <!-- Wishlist Items -->
      <div v-else class="wishlist-content">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="wishlist-grid">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="wishlist-card"
            @click="viewItem(item)"
          >
            <div class="card-image">
              <!-- Navigation arrows -->
              <button class="nav-btn prev-btn" @click.stop="previousImage(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <button class="nav-btn next-btn" @click.stop="nextImage(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9,6 15,12 9,18"></polyline>
                </svg>
              </button>

              <img 
                :src="getCurrentImage(item)" 
                :alt="item.name"
                @error="handleImageError"
                class="item-image"
              />

              <!-- Heart button -->
              <button 
                class="heart-btn"
                @click.stop="removeFromWishlist(item)"
                :disabled="isRemoving"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <!-- Year badge -->
              <div class="year-badge" v-if="item.year">
                <div class="badge-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                {{ item.year }}
              </div>

              <!-- Image dots indicator -->
              <div class="image-dots" v-if="getItemImages(item).length > 1">
                <span 
                  v-for="(image, index) in getItemImages(item)" 
                  :key="index"
                  class="dot"
                  :class="{ active: item.currentImageIndex === index }"
                  @click.stop="setImageIndex(item, index)"
                ></span>
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="item-title">{{ item.name }}</h3>
              
              <div class="item-rating" v-if="item.rating > 0">
                <span class="rating-score">{{ item.rating }}</span>
                <div class="rating-stars">
                  <span 
                    v-for="i in 5" 
                    :key="i" 
                    class="star"
                    :class="{ filled: i <= Math.floor(item.rating) }"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </span>
                </div>
                <span class="rating-count">({{ formatNumber(item.reviewCount || 0) }})</span>
              </div>

              <div class="item-category">{{ item.category || t(item.type) }}</div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="wishlist-list">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="wishlist-item"
            @click="viewItem(item)"
          >
            <div class="item-image-container">
              <img 
                :src="getCurrentImage(item)" 
                :alt="item.name"
                @error="handleImageError"
                class="item-image"
              />
              <div class="item-type-badge" :class="item.type">
                {{ t(item.type) }}
              </div>
            </div>

            <div class="item-details">
              <div class="item-header">
                <h3 class="item-name">{{ item.name }}</h3>
                <div class="item-stats">
                  <span v-if="item.rating > 0" class="rating">
                    <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    {{ item.rating }}
                  </span>
                  <span v-if="item.price > 0" class="price">
                    ${{ formatPrice(item.price) }}
                  </span>
                </div>
              </div>

              <p class="item-location" v-if="item.location">
                <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ item.location }}
              </p>

              <div class="item-footer">
                <span class="added-date">
                  {{ t("added") }} {{ formatDate(item.addedAt) }}
                </span>
                <span v-if="item.views > 0" class="views">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {{ formatNumber(item.views) }} {{ t("views") }}
                </span>
              </div>
            </div>

            <div class="item-actions">
              <button 
                class="action-btn primary"
                @click.stop="viewItem(item)"
              >
                {{ t("view") }}
              </button>
              <button 
                class="action-btn secondary"
                @click.stop="shareItem(item)"
              >
                {{ t("share") }}
              </button>
              <button 
                class="action-btn danger"
                @click.stop="removeFromWishlist(item)"
                :title="t('remove-from-favorites')"
                :disabled="isRemoving"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear All Confirmation Modal -->
    <div class="modal-overlay" v-if="showClearModal" @click="showClearModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t("confirm-clear-all") }}</h3>
          <button class="modal-close" @click="showClearModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>{{ t("clear-all-warning") }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="showClearModal = false">
            {{ t("cancel") }}
          </button>
          <button 
            class="modal-btn confirm-btn"
            @click="clearAllFavorites"
            :disabled="isClearing"
          >
            <span v-if="isClearing">{{ t("clearing") }}</span>
            <span v-else>{{ t("clear-all") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from 'axios';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const globalStore = useGlobalStore();
const { t } = useTranslation();

// Reactive state
const wishlistItems = ref([]);
const wishlistStats = ref(null);
const isLoading = ref(true);
const isRemoving = ref(false);
const activeFilter = ref('all');
const searchQuery = ref('');
const viewMode = ref('grid');
const showClearModal = ref(false);
const isClearing = ref(false);
const toasts = ref([]);

// Computed properties
const filteredItems = computed(() => {
  let items = wishlistItems.value;

  // Filter by type
  if (activeFilter.value !== 'all') {
    items = items.filter(item => item.type === activeFilter.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.location && item.location.toLowerCase().includes(query)) ||
      (item.name_local && item.name_local.toLowerCase().includes(query))
    );
  }

  return items;
});

// Methods
const loadWishlistData = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      "/api/web/wishlist",
      globalStore.getAxiosHeader()
    );

    if (response.data.result) {
      wishlistItems.value = (response.data.data || []).map(item => ({
        ...item,
        currentImageIndex: 0,
        images: item.images || [item.image].filter(Boolean)
      }));
      calculateStats();
    } else {
      console.error("Failed to load wishlist:", response.data.message);
      showToast(t('error-loading-favorites'), 'error');
    }
  } catch (error) {
    console.error('Error loading wishlist:', error);
    showToast(t('error-loading-favorites'), 'error');
  } finally {
    isLoading.value = false;
  }
};

const calculateStats = () => {
  const stats = {
    totalItems: wishlistItems.value.length,
    locations: wishlistItems.value.filter(item => item.type === 'location').length,
    products: wishlistItems.value.filter(item => item.type === 'product').length,
  };
  wishlistStats.value = stats;
};

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const setViewMode = (mode) => {
  viewMode.value = mode;
  localStorage.setItem('wishlist_view_mode', mode);
};

const getItemsByType = (type) => {
  return wishlistItems.value.filter(item => item.type === type);
};

const getItemImages = (item) => {
  return item.images || [item.image].filter(Boolean);
};

const getCurrentImage = (item) => {
  const images = getItemImages(item);
  if (images.length === 0) return getDefaultImage(item.type);
  return images[item.currentImageIndex || 0] || getDefaultImage(item.type);
};

const setImageIndex = (item, index) => {
  item.currentImageIndex = index;
};

const nextImage = (item) => {
  const images = getItemImages(item);
  if (images.length <= 1) return;
  item.currentImageIndex = (item.currentImageIndex + 1) % images.length;
};

const previousImage = (item) => {
  const images = getItemImages(item);
  if (images.length <= 1) return;
  item.currentImageIndex = item.currentImageIndex === 0 
    ? images.length - 1 
    : item.currentImageIndex - 1;
};

const removeFromWishlist = async (item) => {
  if (isRemoving.value) return;
  
  isRemoving.value = true;
  try {
    const response = await axios.delete(
      `/api/web/wishlist/${item.id}`,
      globalStore.getAxiosHeader()
    );

    if (response.data.result) {
      // Remove item from local array
      const index = wishlistItems.value.findIndex(i => i.id === item.id);
      if (index > -1) {
        wishlistItems.value.splice(index, 1);
      }
      calculateStats();
      showToast(t('item-removed-from-favorites'), 'success');
      
      // Emit event for other components
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } else {
      showToast(t('error-removing-item'), 'error');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    showToast(t('error-removing-item'), 'error');
  } finally {
    isRemoving.value = false;
  }
};

const clearAllFavorites = async () => {
  if (isClearing.value) return;
  
  isClearing.value = true;
  try {
    const response = await axios.delete(
      "/api/web/wishlist/clear",
      globalStore.getAxiosHeader()
    );

    if (response.data.result) {
      wishlistItems.value = [];
      calculateStats();
      showClearModal.value = false;
      showToast(t('all-favorites-cleared'), 'success');
      
      // Emit event for other components
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } else {
      showToast(t('error-clearing-favorites'), 'error');
    }
  } catch (error) {
    console.error('Error clearing favorites:', error);
    showToast(t('error-clearing-favorites'), 'error');
  } finally {
    isClearing.value = false;
  }
};

const viewItem = (item) => {
  if (item.type === 'location') {
    router.push(`/location/detail/${item.id}`);
  } else if (item.type === 'product') {
    router.push(`/product/detail/${item.id}`);
  }
};

const shareItem = async (item) => {
  const url = window.location.origin + (item.type === 'location' ? `/location/${item.id}` : `/product/${item.id}`);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: item.name,
        text: `Check out this ${item.type}: ${item.name}`,
        url: url
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    // Fallback - copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('link-copied'), 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast(t('error-copying-link'), 'error');
    }
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

const getDefaultImage = (type) => {
  return type === 'location' 
    ? 'https://placehold.co/400x300/19ADCF/ffffff?text=Location'
    : 'https://placehold.co/400x300/e74c3c/ffffff?text=Product';
};

const handleImageError = (event) => {
  const img = event.target;
  const card = img.closest('.wishlist-card, .wishlist-item');
  const badge = card?.querySelector('.item-type-badge');
  const type = badge?.classList.contains('location') ? 'location' : 'product';
  img.src = getDefaultImage(type);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return t('today');
  } else if (diffDays <= 7) {
    return t('days-ago', { days: diffDays });
  } else {
    return date.toLocaleDateString();
  }
};

const showToast = (message, type = 'info') => {
  const toast = {
    id: Date.now(),
    message,
    type
  };
  toasts.value.push(toast);
  
  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === toast.id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }, 3000);
};

const handleWishlistUpdate = async () => {
  // Reload data when wishlist is updated from other components
  await loadWishlistData();
};

// Lifecycle hooks
onMounted(async () => {
  // Load saved view mode
  const savedViewMode = localStorage.getItem('wishlist_view_mode');
  if (savedViewMode) {
    viewMode.value = savedViewMode;
  }

  await loadWishlistData();
  
  // Listen for wishlist updates from other components
  window.addEventListener('wishlist-updated', handleWishlistUpdate);
});

onUnmounted(() => {
  window.removeEventListener('wishlist-updated', handleWishlistUpdate);
});
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Page Header */
.page-header {
  background: #1A7E8C;
  color: white;
  padding: 60px 0 40px;
}

.header-content {
  text-align: center;
  margin-top: 50px;
}

.page-title {
  top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 2.5rem;
  font-weight: 700;
  /* margin-bottom: 10px; */
}

.heart-icon {
  width: 40px;
  height: 40px;
  color: #ff6b6b;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #ff6b6b;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background: white;
  border-radius: 12px;
  /* border: 1px solid #e1e5e9; */
  flex-wrap: wrap;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
}

.filter-tab {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #57b2bd;
  color: #57b2bd;
}

.filter-tab.active {
  background: #57b2bd;
  border-color: #57b2bd;
  color: white;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 10px 40px 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #57b2bd;
}

.view-toggle {
  display: flex;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

.view-btn:hover {
  background: #f8f9fa;
}

.view-btn.active {
  background: #57b2bd;
  color: white;
}

.clear-all-btn {
  padding: 10px 20px;
  background: #ff8d80;
  color: white;
  border: none;
  border-radius:30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #c0392b;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #57b2bd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon svg {
  width: 80px;
  height: 80px;
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 1.8rem;
  color: #666;
  margin-bottom: 10px;
}

.empty-state p {
  color: #999;
  margin-bottom: 30px;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: #57b2bd;
  color: white;
}

.cta-btn.primary:hover {
  background: #57b2bd;
}

.cta-btn.secondary {
  background: white;
  color: #57b2bd;
  border: 2px solid #57b2bd;
}

.cta-btn.secondary:hover {
  background: #57b2bd;
  color: white;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px 20px;
}

.clear-search-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #57b2bd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Grid View - Clean Cards without Shadows */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.wishlist-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.wishlist-card:hover {
  border-color: #57b2bd;
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wishlist-card:hover .item-image {
  transform: scale(1.02);
}

/* Navigation Buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;
}

.wishlist-card:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.nav-btn svg {
  width: 16px;
  height: 16px;
  color: #333;
}

/* Heart Button */
.heart-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
}

.heart-btn:hover {
  background: white;
  transform: scale(1.1);
}

.heart-btn svg {
  width: 20px;
  height: 20px;
  color: #e74c3c;
}

.heart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Year Badge */
.year-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #57b2bd;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-icon svg {
  width: 14px;
  height: 14px;
}

/* Image Dots */
.image-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.card-content {
  padding: 20px;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
}

.item-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rating-score {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 14px;
  height: 14px;
}

.star svg {
  width: 100%;
  height: 100%;
  color: #ddd;
}

.star.filled svg {
  color: #ffc107;
}

.rating-count {
  font-size: 0.85rem;
  color: #666;
}

.item-category {
  font-size: 0.9rem;
  color: #666;
  text-transform: capitalize;
}

/* List View */
.wishlist-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.wishlist-item {
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
  cursor: pointer;
}

.wishlist-item:hover {
  border-color: #57b2bd;
}

.item-image-container {
  position: relative;
  width: 200px;
  height: 150px;
  flex-shrink: 0;
}

.item-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.item-type-badge.location {
  background: #57b2bd;
  color: white;
}

.item-type-badge.product {
  background: #e74c3c;
  color: white;
}

.item-details {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.item-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.rating,
.views,
.price {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}

.rating {
  color: #f39c12;
}

.views {
  color: #666;
}

.price {
  color: #27ae60;
  font-weight: 600;
}

.star-icon,
.eye-icon,
.location-icon {
  width: 14px;
  height: 14px;
}

.item-location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 0.9rem;
  margin: 8px 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.added-date {
  font-size: 0.85rem;
  color: #999;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-left: 1px solid #e1e5e9;
  min-width: 120px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.primary {
  background: #57b2bd;
  color: white;
}

.action-btn.primary:hover {
  background: #57b2bd;
}

.action-btn.secondary {
  background: white;
  color: #57b2bd;
  border: 1px solid #57b2bd;
}

.action-btn.secondary:hover {
  background: #57b2bd;
  color: white;
}

.action-btn.danger {
  background: #e74c3c;
  color: white;
}

.action-btn.danger:hover {
  background: #c0392b;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  border: 1px solid #e1e5e9;
}

.modal-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 10px 20px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e1e5e9;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  background: #e74c3c;
  color: white;
}

.confirm-btn:hover {
  background: #c0392b;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1100;
}

.toast {
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  margin-bottom: 10px;
  border-left: 4px solid #57b2bd;
  animation: slideIn 0.3s ease;
}

.toast.success {
  border-left-color: #27ae60;
}

.toast.error {
  border-left-color: #e74c3c;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .stats-bar {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .filter-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .search-input {
    width: 200px;
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
  
  .wishlist-item {
    flex-direction: column;
  }
  
  .item-image-container {
    width: 100%;
    height: 200px;
  }
  
  .item-actions {
    flex-direction: row;
    border-left: none;
    border-top: 1px solid #e1e5e9;
    min-width: auto;
  }
  
  .item-header {
    flex-direction: column;
    align-items: start;
    gap: 10px;
  }
  
  .item-footer {
    flex-direction: column;
    align-items: start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }
  
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .heart-icon {
    width: 30px;
    height: 30px;
  }
  
  .search-input {
    width: 180px;
  }
  
  .nav-btn {
    display: none;
  }
  
  .image-dots {
    bottom: 8px;
  }
  
  .dot {
    width: 6px;
    height: 6px;
  }
}
</style>