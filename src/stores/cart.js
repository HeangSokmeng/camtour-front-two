// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        showCartDrawer: false,
        userId: null, // Add userId to track cart ownership
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
        // Set current user ID when user logs in
        setUserId(id) {
            // Only load a different cart if the user ID actually changed
            if (this.userId !== id) {
                this.userId = id;
                this.loadCartFromLocalStorage(); // Reload cart with user-specific data
            }
        },
        
        // Clear user ID when user logs out
        clearUserId() {
            this.userId = null;
            this.items = []; // Clear the cart when user logs out
            this.saveCartToLocalStorage();
        },

        addToCart(tourPackage) {
            // Check if the item is already in the cart
            const existingItemIndex = this.items.findIndex(item =>
                item.id === tourPackage.id &&
                item.colorId === tourPackage.colorId &&
                item.sizeId === tourPackage.sizeId
            );

            if (existingItemIndex > -1) {
                // Update quantity if the same item is already in the cart
                const existingItem = this.items[existingItemIndex];
                const newQuantity = existingItem.quantity + tourPackage.quantity;

                // Check if new quantity exceeds available spots
                if (tourPackage.maxQuantity && newQuantity > tourPackage.maxQuantity) {
                    // Show notification about max quantity
                    return {
                        success: false,
                        message: `Cannot add more - only ${tourPackage.maxQuantity} spots are available in total`
                    };
                }

                // Update quantity
                this.items[existingItemIndex].quantity = newQuantity;
            } else {
                // Add new item
                this.items.push({
                    ...tourPackage,
                    addedAt: new Date().toISOString()
                });
            }

            // Save to local storage
            this.saveCartToLocalStorage();

            // Open the cart drawer
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
            // Use user-specific cart key if user is logged in
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
                this.items = []; // Clear cart if no saved cart exists
            }
        },

        saveCartToLocalStorage() {
            // Use user-specific cart key if user is logged in
            const cartKey = this.userId ? `tourCart_${this.userId}` : 'tourCart_guest';
            localStorage.setItem(cartKey, JSON.stringify(this.items));
        },
        
        // Migrate guest cart to user cart after login
        migrateGuestCart() {
            if (!this.userId) return; // Only proceed if user is logged in
            
            const guestCartKey = 'tourCart_guest';
            const guestCart = localStorage.getItem(guestCartKey);
            
            if (guestCart) {
                try {
                    // Load current user cart first
                    this.loadCartFromLocalStorage();
                    
                    // Get guest cart items
                    const guestItems = JSON.parse(guestCart);
                    
                    // Add guest items to user cart if not empty
                    if (guestItems && guestItems.length > 0) {
                        // Merge items (could add logic to handle duplicates better)
                        guestItems.forEach(item => {
                            // Use the existing addToCart method to handle duplicates properly
                            this.addToCart(item);
                        });
                        
                        // Clear guest cart after migration
                        localStorage.removeItem(guestCartKey);
                    }
                } catch (error) {
                    console.error('Failed to migrate guest cart:', error);
                }
            }
        }
    }
});