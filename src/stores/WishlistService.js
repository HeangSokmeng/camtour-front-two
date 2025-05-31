import axios from "axios";

class WishlistService {
  constructor() {
    this.items = [];
    this.isInitialized = false;
    this.currentUserId = null;
    this.syncInProgress = false;
    this.globalStore = null;
  }

  getGlobalStore() {
    if (!this.globalStore) {
      try {
        const { useGlobalStore } = require("@/stores/global");
        this.globalStore = useGlobalStore();
      } catch (error) {
        return null;
      }
    }
    return this.globalStore;
  }

  async countItem() {
    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore || !this.currentUserId) {
        return 0;
      }
      const response = await axios.get('/api/web/wishlist/count', globalStore.getAxiosHeader());
      return response.data?.data?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  async initialize() {
    if (this.isInitialized && !this.hasUserContextChanged()) {
      return;
    }
    
    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore) {
        setTimeout(() => this.initialize(), 100);
        return;
      }

      const isAuthenticated = globalStore.getIsAuthenticated;
      if (isAuthenticated && globalStore.profile?.id) {
        this.currentUserId = globalStore.profile.id;
        await this.loadFromAPI();
      } else {
        this.currentUserId = null;
        this.items = [];
      }

      this.isInitialized = true;
      this.notifyUpdate();
    } catch (error) {
      this.items = [];
      this.isInitialized = true;
      this.notifyUpdate();
    }
  }

  hasUserContextChanged() {
    const globalStore = this.getGlobalStore();
    if (!globalStore) return false;
    const currentUserId = globalStore.profile?.id || null;
    return this.currentUserId !== currentUserId;
  }

  async loadFromAPI() {
    if (!this.currentUserId) {
      this.items = [];
      return;
    }

    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore) {
        this.items = [];
        return;
      }

      const response = await axios.get('/api/web/wishlist', globalStore.getAxiosHeader());
      
      if (response.data.result) {
        const wishlistData = response.data.data;
        this.items = Array.isArray(wishlistData) ? wishlistData : [];
      } else {
        this.items = [];
      }
    } catch (error) {
      this.items = [];
      if (error.response?.status !== 401) {
        const globalStore = this.getGlobalStore();
        if (globalStore) {
          await globalStore.onCheckError(error);
        }
      }
    }
  }

  async saveItemToAPI(item, action = 'add') {
    if (!this.currentUserId || this.syncInProgress) {
      return false;
    }

    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore) {
        return false;
      }

      const headers = globalStore.getAxiosHeader();
      let response;

      switch (action) {
        case 'add': {
          const requestData = this.prepareAPIRequestData(item);
          response = await axios.post('/api/web/wishlist', requestData, headers);
          break;
        }
        case 'remove': {
          // const itemType = this.determineItemType(item);
          response = await axios.delete(
            `/api/web/wishlist/${item.id}`,
            headers
          );
          break;
        }
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      return response.data.result || false;
    } catch (error) {
      if (error.response?.status !== 401) {
        const globalStore = this.getGlobalStore();
        if (globalStore) {
          await globalStore.onCheckError(error);
        }
      }
      return false;
    }
  }

  async syncWithAPI() {
    if (!this.currentUserId || this.syncInProgress) {
      return false;
    }

    this.syncInProgress = true;
    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore) {
        return false;
      }

      const syncData = {
        items: this.items.map(item => ({
          item_id: String(item.id),
          item_type: item.type || this.determineItemType(item),
          item_data: item.originalData || item
        }))
      };

      const response = await axios.put('/api/web/wishlist/sync', syncData, globalStore.getAxiosHeader());
      return response.data.result || false;
    } catch (error) {
      if (error.response?.status !== 401) {
        const globalStore = this.getGlobalStore();
        if (globalStore) {
          await globalStore.onCheckError(error);
        }
      }
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  determineItemType(item) {
    if (item.type) return item.type;
    if (item.product_id || item.product_name) return 'product';
    return 'location';
  }

  prepareAPIRequestData(item) {
    const itemType = this.determineItemType(item);
    const itemId = item.id || item.product_id;
    
    if (!itemId) {
      throw new Error('Item ID is required for API request');
    }

    return {
      item_id: String(itemId),
      item_type: itemType,
      item_data: this.prepareItemData(item)
    };
  }
  
  prepareItemData(item) {
    const baseData = {
      name: item.name || item.product_name || 'Unknown Item',
      image: item.is_thumbnail || item.image || '',
      addedAt: new Date().toISOString(),
    };

    if (this.determineItemType(item) === 'product') {
      return {
        ...baseData,
        product_name: item.product_name || item.name,
        price: item.price || null,
        color: item.color || '',
        size: item.size || '',
        qty: item.qty || 0,
      };
    } else {
      return {
        ...baseData,
        location: item.location || item.name_local || '',
        rating: item.rate_star || 0,
        views: item.total_view || 0,
        name_local: item.name_local || '',
      };
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized || this.hasUserContextChanged()) {
      await this.initialize();
    }
  }

  validateItem(item) {
    if (!item) return false;
    const itemId = item.id || item.product_id;
    return !!itemId;
  }

  createWishlistItem(item) {
    const itemId = item.id || item.product_id;

    return {
      id: itemId,
      name: item.name || item.product_name || 'Unknown Item',
      location: item.location || item.name_local || '',
      image: item.is_thumbnail || item.image || 'https://placehold.co/400x300/19ADCF/ffffff?text=Camtour',
      price: item.price || null,
      rating: item.rate_star || 0,
      views: item.total_view || 0,
      type: this.determineItemType(item),
      addedAt: new Date().toISOString(),
      userId: this.currentUserId,
      originalData: { ...item }
    };
  }

  async addItem(item) {
    if (!this.currentUserId) return false;
    
    await this.ensureInitialized();

    if (!this.validateItem(item)) return false;

    const itemId = item.id || item.product_id;
    if (this.isInWishlist(itemId)) return false;

    try {
      const wishlistItem = this.createWishlistItem(item);
      const success = await this.saveItemToAPI(wishlistItem, 'add');

      if (success) {
        this.items.unshift(wishlistItem);
        this.notifyUpdate();
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async removeItem(itemId) {
    if (!this.currentUserId) return false;
    
    await this.ensureInitialized();

    try {
      const itemToRemove = this.items.find(item => item.id === itemId);
      if (!itemToRemove) return false;

      const success = await this.saveItemToAPI(itemToRemove, 'remove');

      if (success) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.notifyUpdate();
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  isInWishlist(itemId) {
    return this.items.some(item => item.id === itemId);
  }

  async getItems() {
    await this.ensureInitialized();
    return [...this.items];
  }

  async getCount() {
    await this.ensureInitialized();
    return this.items.length;
  }

  async clearWishlist() {
    if (!this.currentUserId) return false;
    
    await this.ensureInitialized();

    try {
      const globalStore = this.getGlobalStore();
      if (!globalStore) return false;

      const response = await axios.delete('/api/web/wishlist/clear', globalStore.getAxiosHeader());
      
      if (response.data.result) {
        this.items = [];
        this.notifyUpdate();
        return true;
      }

      return false;
    } catch (error) {
      if (error.response?.status !== 401) {
        const globalStore = this.getGlobalStore();
        if (globalStore) {
          await globalStore.onCheckError(error);
        }
      }
      return false;
    }
  }

  async toggleItem(item) {
    const itemId = item.id || item.product_id;
    return this.isInWishlist(itemId) 
      ? await this.removeItem(itemId) 
      : await this.addItem(item);
  }

  async syncWithServer() {
    await this.ensureInitialized();

    if (this.currentUserId) {
      await this.loadFromAPI();
    } else {
      this.items = [];
    }

    this.notifyUpdate();
  }

  async handleUserLogin(userId) {
    this.currentUserId = userId;
    this.isInitialized = false;
    await this.initialize();
    this.notifyUpdate();
  }

  async handleUserLogout() {
    this.currentUserId = null;
    this.items = [];
    this.isInitialized = false;
    await this.initialize();
  }

  notifyUpdate() {
    const event = new CustomEvent('wishlist-updated', {
      detail: {
        items: [...this.items],
        userId: this.currentUserId,
        count: this.items.length,
        timestamp: Date.now()
      }
    });

    window.dispatchEvent(event);
  }

  getItemsByType(type) {
    return this.items.filter(item => item.type === type);
  }

  searchItems(query) {
    if (!query || typeof query !== 'string') {
      return [...this.items];
    }

    const lowercaseQuery = query.toLowerCase().trim();

    return this.items.filter(item =>
      (item.name && item.name.toLowerCase().includes(lowercaseQuery)) ||
      (item.location && item.location.toLowerCase().includes(lowercaseQuery)) ||
      (item.product_name && item.product_name.toLowerCase().includes(lowercaseQuery))
    );
  }

  getStats() {
    const locationItems = this.items.filter(item => item.type === 'location');
    const productItems = this.items.filter(item => item.type === 'product');

    const stats = {
      totalItems: this.items.length,
      locations: locationItems.length,
      products: productItems.length,
      averageRating: 0,
      totalValue: 0,
      userId: this.currentUserId,
      lastUpdated: new Date().toISOString()
    };

    if (this.items.length > 0) {
      const itemsWithRating = this.items.filter(item => item.rating > 0);
      if (itemsWithRating.length > 0) {
        const ratingsSum = itemsWithRating.reduce((sum, item) => sum + item.rating, 0);
        stats.averageRating = Math.round((ratingsSum / itemsWithRating.length) * 10) / 10;
      }

      const itemsWithPrice = this.items.filter(item => item.price > 0);
      if (itemsWithPrice.length > 0) {
        stats.totalValue = itemsWithPrice.reduce((sum, item) => sum + item.price, 0);
      }
    }

    return stats;
  }

  exportData() {
    return {
      items: this.items.map(item => ({
        ...item,
        exportedAt: new Date().toISOString()
      })),
      stats: this.getStats(),
      metadata: {
        version: '1.0',
        userId: this.currentUserId,
        exportedAt: new Date().toISOString()
      }
    };
  }

  async importData(data) {
    if (!this.currentUserId) return false;
    
    try {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Invalid import data format');
      }

      await this.ensureInitialized();

      const globalStore = this.getGlobalStore();
      if (!globalStore) return false;

      const validItems = data.items.filter(item => this.validateItem(item));
      
      const importData = {
        items: validItems.map(item => ({
          item_id: String(item.id),
          item_type: item.type || this.determineItemType(item),
          item_data: item
        }))
      };

      const response = await axios.post('/api/web/wishlist/import', importData, globalStore.getAxiosHeader());
      
      if (response.data.result) {
        await this.loadFromAPI();
        this.notifyUpdate();
        return true;
      }

      return false;
    } catch (error) {
      if (error.response?.status !== 401) {
        const globalStore = this.getGlobalStore();
        if (globalStore) {
          await globalStore.onCheckError(error);
        }
      }
      return false;
    }
  }
}

const wishlistService = new WishlistService();

wishlistService.initialize().catch(console.error);

window.addEventListener('user-login', (event) => {
  const { userId } = event.detail || {};
  if (userId) {
    wishlistService.handleUserLogin(userId).catch(console.error);
  }
});

window.addEventListener('user-logout', () => {
  wishlistService.handleUserLogout().catch(console.error);
});

window.addEventListener('online', () => {
  if (wishlistService.currentUserId) {
    wishlistService.syncWithServer().catch(console.error);
  }
});

export default wishlistService;