<script setup>
import homeBannerImg from "@/assets/banners/banner-home.jpg";
import { useTranslation } from "@/components/useTranslation";
import WishlistButton from "@/components/WishlistButton.vue";
import { useGlobalStore } from "@/stores/global";
import WishlistService from "@/stores/WishlistService";
import axios from "axios";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const currentImageIndex = ref(0);
const searchQuery = ref("");
const isLoading = ref(true);
const isSearchActive = ref(false);
const currentSearchTerm = ref("");
const searchResults = ref({
  locations: [],
  products: [],
  top_view_location: [],
});
const searchPagination = ref(null);
const showSuggestions = ref(false);
const searchSuggestions = ref([]);
const suggestionDebounceTimeout = ref(null);
const activeSearchTab = ref("all");
const totalResults = ref(0);
const searchCategory = ref("");
const searchLocation = ref("");
const apiCategories = ref([]);
const apiBrands = ref([]);
const isLoadingCategories = ref(false);
const isLoadingBrands = ref(false);
const wishlistUpdateKey = ref(0);
const wishlistCount = ref(0);
const wishlistItems = ref([]);
let autoSlideInterval = null;
const heroImages = ref([
  {
    src: homeBannerImg,
    alt: "Angkor Wat Temple Complex",
    title: "Angkor Wat",
    description: "Ancient temple complex",
  },
  {
    src:
      "https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-6/469119324_964562495720655_7345235433667041914_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEC6ZN8PseULZim4e0F0kQ4LD-usnVikqAsP66ydWKSoDZZgorkBzBQnuBGa9b_zd_YO6ZoxWihttxYNsi2MnrI&_nc_ohc=EydmQdMsJb4Q7kNvwEslbUt&_nc_oc=Adl31dMJqbeBsjYhEv4ay8yMMvxf2tPYFTMWpiygLfvbsXUVlVFo764Ar1QLLqt-7Xw&_nc_zt=23&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=Z-_i7yaGcUaDOvhMGH5MyA&oh=00_AfLyHXH1KwOLgomQqh1BhMP-QUODhrhyKWUod2aNYdEufw&oe=683E5B79",
    alt: "Bayon Temple Faces",
    title: "Bayon Temple",
    description: "Temple of faces",
  },
  {
    src:
      "https://asset.cambodia.gov.kh/tourism/2023/11/Royal-Palace-in-Phnom-Penh-Capital-jpg.webp",
    alt: "Banteay Srei Temple",
    title: "Banteay Srei",
    description: "Pink sandstone temple",
  },
]);
const { currentLanguage, t } = useTranslation();
const topViewLocations = ref([]);
const locations = ref([]);
const products = ref([]);
const pagination = ref(null);
const currentPage = ref(1);
const favorites = ref([]);
const cardsRowRef = ref(null);
const autoScrollInterval = ref(null);
const isAutoScrolling = ref(true);
const scrollDistance = ref(300);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
let toastTimeout;
const selectedCategory = ref("all");
const selectedProductCategory = ref("all");
const categories = computed(() => {
  const baseCategories = [{ key: "all", translationKey: "all", name: t("all") }];
  if (apiCategories.value.length > 0) {
    const dynamicCategories = apiCategories.value.map((category) => ({
      key: category.id.toString(),
      translationKey: category.name,
      name: category.name,
      name_km: category.name_km,
      image: category.image,
    }));
    return [...baseCategories, ...dynamicCategories];
  }
  return [
    ...baseCategories,
    { key: "heritage", translationKey: "heritage", name: t("heritage") },
    { key: "nature", translationKey: "nature", name: t("nature") },
    { key: "cultural", translationKey: "cultural", name: t("cultural") },
    { key: "adventure", translationKey: "adventure", name: t("adventure") },
    { key: "beach", translationKey: "beach", name: t("beach") },
    { key: "food-tours", translationKey: "food-tours", name: t("food-tours") },
  ];
});

const productCategories = computed(() => {
  const baseCategories = [{ key: "all", translationKey: "all", name: t("all") }];

  if (apiBrands.value.length > 0) {
    const dynamicBrands = apiBrands.value.map((brand) => ({
      key: brand.id.toString(),
      translationKey: brand.name,
      name: currentLanguage.value === "km" ? brand.name_km || brand.name : brand.name,
      name_km: brand.name_km,
    }));
    return [...baseCategories, ...dynamicBrands];
  }
  return [
    ...baseCategories,
    { key: "camping", translationKey: "camping", name: t("camping") },
    { key: "trekking", translationKey: "trekking", name: t("trekking") },
    { key: "clothing", translationKey: "clothing", name: t("clothing") },
    { key: "accessories", translationKey: "accessories", name: t("accessories") },
  ];
});

const selectedCategoryInfo = computed(() => {
  if (selectedCategory.value === "all") return null;
  const categoryId = parseInt(selectedCategory.value);
  if (!isNaN(categoryId)) {
    return apiCategories.value.find((cat) => cat.id === categoryId);
  }
  return null;
});

const chatbotFeatures = ref([
  {
    key: "trip-planning",
    translationKey: "trip-planning",
    iconPath:
      "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zM4 8V5h16v3H4z",
  },
  {
    key: "tour-discounts",
    translationKey: "tour-discounts",
    iconPath:
      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 6h-1.7l-5 9H7c-.83 0-1.5-.67-1.5-1.5S6.17 15 7 15h1.7l5-9H17c.83 0 1.5.67 1.5 1.5S17.83 9 17 9z",
  },
  {
    key: "location-info",
    translationKey: "location-info",
    iconPath:
      "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  },
  {
    key: "travel-tips",
    translationKey: "travel-tips",
    iconPath:
      "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z",
  },
  {
    key: "budget-advice",
    translationKey: "budget-advice",
    iconPath:
      "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  },
]);

const placeholderImage = "https://placehold.co/400x300/19ADCF/ffffff?text=Camtour";
const filteredLocations = computed(() => {
  if (selectedCategory.value === "all") {
    return locations.value;
  }
  const categoryId = parseInt(selectedCategory.value);
  if (!isNaN(categoryId)) {
    const filtered = locations.value.filter((location) => {
      const matches =
        location.category_id === categoryId ||
        location.categoryId === categoryId ||
        (location.category && location.category.id === categoryId) ||
        (location.category && parseInt(location.category) === categoryId);
      return matches;
    });
    return filtered;
  } else {
    const filtered = locations.value.filter((location) => {
      return (
        location.category?.toLowerCase() === selectedCategory.value ||
        location.type?.toLowerCase() === selectedCategory.value
      );
    });
    return filtered;
  }
});

const filteredProducts = computed(() => {
  if (selectedProductCategory.value === "all") {
    return products.value;
  }
  const brandId = parseInt(selectedProductCategory.value);
  if (!isNaN(brandId)) {
    const filtered = products.value.filter((product) => {
      const matches =
        product.brand_id === brandId ||
        product.brandId === brandId ||
        (product.brand && product.brand.id === brandId) ||
        (product.brand && parseInt(product.brand) === brandId);

      return matches;
    });
    return filtered;
  } else {
    const filtered = products.value.filter((product) => {
      return (
        product.category?.toLowerCase() === selectedProductCategory.value ||
        product.type?.toLowerCase() === selectedProductCategory.value
      );
    });
    return filtered;
  }
});

const getLocalizedName = (location) => {
  if (currentLanguage.value === "km") {
    return location.name_local || location.name;
  }
  return location.name;
};

const getLocalizedSubtitle = (location) => {
  if (currentLanguage.value === "km") {
    return location.description_local || location.name_local || location.name;
  }
  return location.name_local || location.description;
};

const getLocalizedProductName = (product) => {
  if (currentLanguage.value === "km") {
    return product.product_name_km || product.product_name;
  }
  return product.product_name;
};

const getLocalizedCategoryName = (category) => {
  if (currentLanguage.value === "km") {
    return category.name_km || category.description || category.name;
  }
  return category.name;
};

const getLocalizedBrandName = (brand) => {
  if (currentLanguage.value === "km") {
    return brand.name_km || brand.name;
  }
  return brand.name;
};

const fetchCategories = async () => {
  isLoadingCategories.value = true;
  const globalStore = useGlobalStore();
  try {
    const response = await axios.get("/api/web/view/categories", {
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result && response.data.data) {
      apiCategories.value = response.data.data;
    } else {
      apiCategories.value = [];
    }
  } catch (error) {
    apiCategories.value = [];
    if (typeof globalStore.onCheckError === "function") {
      await globalStore.onCheckError(error);
    }
  } finally {
    isLoadingCategories.value = false;
  }
};

const fetchBrands = async () => {
  isLoadingBrands.value = true;
  const globalStore = useGlobalStore();
  try {
    const response = await axios.get("/api/web/view/brands", {
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result && response.data.data) {
      apiBrands.value = response.data.data;
    } else {
      apiBrands.value = [];
    }
  } catch (error) {
    apiBrands.value = [];
    if (typeof globalStore.onCheckError === "function") {
      await globalStore.onCheckError(error);
    }
  } finally {
    isLoadingBrands.value = false;
  }
};

const performSearch = async (query, category = "", page = 1) => {
  isLoading.value = true;
  const globalStore = useGlobalStore();
  try {
    const params = {
      page,
      per_page: 12,
    };

    if (query.trim()) {
      params.search = query.trim();
    }
    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        params.category_id = categoryId;
      } else {
        params.category = category;
      }
    }
    const response = await axios.get("/api/web/view/location", {
      params,
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      const data = response.data.data;
      searchResults.value = {
        locations: data.locations || [],
        products: data.product || [],
        top_view_location: data.top_view_location || [],
      };
      searchPagination.value = data.pagination;
      totalResults.value = (data.locations?.length || 0) + (data.product?.length || 0);
      isSearchActive.value = true;
      currentSearchTerm.value = query;
    }
  } catch (error) {
    await globalStore.onCheckError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    hideSuggestions();
    await performSearch(searchQuery.value, searchCategory.value);
    const newQuery = { ...route.query };
    newQuery.search = searchQuery.value.trim();
    if (searchCategory.value) {
      newQuery.category = searchCategory.value;
    }
    router.replace({ query: newQuery });
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  searchCategory.value = "";
  searchLocation.value = "";
  isSearchActive.value = false;
  currentSearchTerm.value = "";
  searchResults.value = { locations: [], products: [], top_view_location: [] };
  totalResults.value = 0;
  selectedCategory.value = "all";
  selectedProductCategory.value = "all";
  const newQuery = { ...route.query };
  delete newQuery.search;
  delete newQuery.category;
  router.replace({ query: newQuery });
  fetchHomeData();
};

const setSearchTab = (tab) => {
  activeSearchTab.value = tab;
};

const goToSearchPage = (page) => {
  if (currentSearchTerm.value) {
    performSearch(currentSearchTerm.value, searchCategory.value, page);
  }
};

const fetchSearchSuggestions = async (query) => {
  if (!query.trim() || query.length < 2) {
    searchSuggestions.value = [];
    return;
  }
  const globalStore = useGlobalStore();
  try {
    const response = await axios.get("/api/web/view/location", {
      params: {
        search: query.trim(),
        per_page: 5,
      },
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      const data = response.data.data;
      const suggestions = [];
      if (data.locations) {
        data.locations.slice(0, 3).forEach((location) => {
          suggestions.push({
            id: `location-${location.id}`,
            name: getLocalizedName(location),
            description: getLocalizedSubtitle(location),
            image: location.is_thumbnail,
            rating: location.rate_star,
            type: "location",
            data: location,
          });
        });
      }
      if (data.product) {
        data.product.slice(0, 2).forEach((product) => {
          suggestions.push({
            id: `product-${product.product_id}`,
            name: product.product_name,
            name_km: product.product_name_km,
            type: "product",
            data: product,
          });
        });
      }
      searchSuggestions.value = suggestions;
    }
  } catch (error) {
    searchSuggestions.value = [];
  }
};

const onSearchInput = () => {
  if (suggestionDebounceTimeout.value) {
    clearTimeout(suggestionDebounceTimeout.value);
  }
  suggestionDebounceTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim().length >= 2) {
      fetchSearchSuggestions(searchQuery.value);
      showSuggestions.value = true;
    } else {
      hideSuggestions();
    }
  }, 300);
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.name;
  hideSuggestions();
  if (suggestion.type === "location") {
    router.push(`/location/detail/${suggestion.data.id}`);
  } else if (suggestion.type === "product") {
    router.push(`/product/detail/${suggestion.data.product_id}`);
  }
};

const hideSuggestions = () => {
  showSuggestions.value = false;
  searchSuggestions.value = [];
};

const onWishlistAdded = async (item) => {
  showToastNotification(`Added "${item.name}" to wishlist`, "success");
  await refreshWishlistState();
};

const onWishlistRemoved = async (item) => {
  if (wishlistCount.value === 0) {
    showToastNotification("Wishlist cleared", "info");
  } else {
    showToastNotification(`Removed "${item.name || "item"}" from wishlist`, "info");
  }
  await refreshWishlistState();
};

const onWishlistError = () => {
  showToastNotification("Error updating wishlist", "error");
};

const handleWishlistUpdate = async (event) => {
  const { count, items } = event.detail;
  wishlistCount.value = count;
  wishlistItems.value = items || [];
  wishlistUpdateKey.value++;
  if (count === 0 && wishlistCount.value > 0) {
    showToastNotification("Wishlist cleared", "info");
  }
};

const refreshWishlistState = async () => {
  try {
    const [count, items] = await Promise.all([
      WishlistService.getCount(),
      WishlistService.getItems(),
    ]);

    wishlistCount.value = count;
    wishlistItems.value = items;
    wishlistUpdateKey.value++;
  } catch (error) {
    console.error(error)
  }
};

const initializeWishlistState = async () => {
  try {
    await WishlistService.initialize();
    await refreshWishlistState();
  } catch (error) {
    console.error(error);
  }
};

const showToastNotification = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastTimeout = setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const handleToastEvent = (event) => {
  const { message, type, duration } = event.detail;
  showToastNotification(message, type);
  if (duration && duration !== 3000) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
      showToast.value = false;
    }, duration);
  }
};

const selectCategory = (categoryKey) => {
  selectedCategory.value = categoryKey;
};

const selectProductCategory = (categoryKey) => {
  selectedProductCategory.value = categoryKey;
};

const fetchHomeData = async (page = 1) => {
  isLoading.value = true;
  const globalStore = useGlobalStore();
  try {
    const [locationsResponse] = await Promise.all([
      axios.get("/api/web/view/location", {
        params: { page },
        ...globalStore.getAxiosHeader(),
      }),
      fetchCategories(),
      fetchBrands(),
    ]);
    if (locationsResponse.data.result) {
      const data = locationsResponse.data.data;
      topViewLocations.value = data.top_view_location || [];
      locations.value = data.locations || [];
      products.value = data.product || [];
      pagination.value = data.pagination || null;
      currentPage.value = page;
      if (topViewLocations.value.length > 0) {
        resetAutoScroll();
      }
    }
  } catch (error) {
    await globalStore.onCheckError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

const toggleFavorite = async (locationId) => {
  const location = [...topViewLocations.value, ...locations.value].find(
    (loc) => loc.id === locationId
  );
  if (location) {
    try {
      const success = await WishlistService.toggleItem(location);
      if (success) {
        const finalCount = await WishlistService.getCount();
        const isNowInWishlist =
          finalCount > 0 && WishlistService.isInWishlist(locationId);
        const message = isNowInWishlist
          ? `Added "${getLocalizedName(location)}" to wishlist`
          : finalCount === 0
          ? "Wishlist cleared"
          : `Removed "${getLocalizedName(location)}" from wishlist`;
        showToastNotification(message, isNowInWishlist ? "success" : "info");
        await refreshWishlistState();
      }
    } catch (error) {
      showToastNotification("Error updating wishlist", "error");
    }
  }

  const index = favorites.value.indexOf(locationId);
  if (index === -1) {
    favorites.value.push(locationId);
  } else {
    favorites.value.splice(index, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value));
};

const startAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
  }
  if (topViewLocations.value.length > 1) {
    autoScrollInterval.value = setInterval(() => {
      scrollNext();
    }, 3000);
  }
};

const stopAutoScroll = () => {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value);
    autoScrollInterval.value = null;
  }
};

const resetAutoScroll = () => {
  if (isAutoScrolling.value) {
    stopAutoScroll();
    startAutoScroll();
  }
};

const scrollNext = () => {
  if (cardsRowRef.value) {
    cardsRowRef.value.scrollBy({
      left: scrollDistance.value,
      behavior: "smooth",
    });
    setTimeout(() => {
      if (cardsRowRef.value) {
        const isAtEnd =
          cardsRowRef.value.scrollLeft + cardsRowRef.value.clientWidth >=
          cardsRowRef.value.scrollWidth - 10;

        if (isAtEnd) {
          cardsRowRef.value.scrollTo({ left: 0 });
        }
      }
    }, 500);
  }
};

const scrollPrev = () => {
  if (cardsRowRef.value) {
    cardsRowRef.value.scrollBy({
      left: -scrollDistance.value,
      behavior: "smooth",
    });
  }
};

const changeImage = (index) => {
  currentImageIndex.value = index;
  resetAutoSlide();
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % heroImages.value.length;
  resetAutoSlide();
};

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextImage();
  }, 5000);
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

const resetAutoSlide = () => {
  stopAutoSlide();
  startAutoSlide();
};

watch(currentLanguage, () => {
  document.title = `${t("camtour-brand")} - ${t("home-page-title")}`;
});
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.search) {
      searchQuery.value = newQuery.search;
      const category = newQuery.category || "";
      searchCategory.value = category;
      performSearch(newQuery.search, category);
    } else if (isSearchActive.value) {
      clearSearch();
    }
  },
  { immediate: true }
);

watch(selectedCategory, () => {});
watch(selectedProductCategory, () => {});

const handleClickOutside = (event) => {
  const searchContainer = event.target.closest(".search-container");
  if (!searchContainer) {
    hideSuggestions();
  }
};

onMounted(async () => {
  window.addEventListener("wishlist-updated", handleWishlistUpdate);
  document.title = `${t("camtour-brand")} - ${t("home-page-title")}`;
  await initializeWishlistState();
  const globalStore = useGlobalStore();
  watch(
    () => globalStore.getIsAuthenticated,
    async (isAuthenticated) => {
      if (isAuthenticated) {
        await initializeWishlistState();
      } else {
        wishlistCount.value = 0;
        wishlistItems.value = [];
        wishlistUpdateKey.value++;
      }
    }
  );

  window.addEventListener("show-toast", handleToastEvent);
  window.addEventListener("language-changed", () => {});
  document.addEventListener("click", handleClickOutside);
  const storedFavorites = localStorage.getItem("favorites");
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites);
  }
  if (route.query.search) {
    searchQuery.value = route.query.search;
    searchCategory.value = route.query.category || "";
    performSearch(route.query.search, route.query.category || "");
  } else {
    fetchHomeData();
  }
  nextTick(() => {
    setTimeout(() => {
      const setupScrollers = () => {
        const cardsRow = cardsRowRef.value;
        if (cardsRow) {
          const cardWidth = cardsRow.querySelector(".scroll-card")?.offsetWidth || 300;
          scrollDistance.value = cardWidth + 25;
          let isDown = false;
          let startX;
          let scrollLeft;
          cardsRow.addEventListener("mousedown", (e) => {
            isDown = true;
            cardsRow.style.cursor = "grabbing";
            startX = e.pageX - cardsRow.offsetLeft;
            scrollLeft = cardsRow.scrollLeft;
            stopAutoScroll();
          });
          cardsRow.addEventListener("mouseleave", () => {
            isDown = false;
            cardsRow.style.cursor = "grab";
            if (isAutoScrolling.value) {
              startAutoScroll();
            }
          });
          cardsRow.addEventListener("mouseup", () => {
            isDown = false;
            cardsRow.style.cursor = "grab";
            if (isAutoScrolling.value) {
              startAutoScroll();
            }
          });
          cardsRow.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - cardsRow.offsetLeft;
            const walk = (x - startX) * 2;
            cardsRow.scrollLeft = scrollLeft - walk;
          });
          if (topViewLocations.value.length > 1) {
            startAutoScroll();
          }
        }
      };

      const setupAnimations = () => {
        document
          .querySelectorAll(
            ".fade-in, .slide-up, .slide-right, .slide-left, .scale-in, .bounce-in, .rotate-in"
          )
          .forEach((el) => {
            el.style.visibility = "visible";
            el.style.opacity = "1";
          });

        const featureSection = document.querySelector(".features-section");
        if (featureSection) {
          featureSection.style.visibility = "visible";
          featureSection.style.opacity = "1";
        }
      };

      setupScrollers();
      setupAnimations();
      startAutoSlide();
    }, 500);
  });
});

onBeforeUnmount(() => {
  stopAutoScroll();
  stopAutoSlide();
  if (suggestionDebounceTimeout.value) {
    clearTimeout(suggestionDebounceTimeout.value);
  }
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("language-changed", () => {});
  window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  window.removeEventListener("show-toast", handleToastEvent);
});
</script>

<template>
  <div class="home-container">
    <div v-if="showToast" :class="['toast-notification', toastType, { show: showToast }]">
      {{ toastMessage }}
    </div>

    <div v-if="false" class="wishlist-debug-info">
      <p><strong>Wishlist Count:</strong> {{ wishlistCount }}</p>
      <p><strong>Update Key:</strong> {{ wishlistUpdateKey }}</p>
      <p><strong>Items:</strong> {{ wishlistItems.length }}</p>
    </div>

    <section class="hero-header">
      <div class="hero-slider">
        <div class="slider-images">
          <div
            v-for="(image, index) in heroImages"
            :key="index"
            class="slider-image"
            :class="{ active: currentImageIndex === index }"
          >
            <img :src="image.src" :alt="image.alt" class="hero-header-bg" />
            <div class="hero-header-overlay"></div>
          </div>
        </div>

        <div class="hero-header-content">
          <h1>{{ t("cambodia") }}</h1>
          <p class="hero-header-subtitle">{{ t("find-favorite-place") }}</p>
          <div class="search-container">
            <div class="search-box">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="t('search-placeholder')"
                class="search-input"
                @keyup.enter="handleSearch"
                @input="onSearchInput"
              />
              <button class="search-btn" @click="handleSearch">
                <img src="../../assets/icons/icons8-search-24.png" alt="Search" />
              </button>
            </div>

            <div
              v-if="showSuggestions && searchSuggestions.length > 0"
              class="search-suggestions"
            >
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion.id"
                class="suggestion-item"
                @click="selectSuggestion(suggestion)"
              >
                <div class="suggestion-image">
                  <img
                    :src="suggestion.image || placeholderImage"
                    :alt="suggestion.name"
                    @error="handleImageError"
                    class="suggestion-img"
                  />
                  <div class="suggestion-type-badge">
                    <svg v-if="suggestion.type === 'location'" viewBox="0 0 24 24">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path
                        d="M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <div class="suggestion-content">
                  <div class="suggestion-title">{{ suggestion.name }}</div>
                  <div class="suggestion-description" v-if="suggestion.description">
                    {{ suggestion.description }}
                  </div>
                  <div class="suggestion-type">
                    {{ suggestion.type === "location" ? t("location") : t("product") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="thumbnail-strip">
          <div class="thumbnail-container">
            <div
              v-for="(image, index) in heroImages"
              :key="`thumb-${index}`"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="changeImage(index)"
            >
              <img :src="image.src" :alt="image.alt" />
              <div class="thumbnail-overlay"></div>
            </div>
          </div>
        </div>
        <div class="slide-indicators">
          <button
            v-for="(image, index) in heroImages"
            :key="`indicator-${index}`"
            class="indicator"
            :class="{ active: currentImageIndex === index }"
            @click="changeImage(index)"
          ></button>
        </div>
      </div>
    </section>
    <div v-if="isSearchActive" class="search-results-section">
      <div class="content-container">
        <div class="search-results-header">
          <h2>{{ t("search-results-for") }} "{{ currentSearchTerm }}"</h2>
          <p class="results-count">
            {{ totalResults }} {{ totalResults === 1 ? t("result") : t("results") }}
            {{ t("found") }}
          </p>
        </div>
        <div class="search-tabs">
          <button
            class="search-tab"
            :class="{ active: activeSearchTab === 'all' }"
            @click="setSearchTab('all')"
          >
            {{ t("all") }} ({{ totalResults }})
          </button>
          <button
            class="search-tab"
            :class="{ active: activeSearchTab === 'locations' }"
            @click="setSearchTab('locations')"
          >
            {{ t("locations") }} ({{ searchResults.locations?.length || 0 }})
          </button>
          <button
            class="search-tab"
            :class="{ active: activeSearchTab === 'products' }"
            @click="setSearchTab('products')"
          >
            {{ t("products") }} ({{ searchResults.products?.length || 0 }})
          </button>
        </div>
        <div class="search-results-content">
          <div
            v-if="activeSearchTab === 'all' || activeSearchTab === 'locations'"
            class="locations-results"
          >
            <h3 v-if="activeSearchTab === 'all'" class="results-section-title">
              {{ t("locations") }}
            </h3>
            <div v-if="searchResults.locations?.length > 0" class="search-results-grid">
              <div
                v-for="location in searchResults.locations"
                :key="location.id"
                class="search-result-card location-card"
              >
                <div class="wishlist-btn-container">
                  <WishlistButton
                    :item="location"
                    size="small"
                    :key="`search-${location.id}-${wishlistUpdateKey}`"
                    @added="onWishlistAdded"
                    @removed="onWishlistRemoved"
                    @error="onWishlistError"
                  />
                </div>
                <router-link :to="`location/detail/${location.id}`">
                  <div class="result-image">
                    <img
                      :src="location.is_thumbnail"
                      :alt="getLocalizedName(location)"
                      @error="handleImageError"
                    />
                    <div class="result-overlay"></div>
                  </div>
                  <div class="result-content">
                    <h4 class="result-title">{{ getLocalizedName(location) }}</h4>
                    <p class="result-description">{{ getLocalizedSubtitle(location) }}</p>
                    <div class="result-rating">
                      <div class="rating-stars">
                        <span
                          v-for="n in 5"
                          :key="n"
                          class="star-icon"
                          :class="{
                            filled: n <= Math.floor(location.rate_star),
                            half:
                              n === Math.ceil(location.rate_star) &&
                              !Number.isInteger(location.rate_star),
                          }"
                        ></span>
                      </div>
                      <span class="rating-score">{{ location.rate_star || "0.0" }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else-if="activeSearchTab === 'locations'" class="no-results">
              <p>{{ t("no-locations-found-for-search") }}</p>
            </div>
          </div>

          <!-- Products Results -->
          <div
            v-if="activeSearchTab === 'all' || activeSearchTab === 'products'"
            class="products-results"
          >
            <h3 v-if="activeSearchTab === 'all'" class="results-section-title">
              {{ t("products") }}
            </h3>
            <div v-if="searchResults.products?.length > 0" class="search-results-grid">
              <div
                v-for="product in searchResults.products"
                :key="`${product.product_id}-${product.color}`"
                class="search-result-card product-card"
              >
                <div class="wishlist-btn-container">
                  <WishlistButton
                    :item="location"
                    size="small"
                    :key="`search-${location.id}-${wishlistUpdateKey}`"
                    @added="onWishlistAdded"
                    @removed="onWishlistRemoved"
                    @error="onWishlistError"
                  />
                </div>
                <router-link :to="`/product/detail/${product.product_id}`">
                  <div class="result-image">
                    <img
                      :src="product.is_thumbnail"
                      :alt="product.product_name"
                      @error="handleImageError"
                    />
                    <div class="result-overlay"></div>
                  </div>
                  <div class="result-content">
                    <h4 class="result-title">
                      {{
                        currentLanguage === "km"
                          ? product.product_name_km || product.product_name
                          : product.product_name
                      }}
                    </h4>
                    <!-- <h4 class="result-title">{{ product.product_name }}</h4> -->
                    <p class="result-description">
                      {{ product.color }} - {{ t("size") }} {{ product.size }}
                    </p>
                    <div class="result-price">
                      <span class="price">${{ product.price }}</span>
                      <span class="stock">{{ product.qty }} {{ t("in-stock") }}</span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else-if="activeSearchTab === 'products'" class="no-results">
              <p>{{ t("no-products-found-for-search") }}</p>
            </div>
          </div>
        </div>

        <!-- Search Pagination -->
        <div
          v-if="searchPagination && searchPagination.last_page > 1"
          class="search-pagination"
        >
          <button
            @click="goToSearchPage(1)"
            :disabled="searchPagination.current_page === 1"
            class="pagination-btn"
          >
            {{ t("first") }}
          </button>
          <button
            @click="goToSearchPage(searchPagination.current_page - 1)"
            :disabled="searchPagination.current_page === 1"
            class="pagination-btn"
          >
            {{ t("previous") }}
          </button>
          <span class="pagination-info">
            {{ t("page") }} {{ searchPagination.current_page }} {{ t("of") }}
            {{ searchPagination.last_page }}
          </span>
          <button
            @click="goToSearchPage(searchPagination.current_page + 1)"
            :disabled="searchPagination.current_page === searchPagination.last_page"
            class="pagination-btn"
          >
            {{ t("next") }}
          </button>
          <button
            @click="goToSearchPage(searchPagination.last_page)"
            :disabled="searchPagination.current_page === searchPagination.last_page"
            class="pagination-btn"
          >
            {{ t("last") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content (Only show when not in search mode) -->
    <div v-if="!isSearchActive">
      <div class="chatbot-section fade-in">
        <div class="chatbot-content">
          <div class="chatbot-header">
            <div class="chatbot-avatar">
              <img src="../../assets/icons/chatbot.png" alt="Chatbot Avatar" />
            </div>
            <div class="chatbot-title-container">
              <h3 class="chatbot-title">{{ t("ai-tour-guide") }}</h3>
              <p class="chatbot-subtitle">{{ t("chatbot-description") }}</p>
            </div>
          </div>
          <div class="chatbot-features">
            <div
              class="chatbot-feature"
              v-for="feature in chatbotFeatures"
              :key="feature.key"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path :d="feature.iconPath" fill="currentColor" />
              </svg>
              <span>{{ t(feature.translationKey) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recently Viewed Section with Enhanced Wishlist Integration -->
      <div class="recently-viewed-section">
        <div class="content-container">
          <h2 class="recently-viewed-title fade-in">{{ t("recently-viewed") }}</h2>
          <div class="cards-row custom-scrollbar" ref="cardsRowRef">
            <div
              v-for="(location, index) in topViewLocations"
              :key="location.id"
              class="scroll-card slide-up"
              :class="`delay-${(index + 1) * 100}`"
            >
              <div v-if="location.total_view > 0" class="card-tag">
                {{ t("popular") }}
              </div>
              <div class="favorite-btn">
                <WishlistButton
                  :item="location"
                  size="small"
                  :key="`top-${location.id}-${wishlistUpdateKey}`"
                  @added="onWishlistAdded"
                  @removed="onWishlistRemoved"
                  @error="onWishlistError"
                />
              </div>
              <router-link :to="`location/detail/${location.id}`">
                <img
                  :src="location.is_thumbnail"
                  :alt="getLocalizedName(location)"
                  class="card-image"
                  @error="handleImageError"
                />
                <div class="overlay-gradient"></div>
                <div class="card-content">
                  <div class="card-title">{{ getLocalizedName(location) }}</div>
                  <div class="card-subtitle">{{ getLocalizedSubtitle(location) }}</div>
                  <div class="card-rating">
                    <div class="rating-stars">
                      <span
                        v-for="n in 5"
                        :key="n"
                        class="star-icon"
                        :class="{
                          filled: n <= Math.floor(location.rate_star),
                          half:
                            n === Math.ceil(location.rate_star) &&
                            !Number.isInteger(location.rate_star),
                        }"
                      ></span>
                    </div>
                    <span class="rating-score">{{ location.rate_star || "0.0" }}</span>
                    <span class="review-count"
                      >({{ location.total_view || 0 }}
                      {{ location.total_view === 1 ? t("view") : t("views") }})</span
                    >
                  </div>
                </div>
              </router-link>
            </div>

            <div v-if="topViewLocations.length === 0" class="scroll-card empty-card">
              <div class="empty-card-content">
                <i class="icon-placeholder"></i>
                <p>{{ t("no-locations-available") }}</p>
              </div>
            </div>
          </div>

          <div v-if="topViewLocations.length > 0" class="scroll-controls scale-in">
            <button class="scroll-btn prev-scroll" @click="scrollPrev">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button class="scroll-btn next-scroll" @click="scrollNext">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Dynamic Category Pills -->
      <div class="content-container">
        <div class="category-pills fade-in">
          <div v-if="isLoadingCategories" class="loading-categories">
            <div class="loading-spinner"></div>
            <span>{{ t("loading-categories") }}...</span>
          </div>

          <button
            v-for="category in categories"
            :key="category.key"
            class="category-pill"
            :class="{ active: selectedCategory === category.key }"
            @click="selectCategory(category.key)"
          >
            <span v-if="category.image" class="category-icon">
              <img :src="category.image" :alt="category.name" class="category-image" />
            </span>
            {{
              currentLanguage === "km" ? category.name_km || category.name : category.name
            }}
          </button>
        </div>

        <div
          v-if="selectedCategory !== 'all' && selectedCategoryInfo"
          class="selected-category-info fade-in"
        >
          <div class="category-info-card">
            <div class="category-info-image" v-if="selectedCategoryInfo.image">
              <img :src="selectedCategoryInfo.image" :alt="selectedCategoryInfo.name" />
            </div>
            <div class="category-info-content">
              <h3>{{ getLocalizedCategoryName(selectedCategoryInfo) }}</h3>
              <p>{{ selectedCategoryInfo.description }}</p>
            </div>
          </div>
        </div>

        <!-- Heritage Tourism Section with Enhanced Wishlist Integration -->
        <div class="section-header-wrapper fade-in">
          <div class="header">{{ t("heritage-tourism") }}</div>
          <h2 class="title" data-text="{{ t('ready-to-explore') }}">
            {{ t("ready-to-explore") }}
          </h2>
          <div class="underline"></div>
          <p class="subtitle">{{ t("heritage-tourism-description") }}</p>
        </div>

        <div class="card-container slide-up">
          <div
            v-for="(location, index) in filteredLocations"
            :key="location.id"
            class="card hover-float"
            :class="`delay-${(index + 1) * 100}`"
          >
            <router-link :to="`location/detail/${location.id}`">
              <div v-if="location.rate_star > 3.5" class="badge award">
                {{ t("top-rated") }}
              </div>
              <div v-else-if="location.total_view === 0" class="badge new">
                {{ t("new") }}
              </div>
              <!-- Enhanced favorite button with proper event handling -->
              <div class="favorite-btn" @click.prevent="toggleFavorite(location.id)">
                <WishlistButton
                  :item="location"
                  size="small"
                  :key="`main-${location.id}-${wishlistUpdateKey}`"
                  @added="onWishlistAdded"
                  @removed="onWishlistRemoved"
                  @error="onWishlistError"
                  @click.prevent.stop
                />
              </div>
              <img
                :src="location.is_thumbnail"
                :alt="getLocalizedName(location)"
                class="card-image"
                @error="handleImageError"
              />
              <div class="overlay-gradient"></div>
              <div class="card-content">
                <div class="card-title">{{ getLocalizedName(location) }}</div>
                <div class="card-location">{{ getLocalizedSubtitle(location) }}</div>
                <div class="card-rating">
                  <div class="rating-stars">
                    <span
                      v-for="n in 5"
                      :key="n"
                      class="star-icon"
                      :class="{
                        filled: n <= Math.floor(location.rate_star),
                        half:
                          n === Math.ceil(location.rate_star) &&
                          !Number.isInteger(location.rate_star),
                      }"
                    ></span>
                  </div>
                  <span class="rating-score">{{ location.rate_star || "0.0" }}</span>
                  <span class="review-count"
                    >({{ location.total_view || 0 }}
                    {{ location.total_view === 1 ? t("view") : t("views") }})</span
                  >
                </div>
              </div>
            </router-link>
          </div>

          <div v-if="filteredLocations.length === 0 && !isLoading" class="empty-state">
            <div class="empty-icon">📍</div>
            <h3>{{ t("no-locations-found") }}</h3>
            <p v-if="selectedCategory !== 'all'">{{ t("try-different-category") }}</p>
            <p v-else>{{ t("adding-new-locations-soon") }}</p>
            <button
              @click="selectCategory('all')"
              v-if="selectedCategory !== 'all'"
              class="reset-filter-btn"
            >
              {{ t("show-all-locations") }}
            </button>
          </div>
        </div>

        <div class="pagination scale-in">
          <button class="active"><span>1</span></button>
          <button><span>2</span></button>
          <router-link to="/adventure">
            <button class="more-btn">{{ t("more") }}</button>
          </router-link>
        </div>

        <!-- Features Section -->
        <div class="features-section" style="visibility: visible; opacity: 1">
          <div class="feature-card delay-100" style="visibility: visible; opacity: 1">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 class="feature-title">{{ t("best-locations") }}</h3>
            <p class="feature-desc">{{ t("best-locations-description") }}</p>
          </div>

          <div class="feature-card bounce-in delay-200">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 class="feature-title">{{ t("local-guides") }}</h3>
            <p class="feature-desc">{{ t("local-guides-description") }}</p>
          </div>

          <div class="feature-card bounce-in delay-300">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 class="feature-title">{{ t("best-prices") }}</h3>
            <p class="feature-desc">{{ t("best-prices-description") }}</p>
          </div>

          <div class="feature-card bounce-in delay-400">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 class="feature-title">{{ t("easy-booking") }}</h3>
            <p class="feature-desc">{{ t("easy-booking-description") }}</p>
          </div>
        </div>

        <!-- Shopping Section with Dynamic Brands and Wishlist Integration -->
        <div v-if="products && products.length > 0" class="shopping-section slide-up">
          <div class="section-header">
            <span class="section-badge">{{ t("shopping") }}</span>
            <h2>{{ t("get-your-need") }}</h2>
            <p class="subtitle">{{ t("shopping-description") }}</p>
          </div>

          <div class="category-pills">
            <div v-if="isLoadingBrands" class="loading-categories">
              <div class="loading-spinner"></div>
              <span>{{ t("loading-brands") }}...</span>
            </div>

            <button
              v-for="productCategory in productCategories"
              :key="productCategory.key"
              class="category-pill"
              :class="{ active: selectedProductCategory === productCategory.key }"
              @click="selectProductCategory(productCategory.key)"
            >
              {{ getLocalizedBrandName(productCategory) }}
            </button>
          </div>

          <div class="product-grid slide-right">
            <div
              v-for="(product, index) in filteredProducts"
              :key="`${product.product_id}-${product.color}-${index}`"
              class="product-card hover-float"
              :class="`delay-${(index + 1) * 100}`"
            >
              <router-link :to="`/product/detail/${product.product_id}`">
                <div class="product-label sale">{{ t("sale") }}</div>
                <img
                  :src="
                    product.is_thumbnail ||
                    'https://placehold.co/400x300/19ADCF/ffffff?text=Product'
                  "
                  :alt="getLocalizedProductName(product)"
                  class="product-image"
                  @error="handleImageError"
                />
                <div class="quick-action">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div class="product-info">
                  <h3 class="product-brand">{{ getLocalizedProductName(product) }}</h3>
                  <p class="product-name">
                    {{ product.color }} - {{ t("size") }} {{ product.size }}
                  </p>
                  <div class="product-price">
                    <span class="current-price">${{ product.price }}</span>
                  </div>
                  <p class="stock-info" :class="{ low: product.qty < 10 }">
                    {{ product.qty }} {{ t("in-stock") }}
                  </p>
                  <p class="product-category">
                    {{ product.color === "Red" ? t("featured") : t("regular") }}
                  </p>
                  <div class="rating-stars">
                    <span class="star-icon filled"></span>
                    <span class="star-icon filled"></span>
                    <span class="star-icon filled"></span>
                    <span class="star-icon filled"></span>
                    <span class="star-icon half"></span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0 && !isLoading" class="empty-state">
            <div class="empty-icon">🛍️</div>
            <h3>{{ t("no-products-found") }}</h3>
            <p v-if="selectedProductCategory !== 'all'">{{ t("try-different-brand") }}</p>
            <p v-else>{{ t("adding-new-products-soon") }}</p>
            <button
              @click="selectProductCategory('all')"
              v-if="selectedProductCategory !== 'all'"
              class="reset-filter-btn"
            >
              {{ t("show-all-products") }}
            </button>
          </div>

          <div class="pagination scale-in">
            <button class="active"><span>1</span></button>
            <button><span>2</span></button>
            <router-link to="/product">
              <button class="more-btn">{{ t("more") }}</button>
            </router-link>
          </div>
        </div>

        <!-- Newsletter Section -->
        <div class="newsletter-section fade-in">
          <div class="newsletter-image-container">
            <img
              src="https://i.shgcdn.com/26c7dd1b-1629-429b-b4fa-09b8a5c0cb0f/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
              alt="Beautiful Cambodia scenery"
              class="newsletter-image"
            />
            <div class="newsletter-image-overlay"></div>
          </div>
          <div class="newsletter-content">
            <h3 class="newsletter-title">{{ t("newsletter-title") }}</h3>
            <p class="newsletter-desc">{{ t("newsletter-description") }}</p>
            <div class="newsletter-features">
              <div class="newsletter-feature">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>{{ t("travel-updates") }}</span>
              </div>
              <div class="newsletter-feature">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span>{{ t("exclusive-offers") }}</span>
              </div>
            </div>
            <p class="newsletter-privacy">{{ t("newsletter-privacy") }}</p>
          </div>
        </div>

        <!-- Call to Action Section -->
        <div class="cta-section slide-up">
          <div class="cta-content">
            <div class="cta-text">
              <h3 class="cta-title">{{ t("cta-title") }}</h3>
              <p class="cta-desc">{{ t("cta-description") }}</p>
              <div class="cta-buttons">
                <a href="/Locations" class="cta-btn">{{ t("explore-tours") }}</a>
                <a href="/Contact" class="cta-btn secondary">{{ t("contact-us") }}</a>
              </div>
            </div>
            <div class="cta-image">
              <img src="../../assets/image/PhnomPhsar.jpg" alt="Cambodia Adventure Map" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Import the enhanced CSS style from assets */
@import "@/assets/css/home.css";

/* WISHLIST CONFIGURATION STYLES */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 10000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
}

.toast-notification.show {
  transform: translateX(0);
}

.toast-notification.success {
  background: #28a745;
}

.toast-notification.error {
  background: #dc3545;
}

.toast-notification.info {
  background: #17a2b8;
}

.wishlist-debug-info {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 9999;
  font-family: monospace;
}

.wishlist-debug-info p {
  margin: 2px 0;
}

.wishlist-btn-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 5px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.wishlist-btn-container:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* Enhanced wishlist button positioning for different card types */
.search-result-card .wishlist-btn-container,
.product-card .wishlist-btn-container {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 15;
}

.scroll-card .favorite-btn,
.card .favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-card .favorite-btn:hover,
.card .favorite-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* Loading states for wishlist */
.wishlist-updating {
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.wishlist-sync-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

/* Enhanced category pills and loading states */
.loading-categories {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #666;
  font-weight: 500;
}

.loading-categories .loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.category-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  padding: 12px 20px;
  border-radius: 25px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  min-height: 44px;
}

.category-pill:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 173, 207, 0.3);
}

.category-pill.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(25, 173, 207, 0.4);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Selected category info card */
.selected-category-info {
  margin: 20px 0;
  animation: fadeIn 0.5s ease-out;
}

.category-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(25, 173, 207, 0.1) 0%,
    rgba(25, 173, 207, 0.05) 100%
  );
  border-radius: 15px;
  border: 1px solid rgba(25, 173, 207, 0.2);
  box-shadow: 0 4px 15px rgba(25, 173, 207, 0.1);
}

.category-info-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-info-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-info-content h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.category-info-content p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.category-pills {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

/* Responsive wishlist styles */
@media (max-width: 768px) {
  .toast-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
    text-align: center;
  }

  .wishlist-debug-info {
    position: relative;
    margin: 10px;
    font-size: 11px;
  }

  .wishlist-btn-container {
    top: 8px;
    right: 8px;
    padding: 4px;
  }

  .category-pills {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .category-pill {
    justify-content: center;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .category-info-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .category-info-image {
    width: 60px;
    height: 60px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced search results with wishlist integration */
.search-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.search-result-card {
  position: relative;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.result-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.search-result-card:hover .result-image img {
  transform: scale(1.05);
}

.result-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
}

.result-content {
  padding: 20px;
}

.result-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
}

.result-description {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

/* Additional visual enhancements */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(
    135deg,
    rgba(25, 173, 207, 0.05) 0%,
    rgba(25, 173, 207, 0.02) 100%
  );
  border-radius: 15px;
  border: 2px dashed rgba(25, 173, 207, 0.2);
  animation: fadeIn 0.5s ease-out;
  margin: 20px 0;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.4rem;
  font-weight: 600;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
  display: block;
}

.reset-filter-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.reset-filter-btn:hover {
  background: #1594b8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 173, 207, 0.3);
}
.card-tag {
  position: absolute;
  top: 140px;
  left: 15px;
  background-color: var(--primary-color);
  color: white;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
@media (max-width: 480px) {
  .product-grid .card,
  .product-grid .product-card {
    max-width: 390px;
  }
}
</style>
