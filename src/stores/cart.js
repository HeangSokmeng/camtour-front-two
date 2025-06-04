// stores/cart.js
import { defineStore } from 'pinia';
export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        showCartDrawer: false,
        userId: null,
    }),
    getters: {
        cartItemCount: (state) => state.items.length,
        cartTotalPrice: (state) => {
            return state.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        },
        hasItems: (state) => state.items.length > 0,
        formattedTotal: (state) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(state.cartTotalPrice);
        }
    },
    actions: {
        setUserId(id) {
            if (this.userId !== id) {
                this.userId = id;
                this.loadCartFromLocalStorage();
            }
        },
        clearUserId() {
            this.userId = null;
            this.items = [];
            this.saveCartToLocalStorage();
        },

        addToCart(tourPackage) {
            const existingItemIndex = this.items.findIndex(item =>
                item.id === tourPackage.id &&
                item.colorId === tourPackage.colorId &&
                item.sizeId === tourPackage.sizeId
            );
            if (existingItemIndex > -1) {
                const existingItem = this.items[existingItemIndex];
                const newQuantity = existingItem.quantity + tourPackage.quantity;
                if (tourPackage.maxQuantity && newQuantity > tourPackage.maxQuantity) {
                    return {
                        success: false,
                        message: `Cannot add more - only ${tourPackage.maxQuantity} spots are available in total`
                    };
                }
                this.items[existingItemIndex].quantity = newQuantity;
            } else {
                this.items.push({
                    ...tourPackage,
                    addedAt: new Date().toISOString()
                });
            }
            this.saveCartToLocalStorage();
            this.showCartDrawer = true;
            return {
                success: true,
                message: `Added ${tourPackage.quantity} spot(s) for "${tourPackage.name}" to your cart`
            };
        },
        updateItemQuantity(itemId, colorId, sizeId, newQuantity) {
            const index = this.items.findIndex(item =>
                item.id === itemId &&
                item.colorId === colorId &&
                item.sizeId === sizeId
            );
            if (index > -1 && newQuantity > 0) {
                this.items[index].quantity = newQuantity;
                this.saveCartToLocalStorage();
                return true;
            }
            return false;
        },
        removeItem(itemId, colorId, sizeId) {
            this.items = this.items.filter(item =>
                !(item.id === itemId &&
                    item.colorId === colorId &&
                    item.sizeId === sizeId)
            );
            this.saveCartToLocalStorage();
        },
        clearCart() {
            this.items = [];
            this.saveCartToLocalStorage();
        },
        toggleCartDrawer() {
            this.showCartDrawer = !this.showCartDrawer;
        },
        loadCartFromLocalStorage() {
            const cartKey = this.userId ? `tourCart_${this.userId}` : 'tourCart_guest';
            const savedCart = localStorage.getItem(cartKey);
            if (savedCart) {
                try {
                    this.items = JSON.parse(savedCart);
                } catch (error) {
                    console.error('Failed to parse cart from localStorage:', error);
                    this.items = [];
                }
            } else {
                this.items = [];
            }
        },
        saveCartToLocalStorage() {
            const cartKey = this.userId ? `tourCart_${this.userId}` : 'tourCart_guest';
            localStorage.setItem(cartKey, JSON.stringify(this.items));
        },
        migrateGuestCart() {
            if (!this.userId) return;
            const guestCartKey = 'tourCart_guest';
            const guestCart = localStorage.getItem(guestCartKey);
            if (guestCart) {
                try {
                    this.loadCartFromLocalStorage();
                    const guestItems = JSON.parse(guestCart);
                    if (guestItems && guestItems.length > 0) {
                        guestItems.forEach(item => {
                            this.addToCart(item);
                        });
                        localStorage.removeItem(guestCartKey);
                    }
                } catch (error) {
                    console.error('Failed to migrate guest cart:', error);
                }
            }
        }
    }
});