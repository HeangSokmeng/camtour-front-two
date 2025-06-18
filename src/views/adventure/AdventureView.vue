<template>
  <div class="siem-reap-page-containerAdv">
    <!-- Loading overlay -->
    <!-- <div class="loading-overlay" v-if="isLoading">
      <div class="loading-spinner"></div>
    </div> -->

    <!-- Content when loaded -->
    <!-- <template> -->
    <!-- Hero Header Section -->
    <section class="hero-header-adv">
      <div class="hero-content-adv">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ t("hero-title-line1") }}<br />
            {{ t("hero-title-line2") }}
          </h1>
          <p class="hero-subtitle">{{ t("hero-subtitle") }}</p>
          <p class="hero-description">
            {{ t("hero-description") }}
          </p>
        </div>
      </div>
      <div class="hero-image">
        <img
          :src= imgBanner
          :alt="t('hiking-adventure-alt')"
        />
      </div>
    </section>

    <div class="header3">
      <span class="tag">{{ t("adventure-tourism-tag") }}</span>
      <h1>{{ t("ready-to-hiking-title") }}</h1>
    </div>

    <button class="mobile-filter-toggle" @click="toggleMobileFilters" v-if="isMobile">
      <i class="fas fa-filter"></i>
      {{ t("filter-options") }}
    </button>

    <div
      class="sidebar-overlay"
      :class="{ active: showMobileFilters }"
      @click="closeMobileFilters"
    ></div>

    <div class="containerAdv">
      <aside class="sidebar" :class="{ active: showMobileFilters }">
        <button class="reset-filter-btn" @click="resetFilters" v-if="isFiltered">
          <i class="fas fa-undo"></i> {{ t("reset-filters") }}
        </button>
        <button class="sidebar-close" @click="closeMobileFilters" v-if="isMobile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 011.708 0L8 6.293l1.646-1.647a.5.5 0 01.708.708L8.707 7l1.647 1.646a.5.5 0 01-.708.708L8 7.707 6.354 9.354a.5.5 0 01-.708-.708L7.293 7 5.646 5.354a.5.5 0 010-.708z"
            />
          </svg>
        </button>
        <div class="filter-section">
          <h3></h3>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('search-placeholder')"
            class="search_input"
            @input="debounceSearch"
          />
        </div>
        <div class="filter-section">
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 01.553-1.382L9 2m0 0l6 3m-6-3v18m6-15l5.447 2.724A2 2 0 0121 8.618v9.764a2 2 0 01-.553 1.382L15 22m0 0V4"
              />
            </svg>
            {{ t("select-province") }}
          </h3>
          <ul class="place-list">
            <li
              v-for="province in provinces"
              :key="province.id"
              @click="filterByProvince(province.id)"
              :class="{ active: selectedProvinceId === province.id }"
            >
              {{ getLocalizedName(province, "province") }}
            </li>
          </ul>
        </div>
        <div class="filter-section" v-if="selectedProvinceId && districts.length > 0">
          <h4><i class="fas fa-map-marker-alt"></i> {{ t("select-district") }}</h4>
          <ul class="popular-list">
            <li
              @click="filterByDistrict(null)"
              :class="{ active: selectedDistrictId === null }"
            >
              {{ t("all-districts") }}
            </li>
            <li
              v-for="district in districts"
              :key="district.id"
              @click="filterByDistrict(district.id)"
              :class="{ active: selectedDistrictId === district.id }"
            >
              {{ getLocalizedName(district, "district") }}
            </li>
          </ul>
        </div>

        <div class="filter-section" v-if="selectedDistrictId && communes.length > 0">
          <h4><i class="fas fa-building"></i> {{ t("select-commune") }}</h4>
          <ul class="popular-list">
            <li
              @click="filterByCommune(null)"
              :class="{ active: selectedCommuneId === null }"
            >
              {{ t("all-communes") }}
            </li>
            <li
              v-for="commune in communes"
              :key="commune.id"
              @click="filterByCommune(commune.id)"
              :class="{ active: selectedCommuneId === commune.id }"
            >
              {{ getLocalizedName(commune, "commune") }}
            </li>
          </ul>
        </div>
        <div class="filter-section" v-if="selectedCommuneId && villages.length > 0">
          <h4><i class="fas fa-home"></i> {{ t("select-village") }}</h4>
          <ul class="popular-list">
            <li
              @click="filterByVillage(null)"
              :class="{ active: selectedVillageId === null }"
            >
              {{ t("all-villages") }}
            </li>
            <li
              v-for="village in villages"
              :key="village.id"
              @click="filterByVillage(village.id)"
              :class="{ active: selectedVillageId === village.id }"
            >
              {{ getLocalizedName(village, "village") }}
            </li>
          </ul>
        </div>
        <div class="filter-section" v-if="categories.length > 0">
          <h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path
                d="M497.9 225.1L286.9 14.1C278.6 5.7 267.1 0 255 0H112C85.5 0 64 21.5 64 48v143c0 12.1 5.7 23.6 14.1 31.9l211 211c18.8 18.8 49.2 18.8 67.9 0l141-141c18.8-18.8 18.8-49.2 0-67.9zM112 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
              />
            </svg>
            {{ t("select-category") }}
          </h4>
          <ul class="stars">
            <li
              @click="filterByCategory(null)"
              :class="{ active: selectedCategoryId === null }"
            >
              {{ t("all-categories") }}
            </li>
            <li
              v-for="category in categories"
              :key="category.id"
              @click="filterByCategory(category.id)"
              :class="{ active: selectedCategoryId === category.id }"
            >
              {{ getLocalizedName(category, "category") }}
            </li>
          </ul>
        </div>

        <div class="filter-section">
          <h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path
                d="M287.9 17.8L354 150.2l146.6 21.3c26.2 3.8 36.7 36 17.7 54.6L416 347.3l25 145.5c4.5 26.2-23.1 46-46.4 33.7L288 439.6l-130.6 68.9c-23.3 12.3-50.9-7.5-46.4-33.7l25-145.5-106.3-103.2c-19-18.6-8.5-50.8 17.7-54.6L222 150.2 288.1 17.8c11.7-23.6 45.6-23.9 57.3 0z"
              />
            </svg>
            {{ t("star-rating") }}
          </h4>
          <ul class="stars">
            <li @click="filterByStar(null)" :class="{ active: selectedStar === null }">
              {{ t("all-ratings") }}
            </li>
            <li @click="filterByStar(5)" :class="{ active: selectedStar === 5 }">
              {{ t("five-stars") }} <span>⭐⭐⭐⭐⭐</span>
            </li>
            <li @click="filterByStar(4)" :class="{ active: selectedStar === 4 }">
              {{ t("four-stars") }} <span>⭐⭐⭐⭐☆</span>
            </li>
            <li @click="filterByStar(3)" :class="{ active: selectedStar === 3 }">
              {{ t("three-stars") }} <span>⭐⭐⭐☆☆</span>
            </li>
            <li @click="filterByStar(2)" :class="{ active: selectedStar === 2 }">
              {{ t("two-stars") }} <span>⭐⭐☆☆☆</span>
            </li>
            <li @click="filterByStar(1)" :class="{ active: selectedStar === 1 }">
              {{ t("one-star") }} <span>⭐☆☆☆☆</span>
            </li>
          </ul>
        </div>
      </aside>

      <main class="main-content">
        <div class="filter-summary" v-if="isFiltered">
          <p>
            {{ t("showing-filtered-results") }}: {{ totalResults }}
            {{ t("locations-found") }}
          </p>
        </div>
        <div v-if="locations.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <i
              class="fas fa-search"
              style="font-size: 4rem; color: white; margin-bottom: 1rem"
            ></i>
          </div>
          <p>{{ t("no-locations-found") }}</p>
          <p class="empty-state-subtitle">{{ t("try-adjusting-filters") }}</p>
        </div>
        <div class="card_adv-grid" v-else>
          <div
            class="card_adv"
            v-for="location in locations"
            :key="location.id"
            @click="viewLocation(location.id)"
          >
            <img
              :src="location.is_thumbnail || placeholderImage"
              :alt="getLocationDisplayName(location)"
              @error="handleImageError"
              loading="lazy"
            />
            <div class="card_adv-tag">
              {{ getLocationCategoryName(location) }}
            </div>
            <div class="card_adv-body">
              <div class="card_adv-meta">
                <i class="fas fa-calendar"></i>
                {{ formatDate(new Date()) }}
              </div>
              <h4>{{ getLocationDisplayName(location) }}</h4>
              <p>
                <i class="fas fa-map-marker-alt"></i>
                {{ formatLocationAddress(location) }}
              </p>
              <p>
                <i class="fas fa-star"></i>
                <span>{{ location.rate_star || 0 }} {{ t("stars") }} </span>
                <span>{{ location.total_view || 0 }} {{ t("views") }} </span>
              </p>
            </div>
            <div class="read-more">
              <span class="read-more-btn">{{ t("read-more") }}</span>
              <button class="icon-btn" :aria-label="t('view-details')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M285.5 273l-194.3 194.3c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9L194.5 256 34.7 96.3c-9.4-9.4-9.4-24.6 0-33.9L57.3 39.8c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          class="pagination-containerAdv"
          v-if="pagination && pagination.last_page > 1"
        >
          <div class="pagination">
            <button
              v-if="pagination.current_page > 1"
              @click="changePage(pagination.current_page - 1)"
              class="prev-btn"
              :aria-label="t('previous-page')"
            >
              <i class="fas fa-chevron-left"></i>
              <span v-if="!isMobile">{{ t("prev") }}</span>
            </button>
            <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="changePage(page)"
              :class="{ active: page === pagination.current_page }"
              :disabled="page === '...'"
              :aria-label="
                page === '...' ? t('more-pages') : t('page-number', { number: page })
              "
            >
              {{ page }}
            </button>
            <button
              v-if="pagination.current_page < pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
              class="next-btn"
              :aria-label="t('next-page')"
            >
              <span v-if="!isMobile">{{ t("next") }}</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup>
import imgBanner from '@/assets/adventure/banner.png';
import "@/assets/css/adventure.css";
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { currentLanguage, t } = useTranslation();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const locations = ref([]);
const topViewLocations = ref([]);
const pagination = ref(null);
const totalResults = ref(0);
const provinces = ref([]);
const districts = ref([]);
const communes = ref([]);
const villages = ref([]);
const categories = ref([]);

const isMobile = ref(false);
const showMobileFilters = ref(false);
const searchQuery = ref("");
const selectedProvinceId = ref(null);
const selectedDistrictId = ref(null);
const selectedCommuneId = ref(null);
const selectedVillageId = ref(null);
const selectedCategoryId = ref(null);
const selectedStar = ref(null);
let searchDebounceTimer = null;

const isFiltered = computed(() => {
  return (
    searchQuery.value ||
    selectedProvinceId.value ||
    selectedDistrictId.value ||
    selectedCommuneId.value ||
    selectedVillageId.value ||
    selectedCategoryId.value ||
    selectedStar.value
  );
});

const isKhmerLanguage = computed(() => currentLanguage.value === "km");
const placeholderImage = "https://placehold.co/400x300/0085FF/FFFFFF?text=Camtour";

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    showMobileFilters.value = false;
  }
};

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
  if (showMobileFilters.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileFilters = () => {
  showMobileFilters.value = false;
  document.body.style.overflow = "";
};

const getLocalizedName = (item, type) => {
  if (!item) return "";
  if (isKhmerLanguage.value && item.local_name) {
    return item.local_name;
  }
  if (isKhmerLanguage.value && item.name_km) {
    return item.name_km;
  }
  const key = `${type}-${item.name.toLowerCase().replace(/\s+/g, "-")}`;
  const translated = t(key);
  return translated !== key ? translated : item.name;
};

const getLocationDisplayName = (location) => {
  if (!location) return "";
  if (isKhmerLanguage.value && location.name_local) {
    return location.name_local;
  }
  return location.name;
};

const getLocationCategoryName = (location) => {
  if (!location || !location.category) {
    return t("adventure-category-default");
  }
  if (location.category.name_km) {
    return location.category.name_km;
  }
  const key = `category-${location.category.name.toLowerCase().replace(/\s+/g, "-")}`;
  const translated = t(key);
  return translated !== key ? translated : location.category.name;
};

const debounceSearch = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = setTimeout(() => {
    fetchAdventureData(1);
  }, 500);
};

const formatDate = (date) => {
  const locale = currentLanguage.value === "km" ? "km-KH" : "en-US";
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
};

// Fetch location options
const fetchProvinces = async () => {
  try {
    const globalStore = useGlobalStore();
    const response = await axios.get("/api/web/view/location/provinces", {
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      provinces.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
  }
};

const fetchDistricts = async (provinceId) => {
  if (!provinceId) {
    districts.value = [];
    communes.value = [];
    villages.value = [];
    return;
  }
  try {
    const globalStore = useGlobalStore();
    const response = await axios.get(
      `/api/web/view/location/districts/${provinceId}`,
      ...globalStore.getAxiosHeader()
    );
    if (response.data.result) {
      districts.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch districts:", error);
    districts.value = [];
  }
  communes.value = [];
  villages.value = [];
};

const fetchCommunes = async (districtId) => {
  if (!districtId) {
    communes.value = [];
    villages.value = [];
    return;
  }
  try {
    const globalStore = useGlobalStore();
    const response = await axios.get(`/api/web/view/location/communes/${districtId}`, {
      params: { lang: currentLanguage.value },
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      communes.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch communes:", error);
    communes.value = [];
  }
  villages.value = [];
};

const fetchVillages = async (communeId) => {
  if (!communeId) {
    villages.value = [];
    return;
  }
  try {
    const globalStore = useGlobalStore();
    const response = await axios.get(`/api/web/view/location/villages/${communeId}`, {
      params: { lang: currentLanguage.value },
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      villages.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch villages:", error);
    villages.value = [];
  }
};

const fetchCategories = async () => {
  try {
    const globalStore = useGlobalStore();
    const response = await axios.get("/api/web/view/categories", {
      params: { lang: currentLanguage.value },
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      categories.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// Fetch adventure data with filters and pagination
const fetchAdventureData = async (page = 1) => {
  const globalStore = useGlobalStore();
  const params = {
    page,
    lang: currentLanguage.value,
  };
  if (searchQuery.value) params.search = searchQuery.value;
  if (selectedProvinceId.value) params.province_id = selectedProvinceId.value;
  if (selectedDistrictId.value) params.district_id = selectedDistrictId.value;
  if (selectedCommuneId.value) params.commune_id = selectedCommuneId.value;
  if (selectedVillageId.value) params.village_id = selectedVillageId.value;
  if (selectedCategoryId.value) params.category_id = selectedCategoryId.value;
  if (selectedStar.value) params.star = selectedStar.value;

  try {
    const response = await axios.get("/api/web/view/adventure", {
      params,
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      const data = response.data.data;
      locations.value = data.locations || [];
      topViewLocations.value = data.top_view_location || [];
      pagination.value = data.pagination || null;
      totalResults.value = pagination.value?.total || 0;
      document.body.style.overflow = "";
      document.title = `${t("camtour-brand")} - ${t("adventure-page-title")}`;
      if (isMobile.value) closeMobileFilters();
    } else {
      console.error("API Error:", response.data.message);
    }
  } catch (error) {
    console.error("Failed to fetch adventure data:", error);
    await useGlobalStore().onCheckError(error);
  } finally {
    isLoading.value = false;
  }
};

// Format location address
const formatLocationAddress = (location) => {
  const parts = [];
  if (location.village) {
    if (isKhmerLanguage.value && location.village.local_name) {
      parts.push(location.village.local_name);
    } else {
      parts.push(location.village.name);
    }
  }
  if (location.commune) {
    if (isKhmerLanguage.value && location.commune.local_name) {
      parts.push(location.commune.local_name);
    } else {
      parts.push(location.commune.name);
    }
  }
  if (location.district) {
    parts.push(getLocalizedName(location.district, "district"));
  }
  if (location.province) {
    parts.push(getLocalizedName(location.province, "province"));
  }
  return parts.length > 0 ? parts.join(", ") : t("cambodia");
};

// Handle image error fallback
const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

// Filter functions
const filterByProvince = async (provinceId) => {
  selectedProvinceId.value = provinceId;
  selectedDistrictId.value = null;
  selectedCommuneId.value = null;
  selectedVillageId.value = null;
  if (provinceId) {
    await fetchDistricts(provinceId);
  } else {
    districts.value = [];
    communes.value = [];
    villages.value = [];
  }
  fetchAdventureData(1);
};

const filterByDistrict = async (districtId) => {
  selectedDistrictId.value = districtId;
  selectedCommuneId.value = null;
  selectedVillageId.value = null;
  if (districtId) {
    await fetchCommunes(districtId);
  } else {
    communes.value = [];
    villages.value = [];
  }
  fetchAdventureData(1);
};

const filterByCommune = async (communeId) => {
  selectedCommuneId.value = communeId;
  selectedVillageId.value = null;
  if (communeId) {
    await fetchVillages(communeId);
  } else {
    villages.value = [];
  }
  fetchAdventureData(1);
};

const filterByVillage = (villageId) => {
  selectedVillageId.value = villageId;
  fetchAdventureData(1);
};

const filterByCategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
  fetchAdventureData(1);
};

const filterByStar = (starRating) => {
  selectedStar.value = starRating;
  fetchAdventureData(1);
};

// Reset all filters
const resetFilters = () => {
  searchQuery.value = "";
  selectedProvinceId.value = null;
  selectedDistrictId.value = null;
  selectedCommuneId.value = null;
  selectedVillageId.value = null;
  selectedCategoryId.value = null;
  selectedStar.value = null;
  districts.value = [];
  communes.value = [];
  villages.value = [];
  fetchAdventureData(1);
};

// Pagination controls
const changePage = (page) => {
  if (page > 0 && (!pagination.value || page <= pagination.value.last_page)) {
    fetchAdventureData(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const getPageNumbers = () => {
  if (!pagination.value) return [];
  const pages = [];
  const totalPages = pagination.value.last_page;
  const currentPage = pagination.value.current_page;
  const maxVisible = isMobile.value ? 3 : 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 3);
    start = Math.max(2, end - maxVisible + 3);
    if (start > 2) {
      pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  return pages;
};

// View location detail
const viewLocation = (locationId) => {
  router.push(`/location/detail/${locationId}`);
};

// Apply filters based on route query
const applyRouteFilters = async () => {
  const query = route.query;

  if (query.province_id) {
    selectedProvinceId.value = parseInt(query.province_id);
    await fetchDistricts(selectedProvinceId.value);
  }

  if (query.district_id) {
    selectedDistrictId.value = parseInt(query.district_id);
    await fetchCommunes(selectedDistrictId.value);
  }

  if (query.commune_id) {
    selectedCommuneId.value = parseInt(query.commune_id);
    await fetchVillages(selectedCommuneId.value);
  }

  if (query.village_id) {
    selectedVillageId.value = parseInt(query.village_id);
  }

  if (query.category_id) {
    selectedCategoryId.value = parseInt(query.category_id);
  }

  if (query.star) {
    selectedStar.value = parseInt(query.star);
  }

  // Fetch data after setting filters
  fetchAdventureData();
};

// Load initial data on mounted
onMounted(() => {
  window.addEventListener("resize", checkMobile);
  checkMobile();
  loadInitialData();
});

// Remove event listener on unmount
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Load initial data function
const loadInitialData = async () => {
  await Promise.all([fetchProvinces(), fetchCategories()]);
  await applyRouteFilters();
  fetchAdventureData();
};
</script>

<style scoped>
.filter-section {
  margin-bottom: 30px;
  position: relative;
  background: none;
}
@media (prefers-color-scheme: dark) {
  .place-list[data-v-5a8834cc] {
    background: none;
    border-color: rgba(71, 85, 105, 0.5);
  }
}
.filter-section h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(26, 126, 140, 0.1);
}

.filter-section h3 i {
  color: black;
  font-size: 18px;
  background: linear-gradient(
    135deg,
    rgba(26, 126, 140, 0.1) 0%,
    rgba(26, 126, 140, 0.05) 100%
  );
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Enhanced Province List */
.place-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 280px;
  overflow-y: auto;
  border: 2px solid rgba(226, 232, 240, 0.5);
  border-radius: 12px;
  /* background: rgba(255, 255, 255, 0.5); */
  background: none;
  backdrop-filter: blur(10px);
}

.place-list::-webkit-scrollbar {
  width: 6px;
}

.place-list::-webkit-scrollbar-track {
  background: rgba(248, 250, 252, 0.5);
  border-radius: 3px;
}

.place-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--primary-color) 0%, #1a8c9e 100%);
  border-radius: 3px;
}

.place-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #156b77 0%, #147a8b 100%);
}

.place-list li {
  padding: 14px 18px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.place-list li:last-child {
  border-bottom: none;
}
@media (prefers-color-scheme: dark) {
  .place-list li[data-v-5a8834cc] {
    color: #898989;
    border-bottom-color: rgba(71, 85, 105, 0.3);
  }
}
.place-list li::before {
  content: "";
  position: absolute;
  top: 0;
  color: #000;
  left: -100%;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(90deg, transparent, rgba(26, 126, 140, 0.08), transparent); */
  transition: left 0.4s ease;
}

.place-list li::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color));
  transition: width 0.3s ease;
}

.place-list li:hover {
  color: black;
  /* background: linear-gradient(135deg, rgba(26, 126, 140, 0.05) 0%, rgba(26, 126, 140, 0.02) 100%); */
  transform: translateX(8px);
  padding-left: 26px;
}

.place-list li:hover::before {
  left: 100%;
}

.place-list li:hover::after {
  width: 100%;
}

.place-list li.active {
  /* background: linear-gradient(135deg, var(--primary-color) 0%, #1A8C9E 100%); */
  color: white;
  font-weight: 600;
  /* box-shadow: 0 4px 20px rgba(26, 126, 140, 0.25); */
  transform: translateX(4px);
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.place-list li.active::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.place-list li.active::after {
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
}

/* Province counter badge */
.place-list li .province-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.place-list li:hover .province-count {
  background: rgba(26, 126, 140, 0.2);
  color: black;
}

.place-list li.active .province-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

/* Enhanced search input specifically for province filter */
.province-search {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid rgba(226, 232, 240, 0.6);
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  position: relative;
  backdrop-filter: blur(10px);
}

.province-search:focus {
  outline: none;
  border-color: black;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4px rgba(26, 126, 140, 0.1), 0 4px 20px rgba(26, 126, 140, 0.15);
  transform: translateY(-1px);
}

.province-search::placeholder {
  color: white;
  font-style: italic;
}

/* Search icon for province search */
.province-search-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.province-search-wrapper::before {
  content: "\f002";
  font-weight: 900;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 14px;
  z-index: 1;
  transition: color 0.3s ease;
}

.province-search-wrapper:focus-within::before {
  color: black;
}

/* Province dropdown animation */
.province-dropdown {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.province-dropdown.show {
  opacity: 1;
  max-height: 320px;
}

/* Loading state for provinces */
.province-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  font-size: 14px;
  gap: 8px;
}

.province-loading::before {
  content: "";
  width: 16px;
  height: 16px;
  border: 2px solid rgba(26, 126, 140, 0.2);
  border-top-color: black;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Province empty state */
.province-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  color: white;
  text-align: center;
}

.province-empty i {
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.province-empty p {
  margin: 0;
  font-size: 14px;
  font-style: italic;
}

/* Province selection indicator */
.province-selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--accent-color) 0%, #ffb84d 100%);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 145, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 145, 0, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(255, 145, 0, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 145, 0, 0.3);
  }
}

/* Quick select buttons for popular provinces */
.popular-provinces {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.popular-province-btn {
  padding: 6px 12px;
  background: rgba(26, 126, 140, 0.1);
  color: black;
  border: 1px solid rgba(26, 126, 140, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.popular-province-btn:hover {
  background: rgba(26, 126, 140, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(26, 126, 140, 0.2);
}

.popular-province-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: black;
}

/* Responsive adjustments for province select */
@media (max-width: 768px) {
  .filter-section h3 {
    font-size: 15px;
  }

  .filter-section h3 i {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .place-list {
    max-height: 240px;
  }

  .place-list li {
    padding: 12px 16px;
    font-size: 13px;
  }

  .place-list li:hover {
    transform: translateX(4px);
    padding-left: 20px;
  }

  .province-search {
    padding: 10px 14px 10px 40px;
    font-size: 13px;
  }

  .province-search-wrapper::before {
    left: 14px;
    font-size: 13px;
  }

  .popular-provinces {
    gap: 6px;
  }

  .popular-province-btn {
    padding: 4px 10px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .place-list {
    max-height: 200px;
  }

  .place-list li {
    padding: 10px 14px;
    font-size: 12px;
  }

  .place-list li:hover {
    transform: translateX(2px);
    padding-left: 16px;
  }

  .province-search {
    padding: 8px 12px 8px 36px;
    font-size: 12px;
  }

  .province-search-wrapper::before {
    left: 12px;
    font-size: 12px;
  }

  .popular-province-btn {
    padding: 3px 8px;
    font-size: 10px;
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  .place-list {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(71, 85, 105, 0.5);
  }

  .place-list li {
    color: #cbd5e1;
    border-bottom-color: rgba(71, 85, 105, 0.3);
  }

  .place-list li:hover {
    background: linear-gradient(
      135deg,
      rgba(26, 126, 140, 0.1) 0%,
      rgba(26, 126, 140, 0.05) 100%
    );
  }

  .province-search {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(71, 85, 105, 0.6);
    color: #cbd5e1;
  }

  .province-search::placeholder {
    color: #64748b;
  }
}
@media (max-width: 480px) {
  .hero-header-adv {
    width: 370px;
    padding: 20px;
    margin-bottom: 30px;
  }
  .card_adv {
    margin: 0 auto;
    max-width: 390px;
  }
}
</style>
