<template>
  <div class="adventure-shop">
    <!-- Search Header -->
    <div class="search-header">
      <div class="search-container">
        <div class="search-content">
          <h1 class="search-title">{{ t("find-perfect-gear") }}</h1>
          <p class="search-subtitle">
            {{ t("discover-premium-equipment") }}
          </p>

          <div class="search-box">
            <div class="search-input-wrapper">
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearchInput"
                @keyup.enter="performSearch"
                :placeholder="t('search-placeholder')"
                class="search-input"
              />
              <button @click="performSearch" class="search-btn" :disabled="isLoading">
                <!-- <i class="search-icon"></i> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <div
              v-if="showSuggestions && searchSuggestions.length"
              class="search-suggestions"
            >
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="suggestion-item"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>

          <div class="quick-search-tags" v-if="brands.length">
            <span class="tags-label">{{ t("popular-brands") }}:</span>
            <button
              v-for="brand in brands.slice(0, 6)"
              :key="brand.id"
              @click="quickSearchBrand(brand)"
              class="search-tag"
            >
              {{ getTranslatedBrandName(brand) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="shop-hero"></div>

    <div class="shop-container">
      <div class="shop-filters">
        <div class="filter-header">
          <h3>{{ t("filter-products") }}</h3>
          <button @click="resetFilters" class="reset-btn">{{ t("reset") }}</button>
        </div>

        <div v-if="activeSearch" class="active-search">
          <div class="search-info">
            <span class="search-label">{{ t("searching-for") }}:</span>
            <span class="search-term">"{{ activeSearch }}"</span>
            <button
              @click="clearSearch"
              class="clear-search-btn"
              :title="t('clear-search')"
            >
              ×
            </button>
          </div>
        </div>

        <div class="filter-group" v-if="categories.length">
          <h4>{{ t("categories") }}</h4>
          <div class="filter-options">
            <label
              v-for="category in categories"
              :key="category.id"
              class="filter-option"
            >
              <input
                type="checkbox"
                :value="category.id"
                v-model="selectedCategories"
                @change="applyFilters"
              />
              <span>{{ getTranslatedCategoryName(category) }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h4>{{ t("price-range") }}</h4>
          <div class="price-slider">
            <input
              type="range"
              v-model="priceRange"
              :min="minPrice"
              :max="maxPrice"
              @change="applyFilters"
              class="slider"
            />
            <div class="price-range-labels">
              <span>${{ minPrice }}</span>
              <span>${{ priceRange }}</span>
            </div>
          </div>
        </div>

        <div class="filter-group" v-if="brands.length">
          <h4>{{ t("brands") }}</h4>
          <div class="filter-options">
            <label v-for="brand in brands" :key="brand.id" class="filter-option">
              <input
                type="checkbox"
                :value="brand.id"
                v-model="selectedBrands"
                @change="applyFilters"
              />
              <span>{{ getTranslatedBrandName(brand) }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h4>{{ t("sort-by") }}</h4>
          <select v-model="sortBy" @change="applyFilters" class="sort-select">
            <option value="newest">{{ t("newest") }}</option>
            <option value="price-low-high">{{ t("price-low-to-high") }}</option>
            <option value="price-high-low">{{ t("price-high-to-low") }}</option>
            <option value="popularity">{{ t("popularity") }}</option>
          </select>
        </div>
      </div>

      <div class="shop-products">
        <div v-if="isLoading" class="status-message loading">
          <div class="loader"></div>
          <p>{{ t("loading-products") }}</p>
        </div>

        <div v-else-if="error" class="status-message error">
          <p>{{ error }}</p>
          <button @click="fetchProducts" class="retry-btn">{{ t("try-again") }}</button>
        </div>

        <div v-else-if="displayedProducts.length === 0" class="status-message empty">
          <p>{{ t("no-products-found") }}</p>
          <button @click="resetFilters" class="reset-btn">
            {{ t("reset-filters") }}
          </button>
        </div>

        <template v-else>
          <div class="products-header">
            <h2>
              {{ t("outdoor-gear") }}
              <span v-if="displayedProducts.length">
                ({{ t("items-count") }} {{ displayedProducts.length }})
              </span>
            </h2>
            <div class="view-options">
              <button
                @click="viewMode = 'grid'"
                :class="['view-btn', { active: viewMode === 'grid' }]"
                :title="t('grid-view')"
              >
                <i class="grid-icon"></i>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['view-btn', { active: viewMode === 'list' }]"
                :title="t('list-view')"
              >
                <i class="list-icon"></i>
              </button>
            </div>
          </div>

          <div :class="['products-grid', viewMode]">
            <div
              v-for="product in displayedProducts"
              :key="product.id"
              class="product-card"
              @click="navigateToProduct(product.id)"
            >
              <div class="product-image-container">
                <img
                  :src="getProductImage(product)"
                  :alt="getTranslatedProductName(product)"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="product-badges">
                  <span v-if="isNewProduct(product)" class="badge new">{{
                    t("new")
                  }}</span>
                  <span v-if="isPremiumProduct(product)" class="badge premium">{{
                    t("premium")
                  }}</span>
                </div>
                <div class="discount-badge" v-if="getDiscountPercentage(product)">
                  <span>{{
                    t("discount-percentage", { percent: getDiscountPercentage(product) })
                  }}</span>
                </div>
                <button class="quick-view-btn">{{ t("product-view") }}</button>
              </div>

              <div class="product-info">
                <div v-if="product.brand" class="product-brand">
                  {{ getTranslatedBrandName(product.brand) }}
                </div>
                <h3 class="product-name">{{ getTranslatedProductName(product) }}</h3>

                <div v-if="product.pcategory" class="product-category">
                  {{ getTranslatedCategoryName(product.pcategory) }}
                </div>

                <div class="product-price">
                  <span class="current-price">${{ formatPrice(product.price) }}</span>
                  <span v-if="product.original_price" class="original-price"
                    >${{ formatPrice(product.original_price) }}</span
                  >
                </div>

                <div class="product-rating" v-if="product.stars && product.stars.length">
                  <div class="stars flex items-center space-x-1">
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'star',
                        i <= getAverageRating(product.stars)
                          ? 'text-yellow-400'
                          : 'text-gray-300',
                      ]"
                    >
                      ★
                    </span>
                    <span class="rating-count text-sm text-gray-500">
                      ({{ product.stars.length }})
                    </span>
                  </div>
                </div>

                <div class="product-meta">
                  <div class="product-views">
                    <span class="views-icon"></span>
                    <span>{{ product.total_views || 0 }} {{ t("views") }} </span>
                  </div>
                </div>

                <div class="product-actions">
                  <button class="add-to-cart">
                    <router-link :to="`/product/detail/${product.id}`">
                      {{ t("rent-now") }}
                    </router-link>
                  </button>

                  <!-- <button
                    class="wishlist-btn"
                    @click.stop="toggleWishlist(product)"
                    :class="{ active: isInWishlist(product.id) }"
                    :title="
                      isInWishlist(product.id)
                        ? t('remove-from-wishlist')
                        : t('add-to-wishlist')
                    "
                  >
                    <i class="heart-icon">♥</i>
                  </button> -->
                </div>

                <div class="stock-status" v-if="product.stock_status">
                  <span
                    :class="['indicator', getStockStatusClass(product.stock_status)]"
                  ></span>
                  <span>{{ getTranslatedStockStatus(product.stock_status) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination" v-if="pagination && pagination.total_page > 1">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="page-btn prev"
              :aria-label="t('previous-page')"
            >
              &laquo; {{ t("prev") }}
            </button>

            <template v-if="pagination.total_page <= 5">
              <button
                v-for="page in pagination.total_page"
                :key="page"
                @click="changePage(page)"
                :class="['page-btn', { active: page === currentPage }]"
                :aria-label="t('page-number', { number: page })"
              >
                {{ page }}
              </button>
            </template>

            <template v-else>
              <button
                v-if="currentPage > 3"
                @click="changePage(1)"
                :class="['page-btn', { active: 1 === currentPage }]"
                :aria-label="t('page-number', { number: 1 })"
              >
                1
              </button>

              <button
                v-if="currentPage > 3"
                class="page-btn more"
                disabled
                :aria-label="t('more-pages')"
              >
                ...
              </button>

              <button
                v-for="page in getPaginationRange()"
                :key="page"
                @click="changePage(page)"
                :class="['page-btn', { active: page === currentPage }]"
                :aria-label="t('page-number', { number: page })"
              >
                {{ page }}
              </button>

              <button
                v-if="currentPage < pagination.total_page - 2"
                class="page-btn more"
                disabled
                :aria-label="t('more-pages')"
              >
                ...
              </button>

              <button
                v-if="currentPage < pagination.total_page - 2"
                @click="changePage(pagination.total_page)"
                :class="['page-btn', { active: pagination.total_page === currentPage }]"
                :aria-label="t('page-number', { number: pagination.total_page })"
              >
                {{ pagination.total_page }}
              </button>
            </template>

            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === pagination.total_page"
              class="page-btn next"
              :aria-label="t('next-page')"
            >
              {{ t("next") }} &raquo;
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

// Translation setup
const { currentLanguage, t } = useTranslation();

const router = useRouter();
const globalStore = useGlobalStore();

const allProducts = ref([]);
const displayedProducts = ref([]);
const categories = ref([]);
const brands = ref([]);
const isLoading = ref(true);
const error = ref(null);
const viewMode = ref("grid");
const wishlist = ref([]);
const pagination = ref(null);

const searchQuery = ref("");
const activeSearch = ref("");
const searchTimeout = ref(null);
const showSuggestions = ref(false);
const searchSuggestions = ref([]);
const currentPage = ref(1);

const selectedCategories = ref([]);
const selectedBrands = ref([]);
const priceRange = ref(500);
const sortBy = ref("newest");

const minPrice = computed(() => {
  if (!allProducts.value.length) return 0;
  return Math.min(...allProducts.value.map((p) => parseFloat(p.price) || 0));
});

const maxPrice = computed(() => {
  if (!allProducts.value.length) return 500;
  const max = Math.max(...allProducts.value.map((p) => parseFloat(p.price) || 0));
  return max > 0 ? max : 500;
});

const getTranslatedProductName = (product) => {
  if (!product) return "";
  if (currentLanguage.value === "km" && product.name_km) {
    return product.name_km;
  }
  return product.name || "";
};

const getTranslatedBrandName = (brand) => {
  if (!brand) return "";
  if (currentLanguage.value === "km" && brand.name_km) {
    return brand.name_km;
  }
  return brand.name || "";
};

const getTranslatedCategoryName = (category) => {
  if (!category) return "";
  if (currentLanguage.value === "km" && category.name_km) {
    return category.name_km;
  }
  if (category.name) {
    const key = `category-${category.name.toLowerCase().replace(/\s+/g, "-")}`;
    const translated = t(key);
    if (translated !== key) {
      return translated;
    }
  }
  return category.name || "";
};

const getTranslatedStockStatus = (status) => {
  if (!status) return "";

  const statusKey = status.toLowerCase().replace(/\s+/g, "-");
  const key = `stock-status-${statusKey}`;
  const translated = t(key);
  return translated !== key ? translated : status;
};

const handleLanguageChange = () => {
  document.title = `${t("camtour-brand")} - ${t("shop-page-title")}`;
};

onMounted(async () => {
  const savedWishlist = localStorage.getItem("wishlist");
  if (savedWishlist) {
    try {
      wishlist.value = JSON.parse(savedWishlist);
    } catch (error) {
      console.error("Error parsing wishlist from localStorage:", error);
      wishlist.value = [];
    }
  }
  window.addEventListener("language-changed", handleLanguageChange);
  await fetchProducts();
  await fetchBrands();
  await fetchCategories();
  if (maxPrice.value > 0) {
    priceRange.value = maxPrice.value;
  }
  document.title = `${t("camtour-brand")} - ${t("shop-page-title")}`;
});

watch([currentPage], () => {
  fetchProducts();
});

watch(currentLanguage, () => {
  document.title = `${t("camtour-brand")} - ${t("shop-page-title")}`;
  if (error.value) {
    error.value = t("error-loading-products");
  }
  if (searchQuery.value.length > 2) {
    generateSearchSuggestions();
  }
});

function handleSearchInput() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  if (!searchQuery.value.trim()) {
    showSuggestions.value = false;
    return;
  }
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.length > 2) {
      generateSearchSuggestions();
      showSuggestions.value = true;
    }
  }, 300);
}

function generateSearchSuggestions() {
  const query = searchQuery.value.toLowerCase();
  const suggestions = new Set();
  allProducts.value.forEach((product) => {
    const name = getTranslatedProductName(product).toLowerCase();
    const category = getTranslatedCategoryName(product.pcategory).toLowerCase();
    const brand = getTranslatedBrandName(product.brand).toLowerCase();
    if (name.includes(query)) suggestions.add(getTranslatedProductName(product));
    if (category.includes(query))
      suggestions.add(getTranslatedCategoryName(product.pcategory));
    if (brand.includes(query)) suggestions.add(getTranslatedBrandName(product.brand));
  });
  searchSuggestions.value = Array.from(suggestions)
    .filter((s) => s && s.toLowerCase() !== query)
    .slice(0, 5);
}

function selectSuggestion(suggestion) {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  performSearch();
}

function performSearch() {
  if (!searchQuery.value.trim()) {
    clearSearch();
    return;
  }

  activeSearch.value = searchQuery.value.trim();
  showSuggestions.value = false;
  currentPage.value = 1;
  fetchProducts();
}

function quickSearchBrand(brand) {
  selectedBrands.value = [brand.id];
  applyFilters();
}

function clearSearch() {
  searchQuery.value = "";
  activeSearch.value = "";
  showSuggestions.value = false;
  fetchProducts();
}

async function fetchProducts() {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
    };
    if (activeSearch.value) {
      params.search = activeSearch.value;
    }
    if (selectedCategories.value.length > 0) {
      params.category_ids = selectedCategories.value.join(",");
    }
    if (selectedBrands.value.length > 0) {
      params.brand_ids = selectedBrands.value.join(",");
    }
    const response = await axios.get("/api/web/view/product", {
      params,
      ...globalStore.getAxiosHeader(),
    });
    if (!response.data.error) {
      allProducts.value = response.data.data || [];
      pagination.value = {
        per_page: response.data.per_page || 10,
        total: response.data.total || 0,
        total_page: response.data.total_page || 1,
        page_no: response.data.page_no || 1,
      };
      applyFiltersToProducts();
    } else {
      error.value = response.data.message || t("error-loading-products");
      allProducts.value = [];
      displayedProducts.value = [];
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = t("error-loading-products");
    allProducts.value = [];
    displayedProducts.value = [];
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
}

async function fetchCategories() {
  try {
    const response = await axios.get(
      "/api/web/view/categories",
      globalStore.getAxiosHeader()
    );
    if (response.data.result) {
      categories.value = response.data.data || [];
    } else {
      console.error("Failed to load categories:", response.data.message);
      extractCategoriesFromProducts();
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    extractCategoriesFromProducts();
  }
}

async function fetchBrands() {
  try {
    const response = await axios.get(
      "/api/web/view/brands",
      globalStore.getAxiosHeader()
    );
    if (response.data.result) {
      brands.value = response.data.data || [];
    } else {
      console.error("Failed to load brands:", response.data.message);
      extractBrandsFromProducts();
    }
  } catch (err) {
    console.error("Error fetching brands:", err);
    extractBrandsFromProducts();
  }
}

function extractCategoriesFromProducts() {
  const uniqueCategories = {};
  allProducts.value.forEach((product) => {
    if (product.pcategory && product.pcategory.id) {
      uniqueCategories[product.pcategory.id] = product.pcategory;
    }
  });
  categories.value = Object.values(uniqueCategories);
}

function extractBrandsFromProducts() {
  const uniqueBrands = {};
  allProducts.value.forEach((product) => {
    if (product.brand && product.brand.id) {
      uniqueBrands[product.brand.id] = product.brand;
    }
  });
  brands.value = Object.values(uniqueBrands);
}

function applyFiltersToProducts() {
  let filtered = [...allProducts.value];
  if (priceRange.value < maxPrice.value) {
    filtered = filtered.filter(
      (product) => parseFloat(product.price) <= priceRange.value
    );
  }
  switch (sortBy.value) {
    case "price-low-high":
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high-low":
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case "popularity":
      filtered.sort(
        (a, b) => parseFloat(b.total_views || 0) - parseFloat(a.total_views || 0)
      );
      break;
    case "newest":
    default:
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
  }
  displayedProducts.value = filtered;
}

function applyFilters() {
  currentPage.value = 1;
  fetchProducts();
}

function resetFilters() {
  selectedCategories.value = [];
  selectedBrands.value = [];
  priceRange.value = maxPrice.value;
  sortBy.value = "newest";
  clearSearch();
  fetchProducts();
}

function changePage(page) {
  if (pagination.value && page >= 1 && page <= pagination.value.total_page) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function getPaginationRange() {
  if (!pagination.value) return [1];
  const totalPages = pagination.value.total_page;
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage.value <= 3) {
    return [1, 2, 3, 4, 5];
  }
  if (currentPage.value >= totalPages - 2) {
    return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
  }
  return [
    currentPage.value - 2,
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
    currentPage.value + 2,
  ];
}

function getProductImage(product) {
  return (
    product.is_thumbnail ||
    product.image ||
    "https://placehold.co/400x300/1A7E8C/ffffff?text=Outdoor+Gear"
  );
}

function isNewProduct(product) {
  if (!product.created_at) return false;
  const createdDate = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return createdDate > thirtyDaysAgo;
}

function isPremiumProduct(product) {
  return parseFloat(product.price || 0) > 100;
}

function getDiscountPercentage(product) {
  if (!product.original_price) return null;
  const original = parseFloat(product.original_price);
  const current = parseFloat(product.price);
  if (original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

function formatPrice(price) {
  return parseFloat(price || 0).toFixed(2);
}

function navigateToProduct(productId) {
  router.push(`/product/detail/${productId}`);
}

function handleImageError(event) {
  event.target.src = "https://placehold.co/400x300/1A7E8C/ffffff?text=Outdoor+Gear";
}

function getAverageRating(stars) {
  if (!stars || stars.length === 0) return 0;
  const total = stars.reduce((sum, star) => sum + (star.star || 0), 0);
  return Math.round(total / stars.length);
}

function getStockStatusClass(status) {
  if (!status) return "";
  status = status.toLowerCase();
  if (status.includes("in stock") || status.includes("available")) return "in-stock";
  if (status.includes("low") || status.includes("limited")) return "low-stock";
  if (status.includes("out") || status.includes("unavailable")) return "out-of-stock";
  return "";
}

onUnmounted(() => {
  window.removeEventListener("language-changed", handleLanguageChange);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<style scoped>
.adventure-shop {
  color: #333;
  background-color: #f8f9fa;
  position: relative;
}

/* Search Header */
.search-header {
  background: linear-gradient(135deg, #1a7e8c 0%, #156570 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  height: 500px;
}

.search-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../../assets/product/banner.png");
  z-index: 1;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  top: 50px;
}

.search-content {
  text-align: center;
  color: white;
}

.search-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.search-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 40px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
.search-box {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background: none;
  margin-bottom: 20px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 600px;
  background-color: #fff;
  border-radius: 9999px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 0.5rem 1rem;
  transition: box-shadow 0.3s ease;
}

.search-input-wrapper:focus-within {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5rem;
  background: transparent;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  /* background-color: #4CAF50; */
  /* color: #fff; */
  padding: 0.5rem 1rem;
  /* border: none; */
  border-radius: 9999px;
  /* cursor: pointer; */
  transition: background-color 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background-color: #386d8e;
}

.search-icon {
  width: 1rem;
  height: 1rem;
  /* background: url('/path-to-your-icon.svg') no-repeat center center; */
  background-size: contain;
}

/* Suggestions Dropdown */
.search-suggestions {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f1f1f1;
}

/* Responsive */
@media (max-width: 640px) {
  .search-input-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    border-radius: 1rem;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: -1px;
}

.suggestion-item {
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  text-align: left;
  color: #333;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
  border-radius: 0 0 12px 12px;
}

.quick-search-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tags-label {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

.search-tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.search-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Active Search Display */
.active-search {
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #e8f4f5 0%, #d1e7ea 100%);
  border-radius: 8px;
  border-left: 4px solid #1a7e8c;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.search-term {
  font-size: 14px;
  color: #1a7e8c;
  font-weight: 600;
  background: white;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #1a7e8c;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #1a7e8c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background: #156570;
  transform: scale(1.1);
}

/* Hero Banner */
.shop-hero {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 40px;
  border-radius: 0 0 20px 20px;
  position: relative;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  background-color: #1a7e8c;
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Main Shop Container */
.shop-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* Filters Section */
.shop-filters {
  background: white;
  border-radius: 12px;
  padding: 24px;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); */
  align-self: start;
  position: sticky;
  top: 20px;
  border-top: 4px solid #1a7e8c;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.filter-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1a7e8c;
}

.reset-btn {
  background: none;
  border: none;
  color: #1a7e8c;
  font-size: 14px;
  cursor: pointer;
}

.reset-btn:hover {
  text-decoration: underline;
}

.filter-group {
  margin-bottom: 24px;
  position: relative;
}

.filter-group h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #1a7e8c;
  display: flex;
  align-items: center;
}

.filter-group h4:before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 16px;
  background-color: #1a7e8c;
  margin-right: 8px;
  border-radius: 3px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-option {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s;
}

.filter-option:hover {
  color: #1a7e8c;
}

.filter-option input {
  margin-right: 10px;
  accent-color: #1a7e8c;
}

.price-slider {
  padding: 10px 0;
}

.slider {
  width: 100%;
  height: 1px;
  background: #e6e6e6;
  outline: none;
  border-radius: 3px;
  border: 2px dotted white;
  color: #156570;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1a7e8c;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}

.price-range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.sort-select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%231A7E8C' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  appearance: none;
}

.sort-select:focus {
  border-color: #1a7e8c;
}

/* Products Section */
.shop-products {
  min-height: 600px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.products-header h2 {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  color: #1a7e8c;
  position: relative;
}

.products-header h2:after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #1a7e8c;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  border-color: #1a7e8c;
}

.view-btn.active {
  background: #1a7e8c;
  border-color: #1a7e8c;
  color: white;
  box-shadow: 0 4px 8px rgba(26, 126, 140, 0.2);
}

.grid-icon,
.list-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
}

.grid-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' d='M1 2h5v5H1zM9 2h5v5H9zM1 10h5v5H1zM9 10h5v5H9z'/%3E%3C/svg%3E");
}

.list-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='currentColor' d='M1 2h3v3H1zM6 2h9v3H6zM1 7h3v3H1zM6 7h9v3H6zM1 12h3v3H1zM6 12h9v3H6z'/%3E%3C/svg%3E");
}

/* Products Grid */
.products-grid {
  display: grid;
  gap: 30px;
  margin-bottom: 40px;
}

.products-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.products-grid.list {
  grid-template-columns: 1fr;
}

/* Product Cards */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.product-card:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1a7e8c;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.product-card:hover:after {
  transform: scaleX(1);
}

.products-grid.list .product-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: auto;
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.products-grid.list .product-image {
  height: 100%;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.badge.new {
  background-color: #4caf50;
  color: white;
}

.badge.premium {
  background-color: #1a7e8c;
  color: white;
}

.discount-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #ff5722;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.quick-view-btn {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  padding: 12px;
  background-color: rgba(26, 126, 140, 0.9);
  color: white;
  border: none;
  text-align: center;
  font-weight: 500;
  transition: bottom 0.3s;
  opacity: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
}

.product-card:hover .quick-view-btn {
  bottom: 0;
  opacity: 1;
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.products-grid.list .product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
}

.product-brand {
  font-size: 13px;
  font-weight: 600;
  color: #1a7e8c;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #333;
  transition: color 0.2s;
  line-height: 1.4;
}

.products-grid.list .product-name {
  font-size: 22px;
  margin-bottom: 12px;
}

.product-card:hover .product-name {
  color: #1a7e8c;
}

.product-category {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ddd' d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
  background-size: contain;
}

.star.filled {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231A7E8C' d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
}

.rating-count {
  font-size: 13px;
  color: #666;
  margin-left: 6px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 22px;
  font-weight: 700;
  color: #1a7e8c;
}

.product-description-short {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  flex-grow: 1;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #777;
}

.product-views {
  display: flex;
  align-items: center;
  gap: 6px;
}

.views-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
  background-size: contain;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.products-grid.list .product-actions {
  margin-top: 20px;
}

.add-to-cart {
  flex: 1;
  padding: 12px 0;
  background-color: #1a7e8c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  text-align: center;
  box-shadow: 0 4px 8px rgba(26, 126, 140, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
}

.add-to-cart a {
  color: white;
  text-decoration: none;
  display: block;
}

.add-to-cart:hover {
  background-color: #156570;
  transform: translateY(-2px);
}

.wishlist-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.wishlist-btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.wishlist-btn.active {
  background-color: #fff2f2;
}

.heart-icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
  background-size: contain;
}

.wishlist-btn.active .heart-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231A7E8C' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

.products-grid.list .wishlist-btn {
  width: auto;
  padding: 0 20px;
  min-width: 160px;
}

.products-grid.list .wishlist-btn .heart-icon {
  margin-right: 8px;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-top: 10px;
}

.indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.indicator.in-stock {
  background-color: #4caf50;
}

.indicator.low-stock {
  background-color: #ff9800;
}

.indicator.out-of-stock {
  background-color: #f44336;
}

/* Status Messages */
.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.status-message p {
  margin: 15px 0;
  color: #666;
  font-size: 16px;
}

.status-message.loading {
  color: #1a7e8c;
}

.status-message.error {
  color: #f44336;
}

.loader {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(26, 126, 140, 0.1);
  border-radius: 50%;
  border-top-color: #1a7e8c;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  background-color: #1a7e8c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(26, 126, 140, 0.2);
  transition: all 0.2s;
}

.retry-btn:hover {
  background-color: #156570;
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 50px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.page-btn.active {
  background-color: #1a7e8c;
  border-color: #1a7e8c;
  color: white;
  box-shadow: 0 4px 8px rgba(26, 126, 140, 0.2);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.more {
  cursor: default;
}

.page-btn.more:hover {
  background-color: white;
  border-color: #ddd;
}

.page-btn.prev,
.page-btn.next {
  padding: 0 15px;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 992px) {
  .shop-container {
    grid-template-columns: 1fr;
  }

  .shop-filters {
    position: static;
    margin-bottom: 30px;
  }

  .search-input-wrapper {
    flex-direction: column;
    border-radius: 12px;
  }

  .search-btn {
    border-radius: 0 0 12px 12px;
    justify-content: center;
  }
}
@media (max-width: 480px) {
  .products-grid.list {
    display: grid;
    grid-template-columns: 1fr; /* One column */
  }

  .products-grid.list .product-card {
    display: grid;
    grid-template-columns: 1fr; /* One column inside the card */
  }
}
@media (max-width: 576px) {
  .products-grid.grid[data-v-7d24f6ca] {
    grid-template-columns: 1fr; /* Exactly one column */
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .products-grid.list {
    grid-template-columns: 1fr;
  }

  .products-grid.list .product-card {
    grid-template-columns: 1fr;
  }

  .search-title {
    font-size: 28px;
  }

  .search-subtitle {
    font-size: 14px;
  }

  .search-header {
    padding: 40px 20px;
  }

  .quick-search-tags {
    gap: 8px;
  }

  .search-tag {
    font-size: 12px;
    padding: 4px 10px;
  }

  .products-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 576px) {
  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .product-name {
    font-size: 14px;
  }

  .current-price {
    font-size: 16px;
  }

  .product-image {
    height: 180px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .search-input {
    font-size: 12px;
    padding: 10px 10px;
  }

  .search-btn {
    padding: 16px 24px;
    font-size: 13px;
  }

  .search-suggestions {
    max-width: calc(100vw - 40px);
  }
}

/* Hide suggestions when clicking outside */
@media (hover: none) {
  .search-suggestions {
    display: none;
  }
}
</style>
