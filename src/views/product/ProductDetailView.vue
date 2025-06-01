<template>
  <div class="product-detail-container hiking-theme">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader"></div>
      <p>Loading product details...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="error-message">
      <div class="error-icon">!</div>
      <h3>{{ error }}</h3>
      <button @click="fetchProductData" class="retry-btn">Try Again</button>
    </div>

    <!-- Product Details Content -->
    <div v-else-if="product" class="content-container">
      <div class="breadcrumb fade-in">
        <router-link to="/">Home</router-link> &gt;
        <router-link to="/product">Hiking Gear</router-link> &gt;
        <span>{{ product.name }}</span>
      </div>

      <div class="product-detail-layout">
        <!-- Product Images Section -->
        <div class="product-gallery slide-right">
          <div class="main-image-container">
            <img
              :src="mainImage"
              :alt="product.name"
              class="main-image"
              @error="handleImageError"
            />
            <div v-if="product.status === 'published'" class="product-badge published">
              {{ product.status.toUpperCase() }}
            </div>
          </div>

          <div class="thumbnail-gallery" v-if="productImages.length > 0">
            <div
              v-for="(image, index) in productImages"
              :key="index"
              class="thumbnail-item"
              :class="{ active: index === activeImageIndex }"
              @click="setActiveImage(index)"
            >
              <img
                :src="image"
                :alt="`${product.name} - view ${index + 1}`"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- Product Info Section -->
        <div class="product-info slide-left">
          <div class="product-header">
            <div class="brand-tag" v-if="product.brand">{{ product.brand.name }}</div>
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-subtitle" v-if="product.name_km">
              {{ product.name_km }}
            </div>
          </div>

          <div class="rating-container">
            <div class="rating-stars">
              <template v-if="averageRating > 0">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star-icon"
                  :class="getStarClass(n)"
                ></span>
              </template>
              <template v-else>
                <span v-for="n in 5" :key="n" class="star-icon"></span>
              </template>
            </div>
            <span class="review-count"
              >({{ product.stars ? product.stars.length : 0 }} Reviews)</span
            >
          </div>

          <div class="product-price-box">
            <div class="price-label">Price</div>
            <div class="product-price">${{ selectedVariantPrice || product.price }}</div>
          </div>

          <div class="product-meta">
            <div class="product-code">Reference: {{ product.code }}</div>
            <div class="product-brand" v-if="product.brand">
              Brand: {{ product.brand.name }}
            </div>
            <div class="product-views">Views: {{ product.total_views || 0 }}</div>
          </div>

          <div class="product-categories">
            <span class="category-tag" v-if="product.category">{{
              product.category.name
            }}</span>
            <span class="category-tag" v-if="product.pcategory">{{
              product.pcategory.name
            }}</span>
          </div>

          <!-- Product description preview -->
          <div class="product-description-preview">
            <p>{{ product.description }}</p>
          </div>

          <!-- Color Selection -->
          <div class="product-colors" v-if="product.colors && product.colors.length > 0">
            <h3>Color Options</h3>
            <div class="color-options">
              <button
                v-for="color in product.colors"
                :key="color.id"
                class="color-option"
                :class="{ active: selectedColor === color.id }"
                @click="selectColor(color.id)"
              >
                {{ color.name }}
              </button>
            </div>
          </div>

          <!-- Size Selection -->
          <div class="product-sizes" v-if="product.sizes && product.sizes.length > 0">
            <h3>Size Options</h3>
            <div class="size-options">
              <button
                v-for="size in product.sizes"
                :key="size.id"
                class="size-option"
                :class="{ active: selectedSize === size.id }"
                @click="selectSize(size.id)"
              >
                {{ size.size }}
              </button>
            </div>
          </div>

          <!-- Quantity Selection -->
          <div class="product-quantity">
            <h3>Quantity</h3>
            <div class="quantity-control">
              <button @click="decrementQuantity" class="quantity-btn">-</button>
              <input type="number" v-model.number="quantity" min="1" :max="maxQuantity" />
              <button @click="incrementQuantity" class="quantity-btn">+</button>
            </div>
            <p class="stock-info" :class="{ 'low-stock': isLowStock }">
              {{ stockMessage }}
            </p>
          </div>

          <!-- Add to Cart Button -->
          <div class="action-buttons">
            <button @click="addToCart" class="add-to-cart-btn" :disabled="!canAddToCart">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                  fill="currentColor"
                ></path>
              </svg>
              Add To Cart
            </button>

            <!-- <button
              @click="toggleFavorite"
              class="favorite-btn"
              :class="{ active: isFavorite }"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
            </button> -->
          </div>
        </div>
      </div>

      <!-- Product Features -->
      <div class="product-features slide-up">
        <h2 class="section-title">Product Features</h2>
        <div class="features-container">
          <div class="feature-item">
            <div class="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
              </svg>
            </div>
            <h3>Waterproof Design</h3>
            <p>Stay dry in all conditions with our waterproof gear technology</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
            </div>
            <h3>Lightweight</h3>
            <p>
              Ultra-light materials for easy transport without compromising durability
            </p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
            </div>
            <h3>Premium Quality</h3>
            <p>Built to last with premium materials and expert craftsmanship</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>User-Friendly</h3>
            <p>Intuitive design for quick setup and hassle-free usage</p>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="product-description-section">
        <h2 class="section-title">Product Description</h2>
        <div class="description-tabs">
          <div class="tab-headers">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              class="tab-header"
              :class="{ active: activeTab === index }"
              @click="activeTab = index"
            >
              {{ tab.name }}
            </button>
          </div>

          <div class="tab-content" :class="{ active: activeTab === 0 }">
            <div class="tab-content-inner">
              <p>{{ product.description }}</p>
              <p>
                This premium hiking gear is designed for outdoor enthusiasts who demand
                quality and performance. Built with durable materials and expert
                craftsmanship, this product will stand up to the harshest conditions while
                providing comfort and reliability on the trail.
              </p>
              <p>
                Whether you're planning a weekend camping trip or a serious backpacking
                expedition, this gear will help ensure your adventure is successful and
                enjoyable.
              </p>
            </div>
          </div>

          <div class="tab-content" :class="{ active: activeTab === 1 }">
            <div class="tab-content-inner">
              <h4>Product Specifications</h4>
              <ul class="specifications-list">
                <li><strong>Material:</strong> High-grade weatherproof fabric</li>
                <li><strong>Weight:</strong> 2.5 lbs (1.1 kg)</li>
                <li><strong>Dimensions:</strong> 12" x 10" x 5" when packed</li>
                <li>
                  <strong>Color Options:</strong>
                  <span v-for="(color, index) in product.colors" :key="color.id">
                    {{ color.name }}{{ index < product.colors.length - 1 ? ", " : "" }}
                  </span>
                </li>
                <li>
                  <strong>Size Options:</strong>
                  <span v-for="(size, index) in product.sizes" :key="size.id">
                    {{ size.size }}{{ index < product.sizes.length - 1 ? ", " : "" }}
                  </span>
                </li>
                <li><strong>Warranty:</strong> 1-year limited manufacturer warranty</li>
              </ul>
            </div>
          </div>

          <div class="tab-content" :class="{ active: activeTab === 2 }">
            <div class="tab-content-inner">
              <div class="reviews-container">
                <!-- Review Stats -->
                <div class="review-stats">
                  <div class="average-rating">
                    <div class="big-rating">{{ averageRating.toFixed(1) }}</div>
                    <div class="rating-stars">
                      <template v-if="averageRating > 0">
                        <span
                          v-for="n in 5"
                          :key="n"
                          class="star-icon"
                          :class="getStarClass(n)"
                        ></span>
                      </template>
                    </div>
                    <div class="review-count">
                      {{ product.stars ? product.stars.length : 0 }} reviews
                    </div>
                  </div>
                </div>

                <!-- Review List -->
                <div class="review-list">
                  <div v-if="product.stars && product.stars.length > 0">
                    <div
                      v-for="review in product.stars"
                      :key="review.id"
                      class="review-item"
                    >
                      <div class="review-header">
                        <div class="reviewer-info">
                          <div class="reviewer-name">{{ review.rater_name }}</div>
                          <div class="review-date">
                            {{ formatDate(review.created_at || new Date()) }}
                          </div>
                        </div>
                        <div class="review-rating">
                          <span
                            v-for="n in 5"
                            :key="n"
                            class="star-icon"
                            :class="{ filled: n <= review.star }"
                          ></span>
                        </div>
                      </div>
                      <div class="review-content">
                        <p>{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                </div>

                <!-- Review Form -->
                <div class="review-section">
                  <h3>Write a Review</h3>

                  <!-- Login status debugging (remove in production) -->
                  <div class="login-status">
                    <p>Login Status: {{ isLoggedIn ? "Logged In" : "Not Logged In" }}</p>
                    <p v-if="globalStore.user">Welcome, {{ globalStore.user.name }}</p>
                    <button @click="checkLoginStatus" class="debug-button">
                      Verify Login Status
                    </button>
                  </div>

                  <div v-if="isLoggedIn" class="review-form">
                    <div class="rating-input">
                      <label>Your Rating:</label>
                      <div class="star-rating">
                        <span
                          v-for="n in 5"
                          :key="n"
                          class="star-input"
                          :class="{ filled: n <= userRating }"
                          @click="userRating = n"
                          >★</span
                        >
                      </div>
                    </div>
                    <div class="comment-input">
                      <label>Your Review:</label>
                      <textarea
                        v-model="userComment"
                        rows="4"
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    <button
                      @click="submitReview"
                      class="submit-review-btn"
                      :disabled="!canSubmitReview"
                    >
                      Submit Review
                    </button>
                  </div>
                  <div v-else class="login-to-review">
                    <p>
                      Please <router-link to="/login">log in</router-link> to write a
                      review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products Section -->
      <div class="related-products-section slide-up" v-if="relatedProducts.length > 0">
        <h2 class="section-title">Related Products</h2>
        <div class="related-products-grid">
          <div
            v-for="(item, index) in relatedProducts"
            :key="item.id"
            class="product-card hover-float"
            :class="`delay-${(index + 1) * 100}`"
          >
            <router-link :to="`/product/detail/${item.id}`">
              <div class="product-card-inner">
                <div v-if="item.status === 'published'" class="product-label sale">
                  NEW
                </div>
                <img
                  :src="getProductImage(item)"
                  :alt="item.name"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="quick-action">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div class="product-info">
                  <div class="product-category" v-if="item.category">
                    {{ item.category.name }}
                  </div>
                  <h3 class="product-brand">{{ item.name }}</h3>
                  <p class="product-name" v-if="item.name_km">{{ item.name_km }}</p>
                  <div class="product-price">
                    <span class="current-price">${{ item.price }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Success message when item is added to cart -->
    <div v-if="showAddedMessage" class="added-success-message">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Added to cart!</span>
    </div>
  </div>
</template>
<script setup>
import { useCartStore } from "@/stores/cart";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Route and store setup
const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const cartStore = useCartStore();
const showSuccessNotification = inject("showSuccessNotification", null);
const showErrorNotification = inject("showErrorNotification", null);

// State variables
const product = ref(null);
const relatedProducts = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedColor = ref(null);
const selectedSize = ref(null);
const quantity = ref(1);
const favorites = ref([]);
const activeImageIndex = ref(0);
const selectedVariant = ref(null);
const selectedVariantPrice = ref(null);
const showAddedMessage = ref(false);
const activeTab = ref(0);
const tabs = [{ name: "Description" }, { name: "Specifications" }, { name: "Reviews" }];

// Review functionality
const userRating = ref(0);
const userComment = ref("");
const isSubmittingReview = ref(false);

// Computed properties
const isLoggedIn = computed(() => globalStore.isLogin);

// const isFavorite = computed(() => {
//   return favorites.value.includes(product.value?.id);
// });

const averageRating = computed(() => {
  if (!product.value?.stars || product.value.stars.length === 0) {
    return 0;
  }
  const sum = product.value.stars.reduce((total, review) => total + review.star, 0);
  return sum / product.value.stars.length;
});

const canSubmitReview = computed(() => {
  return (
    userRating.value > 0 &&
    userComment.value.trim().length > 0 &&
    !isSubmittingReview.value
  );
});

const mainImage = computed(() => {
  if (productImages.value.length > 0) {
    return productImages.value[activeImageIndex.value];
  }
  return placeholderImage;
});

const productImages = computed(() => {
  const images = [];

  // Add main thumbnail image if available
  if (product.value?.thumbnail) {
    images.push(product.value.thumbnail);
  }

  // Add additional images if available
  if (product.value?.images && product.value.images.length > 0) {
    product.value.images.forEach((img) => {
      if (img.image_url) {
        images.push(img.image_url);
      }
    });
  }

  // Return placeholder if no images
  if (images.length === 0) {
    images.push(placeholderImage);
  }

  return images;
});

const maxQuantity = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.qty || 0;
  }

  // If no variant is selected, use the first variant or default to 20
  const variant = product.value?.variants?.[0];
  return variant ? variant.qty : 20;
});

const isLowStock = computed(() => {
  return maxQuantity.value > 0 && maxQuantity.value < 5;
});

const stockMessage = computed(() => {
  if (maxQuantity.value <= 0) {
    return "Out of Stock";
  } else if (isLowStock.value) {
    return `Low Stock: Only ${maxQuantity.value} Left`;
  } else {
    return `${maxQuantity.value} In Stock`;
  }
});

const canAddToCart = computed(() => {
  return maxQuantity.value > 0 && quantity.value <= maxQuantity.value;
});

// Placeholder image for error handling
const placeholderImage = "https://placehold.co/400x300/E9967A/ffffff?text=Hiking+Gear";

// Methods
const fetchProductData = async () => {
  const productId = route.params.id;
  if (!productId) {
    router.push("/product");
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/api/web/view/product/${productId}`, {
      ...globalStore.getAxiosHeader(),
    });

    if (response.data.result) {
      // Update the data structure to match our expected format
      product.value = response.data.data.product || response.data.data;

      // Set default selected options
      if (product.value.colors && product.value.colors.length > 0) {
        selectColor(product.value.colors[0].id);
      }

      if (product.value.sizes && product.value.sizes.length > 0) {
        selectSize(product.value.sizes[0].id);
      } else {
        // If no sizes, just update the selected variant
        updateSelectedVariant();
      }

      // Fetch related products from response or make a separate call
      if (response.data.data.related_products) {
        relatedProducts.value = response.data.data.related_products;
      } else {
        fetchRelatedProducts();
      }
    } else {
      error.value = response.data.message || "Failed to load product details";
    }
  } catch (err) {
    console.error("Error fetching product data:", err);
    error.value = "An error occurred while loading product details";
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
};

const fetchRelatedProducts = async () => {
  if (!product.value || !product.value.category_id) return;

  try {
    const response = await axios.get("/api/web/view/product", {
      params: {
        category_id: product.value.category_id,
        limit: 4,
        exclude_id: product.value.id,
      },
      ...globalStore.getAxiosHeader(),
    });

    if (response.data.result) {
      relatedProducts.value = response.data.data || [];
    }
  } catch (err) {
    console.error("Error fetching related products:", err);
  }
};

const submitReview = async () => {
  if (!isLoggedIn.value || !canSubmitReview.value) return;

  isSubmittingReview.value = true;

  try {
    const response = await axios.post(
      `/api/web/product/reviews/${product.value.id}`,
      {
        star: userRating.value,
        comment: userComment.value,
      },
      {
        ...globalStore.getAxiosHeader(),
      }
    );

    if (response.data.result) {
      // Add the new review to the product.stars array
      if (!product.value.stars) {
        product.value.stars = [];
      }

      product.value.stars.push({
        id: response.data.data?.id || Date.now(),
        product_id: product.value.id,
        star: userRating.value,
        comment: userComment.value,
        rater_id: globalStore.user?.id,
        rater_name: globalStore.user?.name || "User",
        created_at: new Date(),
      });

      // Reset form
      userRating.value = 0;
      userComment.value = "";

      if (showSuccessNotification) {
        showSuccessNotification("Your review has been submitted successfully!");
      }
    } else {
      if (showErrorNotification) {
        showErrorNotification(response.data.message || "Failed to submit review");
      }
    }
  } catch (err) {
    console.error("Error submitting review:", err);
    if (showErrorNotification) {
      showErrorNotification("An error occurred while submitting your review");
    }
  } finally {
    isSubmittingReview.value = false;
  }
};

const getStarClass = (position) => {
  if (position <= Math.floor(averageRating.value)) {
    return "filled";
  } else if (
    position === Math.ceil(averageRating.value) &&
    !Number.isInteger(averageRating.value)
  ) {
    return "half";
  }
  return "";
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getProductImage = (item) => {
  // Use image_url property if available
  if (item.thumbnail_url) {
    return item.thumbnail_url;
  } else if (item.thumbnail) {
    return item.thumbnail;
  }
  // Fall back to placeholder
  return placeholderImage;
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

const setActiveImage = (index) => {
  activeImageIndex.value = index;
};

const selectColor = (colorId) => {
  selectedColor.value = colorId;
  updateSelectedVariant();
};

const selectSize = (sizeId) => {
  selectedSize.value = sizeId;
  updateSelectedVariant();
};

const updateSelectedVariant = () => {
  if (!product.value?.variants || product.value.variants.length === 0) {
    selectedVariant.value = null;
    selectedVariantPrice.value = product.value?.price || null;
    return;
  }

  // Find a variant that matches both color and size if possible
  const matchingVariant = product.value.variants.find((variant) => {
    const colorMatch = !selectedColor.value || variant.color_id === selectedColor.value;
    const sizeMatch = !selectedSize.value || variant.size_id === selectedSize.value;
    return colorMatch && sizeMatch;
  });

  // Update the selected variant and its price
  selectedVariant.value = matchingVariant || product.value.variants[0];
  selectedVariantPrice.value = selectedVariant.value?.price || product.value.price;

  // Reset quantity if it's greater than available stock
  if (quantity.value > maxQuantity.value) {
    quantity.value = Math.max(1, maxQuantity.value);
  }
};
const incrementQuantity = () => {
  if (quantity.value < maxQuantity.value) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// const toggleFavorite = () => {
//   const productId = product.value?.id;
//   if (!productId) return;

//   const index = favorites.value.indexOf(productId);
//   if (index === -1) {
//     favorites.value.push(productId);
//   } else {
//     favorites.value.splice(index, 1);
//   }

//   // Store favorites in local storage
//   localStorage.setItem("hikingFavorites", JSON.stringify(favorites.value));
// };

const addToCart = () => {
  // Create a product object with all the necessary information
  const productItem = {
    id: product.value.id,
    name: product.value.name,
    name_km: product.value.name_km,
    code: product.value.code,
    price: selectedVariantPrice.value || product.value.price,
    quantity: quantity.value,
    image: mainImage.value,
    colorId: selectedColor.value,
    colorName: getSelectedColorName(),
    sizeId: selectedSize.value,
    sizeName: getSelectedSizeName(),
    variantId: selectedVariant.value?.id,
    brand: product.value.brand?.name,
    category: product.value.category?.name,
    pcategory: product.value.pcategory?.name,
    maxQuantity: maxQuantity.value,
  };

  // Use the cart store to add the product
  const result = cartStore.addToCart(productItem);

  // Show notification based on the result
  if (result.success) {
    // Show the added message
    showAddedMessage.value = true;
    setTimeout(() => {
      showAddedMessage.value = false;
    }, 3000);

    if (showSuccessNotification) {
      showSuccessNotification(result.message);
    }
  } else {
    if (showErrorNotification) {
      showErrorNotification(result.message);
    }
  }
};

// Helper functions to get selected option names
const getSelectedColorName = () => {
  if (!selectedColor.value || !product.value?.colors) return null;
  const color = product.value.colors.find((c) => c.id === selectedColor.value);
  return color ? color.name : null;
};

const getSelectedSizeName = () => {
  if (!selectedSize.value || !product.value?.sizes) return null;
  const size = product.value.sizes.find((s) => s.id === selectedSize.value);
  return size ? size.size : null;
};

// Debug helper function
const checkLoginStatus = () => {
  console.log("Global store:", globalStore);
  console.log("User object:", globalStore.user);
  console.log("Auth token:", globalStore.getAuth());
  console.log("Is logged in computed:", isLoggedIn.value);

  // You can call this from browser console: app.__vue__.checkLoginStatus()
  // Add the component to window for easy debugging
  if (typeof window !== "undefined") {
    window.productDetailComponent = {
      checkLogin: checkLoginStatus,
      globalStore,
      isLoggedIn,
    };
  }

  return {
    user: globalStore.user,
    isLoggedIn: isLoggedIn.value,
    token: globalStore.getAuth(),
  };
};

// Lifecycle hooks
onMounted(() => {
  // Debug login status
  console.log("Global store user:", globalStore.user);
  console.log("Is logged in computed:", isLoggedIn.value);

  // Load favorites from localStorage
  const storedFavorites = localStorage.getItem("hikingFavorites");
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites);
  }

  // Fetch product data
  fetchProductData();
});

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProductData();
      // Reset the active tab and user review inputs
      activeTab.value = 0;
      userRating.value = 0;
      userComment.value = "";
    }
  }
);
</script>

<style scoped>
.hiking-theme {
  --primary-color: #1a7e8c;
  --primary-dark: #1a7e8c;
  --primary-light: #a5d6a7;
  --secondary-color: #ff5722;
  --secondary-dark: #e64a19;
  --accent-color: #03a9f4;
  --text-dark: #2c3e50;
  --text-medium: #546e7a;
  --text-light: #90a4ae;
  --background-light: #ffffff;
  --background-medium: #f5f7fa;
  --background-dark: #e3e8ef;
  --border-color: #dce1e8;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --success-color: #4caf50;
  --warning-color: #ffc107;
  --error-color: #f44336;

  font-family: "Open Sans", "Segoe UI", sans-serif;
  color: var(--text-dark);
  background-color: var(--background-medium);
  top: 70px;
}

.product-detail-container {
  position: relative;
  width: 100%;
  padding: 30px 0;
}

.content-container {
  margin-bottom: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--background-light);
  border-radius: 8px;
  border: #2c3e50;
  /* box-shadow: 0 4px 12px var(--shadow-color); */
  overflow: hidden;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--text-medium);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  margin: 0 8px;
  transition: color 0.3s;
}

.breadcrumb a:first-child {
  margin-left: 0;
}

.breadcrumb a:hover {
  color: var(--primary-dark);
}

/* Loading State */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid var(--background-dark);
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  text-align: center;
  padding: 60px 20px;
  background-color: #fff5f5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 40px auto;
  max-width: 500px;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--error-color);
  color: white;
  font-size: 30px;
  font-weight: bold;
  border-radius: 50%;
  margin-bottom: 20px;
}

.retry-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: var(--primary-dark);
}

/* Product Detail Layout */
.product-detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

/* Product Gallery */
.product-gallery {
  position: relative;
}

.main-image-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px var(--shadow-color);
  margin-bottom: 15px;
  background-color: white;
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.main-image-container:hover .main-image {
  transform: scale(1.03);
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  z-index: 2;
}

.product-badge.published {
  background-color: var(--success-color);
  color: white;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
}

.thumbnail-item {
  flex: 0 0 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  opacity: 0.7;
  background-color: white;
}

.thumbnail-item:hover {
  opacity: 0.9;
}

.thumbnail-item.active {
  border-color: var(--primary-color);
  opacity: 1;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.brand-tag {
  display: inline-block;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  width: fit-content;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: var(--text-dark);
  line-height: 1.2;
}

.product-subtitle {
  font-size: 16px;
  color: var(--text-medium);
  font-weight: 400;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: -10px;
}

.rating-stars {
  display: flex;
}

.star-icon {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 2px;
}

.star-icon::before {
  content: "☆";
  color: var(--text-light);
  font-size: 18px;
  line-height: 1;
}

.star-icon.filled::before {
  content: "★";
  color: var(--secondary-color);
}

.star-icon.half::before {
  content: "★";
  color: var(--secondary-color);
  width: 50%;
  overflow: hidden;
}

.review-count {
  color: var(--text-medium);
  font-size: 14px;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  color: var(--text-medium);
  background-color: var(--background-medium);
  padding: 12px;
  border-radius: 6px;
}

.product-price-box {
  background-color: var(--primary-color);
  color: white;
  padding: 12px 15px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
}

.price-label {
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
}

.product-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.product-description-preview {
  color: var(--text-medium);
  line-height: 1.6;
  max-height: 80px;
  overflow: hidden;
  position: relative;
}

.product-description-preview::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

/* Color & Size Selection */
.product-colors,
.product-sizes {
  margin-top: 5px;
}

.product-colors h3,
.product-sizes h3,
.product-quantity h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-dark);
}

.color-options,
.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-option,
.size-option {
  padding: 7px 14px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-light);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.color-option.active,
.size-option.active {
  border-color: var(--primary-color);
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
}

.color-option:hover,
.size-option:hover {
  border-color: var(--primary-color);
}

/* Quantity Control */
.quantity-control {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-top: 8px;
}

.quantity-control input {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-right: none;
  border-left: none;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-medium);
  border: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s;
}

.quantity-btn:hover {
  background-color: var(--primary-light);
  color: white;
}

.quantity-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.quantity-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.stock-info {
  font-size: 14px;
  color: var(--success-color);
  margin-top: 8px;
}

.stock-info.low-stock {
  color: var(--warning-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.add-to-cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn svg {
  width: 18px;
  height: 18px;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.add-to-cart-btn:active {
  transform: translateY(0);
}

.add-to-cart-btn:disabled {
  background-color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-btn svg {
  stroke-width: 2;
  transition: all 0.3s;
}

.favorite-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
  border-color: var(--error-color);
}

.favorite-btn.active {
  border-color: var(--error-color);
  background-color: rgba(244, 67, 54, 0.1);
}

.favorite-btn.active svg {
  fill: var(--error-color);
  stroke: var(--error-color);
}

/* Product Features */
.product-features {
  padding: 30px 0;
  margin-bottom: 30px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 22px;
  margin-bottom: 25px;
  position: relative;
  color: var(--text-dark);
  font-weight: 700;
  padding-bottom: 10px;
}

.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

.features-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 25px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  margin-bottom: 15px;
}

.feature-icon svg {
  width: 30px;
  height: 30px;
  color: var(--primary-color);
}

.feature-item h3 {
  font-size: 17px;
  margin: 10px 0;
  color: var(--text-dark);
}

.feature-item p {
  color: var(--text-medium);
  font-size: 14px;
  line-height: 1.6;
}

/* Product Description Section */
.product-description-section {
  margin-bottom: 30px;
}

.description-tabs {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.tab-headers {
  display: flex;
  background-color: var(--background-medium);
  border-bottom: 1px solid var(--border-color);
}

.tab-header {
  padding: 14px 20px;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-medium);
  position: relative;
  transition: all 0.3s;
}

.tab-header.active {
  color: var(--primary-color);
}

.tab-header.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
}

.tab-content {
  display: none;
  padding: 25px;
}

.tab-content.active {
  display: block;
}

.tab-content-inner {
  line-height: 1.7;
}

.tab-content-inner p {
  margin-bottom: 16px;
  color: var(--text-medium);
}

.specifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.specifications-list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
}

.specifications-list li strong {
  min-width: 150px;
  color: var(--text-dark);
}

/* Reviews */
.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.review-stats {
  background-color: var(--background-medium);
  padding: 20px;
  border-radius: 6px;
  text-align: center;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.big-rating {
  font-size: 36px;
  font-weight: bold;
  color: var(--text-dark);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 20px;
  border-radius: 6px;
  background-color: var(--background-medium);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.reviewer-name {
  font-weight: 600;
  color: var(--text-dark);
}

.review-date {
  font-size: 13px;
  color: var(--text-light);
  margin-top: 3px;
}

.review-content p {
  margin: 0;
  color: var(--text-medium);
  line-height: 1.6;
}

.no-reviews {
  padding: 30px;
  text-align: center;
  background-color: var(--background-medium);
  border-radius: 6px;
  color: var(--text-medium);
}

.review-form {
  background-color: var(--background-medium);
  padding: 20px;
  border-radius: 6px;
}

.review-form h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

.rating-input,
.comment-input {
  margin-bottom: 15px;
}

.rating-input label,
.comment-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-dark);
}

.star-rating {
  display: flex;
  gap: 5px;
}

.star-input {
  font-size: 24px;
  color: var(--text-light);
  cursor: pointer;
}

.star-input.filled {
  color: var(--secondary-color);
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

.submit-review-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-review-btn:hover {
  background-color: var(--primary-dark);
}

.submit-review-btn:disabled {
  background-color: var(--text-light);
  cursor: not-allowed;
}

.login-to-review {
  text-align: center;
  padding: 20px;
  background-color: var(--background-medium);
  border-radius: 6px;
  color: var(--text-medium);
}

.login-to-review a {
  color: var(--primary-color);
  text-decoration: none;
}

.login-to-review a:hover {
  text-decoration: underline;
}

/* Related Products Section */
.related-products-section {
  margin-top: 40px;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* Product Card (for related products) */
.product-card {
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.product-card-inner {
  position: relative;
}

.product-label {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
}

.product-label.sale {
  background-color: var(--secondary-color);
  color: white;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.quick-action {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
}

.product-card:hover .quick-action {
  opacity: 1;
  transform: translateY(0);
}

.quick-action svg {
  width: 18px;
  height: 18px;
  color: var(--primary-color);
}

.product-card .product-info {
  padding: 15px;
  gap: 5px;
}

.product-category {
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 500;
}

.product-card .product-brand {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
  color: var(--text-dark);
}

.product-card .product-name {
  font-size: 13px;
  color: var(--text-medium);
  margin: 0 0 10px;
}

.product-card .product-price {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-top: 10px;
  font-size: 18px;
  color: var(--primary-color);
}

/* Success Message */
.added-success-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background-color: var(--success-color);
  color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  z-index: 1000;
  animation: slideInUp 0.3s ease forwards, fadeOut 0.3s ease 2.7s forwards;
}

.added-success-message svg {
  width: 20px;
  height: 20px;
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Animations */
.fade-in {
  animation: fadeIn 0.8s ease forwards;
}

.slide-up {
  animation: slideUp 0.8s ease forwards;
}

.slide-right {
  animation: slideRight 0.8s ease forwards;
}

.slide-left {
  animation: slideLeft 0.8s ease forwards;
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
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Delay classes for animations */
.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}
.delay-400 {
  animation-delay: 0.4s;
}
.delay-500 {
  animation-delay: 0.5s;
}

/* Hover effects */
.hover-float {
  transition: transform 0.3s ease;
}

.hover-float:hover {
  transform: translateY(-5px);
}

/* Responsive Styles */
@media (max-width: 992px) {
  .product-detail-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .main-image {
    height: 400px;
  }

  .features-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .related-products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .add-to-wishlist-btn,
  .add-to-cart-btn {
    width: 160px;
    height: 30px;
  }
}
@media (max-width: 768px) {
  .tab-headers {
    flex-wrap: wrap;
  }

  .tab-header {
    padding: 10px 15px;
    font-size: 14px;
  }

  .review-header {
    flex-direction: column;
    gap: 10px;
  }

  .related-products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .content-container {
    padding: 15px;
  }

  .main-image {
    height: 300px;
  }

  .product-title {
    font-size: 24px;
  }

  .product-price {
    font-size: 24px;
  }

  .features-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .favorite-btn {
    width: 100%;
    height: 45px;
  }

  .tab-content {
    padding: 15px;
  }

  .related-products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
