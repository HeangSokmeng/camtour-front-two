<template>
  <div class="hiking-page-container">
    <section class="hero-header">
      <div class="hero-background">
        <img 
          src="../../assets/siemreaps/banner.png" 
          alt="Beautiful Angkor Wat temple complex in Siem Reap" 
          class="hero-bg-image"
        />
        <div class="hero-overlay"></div>
      </div>     
      <div class="hero-content">
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ siemReapInfo.totalDestinations }}</span>
            <span class="stat-label">{{ t('ancient-sites') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ siemReapInfo.totalTemples }}</span>
            <span class="stat-label">{{ t('temples') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ siemReapInfo.yearFounded }}</span>
            <span class="stat-label">{{ t('years-of-history') }}</span>
          </div>
        </div>
        <h1>{{ getLocalizedText('title') }}</h1>
        <p>{{ getLocalizedText('description') }}</p>
        <div class="underline"></div>
        <div class="quick-facts">
          <div class="fact-item">
            <strong>{{ t('best-time-to-visit') }}:</strong> {{ t('november-to-march') }}
          </div>
          <div class="fact-item">
            <strong>{{ t('main-language') }}:</strong> {{ t('khmer-cambodian-english') }}
          </div>
          <div class="fact-item">
            <strong>{{ t('currency') }}:</strong> {{ t('cambodian-riel-us-dollar') }}
          </div>
        </div>
      </div>
      <div class="scroll-indicator" @click="scrollToContent">
      </div>
    </section>
    <div class="main-container" id="content">
      <aside class="filters-sidebar">
        <div class="filter-section siem-reap-info">
          <h3>🏛️ {{ t('about-siem-reap') }}</h3>
          <div class="info-content">
            <p><strong>{{ t('population') }}:</strong> {{ siemReapInfo.population }}</p>
            <p><strong>{{ t('area') }}:</strong> {{ siemReapInfo.area }}</p>
            <p><strong>{{ t('province') }}:</strong> {{ getLocalizedText('province') }}</p>
            <p><strong>{{ t('famous-for') }}:</strong> {{ t('angkor-wat-complex') }}</p>
            <div class="climate-info">
              <h4>{{ t('climate') }}</h4>
              <p>{{ t('tropical-monsoon-climate') }}</p>
            </div>
          </div>
        </div>
        <div class="filter-section">
          <h3>🗺️ {{ t('filter-by-location') }}</h3>
          <div class="filter-group">
            <label>{{ t('district') }}</label>
            <select v-model="selectedDistrict" @change="onDistrictChange" class="filter-select">
              <option value="">{{ t('all-districts') }}</option>
              <option v-for="district in districts" :key="district.id" :value="district.id">
                {{ getLocalizedLocationName(district) }}
              </option>
            </select>
          </div>
          <div class="filter-group" v-if="selectedDistrict">
            <label>{{ t('commune') }}</label>
            <select v-model="selectedCommune" @change="onCommuneChange" class="filter-select">
              <option value="">{{ t('all-communes') }}</option>
              <option v-for="commune in communes" :key="commune.id" :value="commune.id">
                {{ getLocalizedLocationName(commune) }}
              </option>
            </select>
          </div>
          <div class="filter-group" v-if="selectedCommune">
            <label>{{ t('village') }}</label>
            <select v-model="selectedVillage" @change="fetchLocations" class="filter-select">
              <option value="">{{ t('all-villages') }}</option>
              <option v-for="village in villages" :key="village.id" :value="village.id">
                {{ getLocalizedLocationName(village) }}
              </option>
            </select>
          </div>
        </div>
        <div class="filter-section">
          <h4>⭐ {{ t('rating-filter') }}</h4>
          <div class="star-rating-filters">
            <button 
              v-for="star in [5,4,3,2,1]" 
              :key="star"
              @click="selectRating(star)"
              :class="['star-btn', { 'active': selectedRating === star.toString() }]"
            >
              <span class="stars-display">
                <span v-for="i in star" :key="i" class="star">★</span>
                <span v-for="i in (5-star)" :key="'empty-'+i" class="star empty">☆</span>
              </span>
              <span class="rating-label">{{ star }}{{ t('stars-plus') }}</span>
            </button>
            <button 
              @click="selectRating('')"
              :class="['star-btn', 'all-rating', { 'active': selectedRating === '' }]"
            >
              <span class="rating-label">{{ t('all-ratings') }}</span>
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h4>👁️ {{ t('popularity') }}</h4>
          <div class="popularity-filter">
            <label>{{ t('minimum-views') }}</label>
            <input 
              type="number" 
              v-model="minViews" 
              @change="fetchLocations"
              placeholder="0"
              min="0"
              class="views-input"
            >
          </div>
        </div>
      </aside>
      <main class="content-area">
        <section v-if="topViewLocations.length > 0" class="top-destinations">
          <h2>🔥 {{ t('most-popular-destinations') }}</h2>
          <div class="top-locations-grid">
            <div 
              v-for="location in topViewLocations.slice(0, 3)" 
              :key="'top-' + location.id"
              class="top-location-card"
              @click="goToLocationDetail(location.id)"
            >
              <div class="top-card-image">
                <img :src="location.is_thumbnail" :alt="getLocalizedLocationName(location)" />
                <div class="view-badge">{{ location.total_view }} {{ t('views') }}</div>
              </div>
              <div class="top-card-content">
                <h3>{{ getLocalizedLocationName(location) }}</h3>
                <p class="location-address">
                  <i class="location-icon">📍</i>
                  {{ formatAddress(location) }}
                </p>
                <div class="rating-info">
                  <span class="stars">⭐ {{ location.rate_star || t('new') }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="cultural-heritage">
          <h2>🏛️ {{ t('cultural-heritage-siem-reap') }}</h2>
          <div class="heritage-grid">
            <div 
              v-for="heritage in getLocalizedHeritage()" 
              :key="heritage.name"
              class="heritage-card"
            >
              <div class="heritage-image">
                <img :src="heritage.image" :alt="heritage.name" />
              </div>
              <div class="heritage-content">
                <h3>{{ heritage.name }}</h3>
                <p>{{ heritage.description }}</p>
                <div class="heritage-details">
                  <span class="heritage-period">{{ heritage.period }}</span>
                  <span class="heritage-type">{{ heritage.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ t('loading-amazing-destinations') }}</p>
        </div>
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button @click="fetchLocations" class="retry-btn">{{ t('try-again') }}</button>
        </div>
        <section class="local-cuisine">
          <h2>🍜 {{ t('siem-reap-local-cuisine') }}</h2>
          <div class="cuisine-grid">
            <div 
              v-for="dish in getLocalizedCuisine()" 
              :key="dish.name"
              class="cuisine-card"
            >
              <div class="cuisine-image">
                <img :src="dish.image" :alt="dish.name" />
              </div>
              <div class="cuisine-content">
                <h4>{{ dish.name }}</h4>
                <p>{{ dish.description }}</p>
                <div class="cuisine-details">
                  <span class="cuisine-type">{{ dish.type }}</span>
                  <span class="cuisine-price">{{ dish.priceRange }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="all-destinations">
          <div class="section-header">
            <h2>{{ t('all-tourist-destinations') }}</h2>
            <p class="results-count">{{ pagination.total }} {{ t('amazing-places-found') }}</p>
          </div>
          <div class="locations-grid">
            <div 
              v-for="location in locations" 
              :key="location.id"
              class="location-card"
              @click="goToLocationDetail(location.id)"
            >
              <div class="card-image">
                <img :src="location.is_thumbnail" :alt="getLocalizedLocationName(location)" />
                <div class="category-badge">{{ getLocalizedLocationName(location.category) }}</div>
              </div>
              <div class="card-content">
                <h3>{{ getLocalizedLocationName(location) }}</h3>
                <p class="description">{{ location.short_description }}</p>
                <div class="location-details">
                  <p class="address">
                    <i class="location-icon">📍</i>
                    {{ formatAddress(location) }}
                  </p>
                  <div class="card-footer">
                    <span class="rating">
                      <i class="star-icon">⭐</i>
                      {{ location.rate_star || t('new') }}
                    </span>
                    <span class="views">{{ location.total_view }} {{ t('views') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="pagination.total_page > 1" class="pagination">
            <button 
              @click="changePage(pagination.page_no - 1)"
              :disabled="pagination.page_no === 1"
              class="page-btn"
            >
              ← {{ t('previous') }}
            </button>
            
            <span class="page-info">
              {{ t('page') }} {{ pagination.page_no }} {{ t('of') }} {{ pagination.total_page }}
            </span>
            
            <button 
              @click="changePage(pagination.page_no + 1)"
              :disabled="pagination.page_no === pagination.total_page"
              class="page-btn"
            >
              {{ t('next') }} →
            </button>
          </div>
        </section>
        <section class="travel-tips">
          <h2>✈️ {{ t('travel-tips-siem-reap') }}</h2>
          <div class="tips-grid">
            <div 
              v-for="tip in getLocalizedTravelTips()" 
              :key="tip.category"
              class="tip-card"
            >
              <div class="tip-icon">{{ tip.icon }}</div>
              <h4>{{ tip.category }}</h4>
              <ul>
                <li v-for="item in tip.tips" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </section>
        <section v-if="relatedProducts.length > 0" class="related-products">
          <h2>🎒 {{ t('recommended-gear-cambodia') }}</h2>
          <div class="products-grid">
            <div 
              v-for="product in relatedProducts" 
              :key="product.product_id"
              class="product-card"
              @click="goToProductDetail(product.product_id)"
            >
              <img :src="product.is_thumbnail" :alt="product.product_name" />
              <div class="product-info">
                <h4>{{ product.product_name }}</h4>
                <p class="product-details">{{ product.color }} • {{ product.size }}</p>
                <div class="product-footer">
                  <span class="price">${{ product.price }}</span>
                  <span class="qty">{{ product.qty }} {{ t('left') }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import angkorWatImg from '@/assets/siemreaps/angkorWat.png'
import banteaySreiImg from '@/assets/siemreaps/banteay-srei.png'
import bayonImg from '@/assets/siemreaps/bayon.png'
import amokFoodImg from '@/assets/siemreaps/foods/fish-amok.png'
import lokLakFoodImg from '@/assets/siemreaps/foods/lok-lak.png'
import monBanhChokFoodImg from '@/assets/siemreaps/foods/nom-banh-chok.png'
import prahokKtissFoodImg from '@/assets/siemreaps/foods/prahok-ktiss.png'
import taProhmImg from '@/assets/siemreaps/taProhm.png'
import { useTranslation } from '@/components/useTranslation'
import { useGlobalStore } from '@/stores/global'
import axios from 'axios'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// Translation setup
const { currentLanguage, t } = useTranslation()

const router = useRouter()
const globalStore = useGlobalStore()
const getLocalizedCuisine = () => {
  const cuisine = [
    {
      name: t('fish-amok'),
      description: t('fish-amok-description'),
      type: t('main-course'),
      priceRange: t('price-range-3-8'),
      image: amokFoodImg
    },
    {
      name: t('lok-lak'),
      description: t('lok-lak-description'),
      type: t('main-course'), 
      priceRange: t('price-range-4-10'),
      image: lokLakFoodImg
    },
    {
      name: t('nom-banh-chok'),
      description: t('nom-banh-chok-description'),
      type: t('breakfast-light-meal'),
      priceRange: t('price-range-1-3'),
      image: monBanhChokFoodImg
    },
    {
      name: t('prahok-ktiss'),
      description: t('prahok-ktiss-description'),
      type: t('appetizer'),
      priceRange: t('price-range-2-5'),
      image: prahokKtissFoodImg
    }
  ]
  return cuisine
}
const getLocalizedHeritage = () => {
  const heritage = [
    {
      name: t('angkor-wat'),
      description: t('angkor-wat-description'),
      period: t('12th-century'),
      type: t('hindu-temple-complex'),
      image: angkorWatImg
    },
    {
      name: t('bayon-temple'),
      description: t('bayon-description'),
      period: t('late-12th-century'),
      type: t('buddhist-temple'),
      image: bayonImg
    },
    {
      name: t('ta-prohm'),
      description: t('ta-prohm-description'),
      period: t('late-12th-century'),
      type: t('buddhist-monastery'),
      image: taProhmImg
    },
    {
      name: t('banteay-srei'),
      description: t('banteay-srei-description'),
      period: t('10th-century'),
      type: t('hindu-temple'),
      image: banteaySreiImg
    }
  ]
  return heritage
}
// Fixed Siem Reap Information Data
const siemReapInfo = ref({
  description: "Discover the magical gateway to Cambodia's ancient Khmer Empire, where majestic temples meet vibrant local culture in the heart of Southeast Asia.",
  population: "245,494",
  area: "10,299 km²",
  province: "Siem Reap Province",
  language: "Khmer (Cambodian), English widely spoken",
  currency: "Cambodian Riel (KHR) & US Dollar (USD)",
  bestTimeToVisit: "November to March (Cool & Dry Season)",
  famousFor: "Angkor Wat Temple Complex & Ancient Khmer Architecture",
  climate: "Tropical monsoon climate with wet season (May-October) and dry season (November-April). Average temperature 25-35°C.",
  totalDestinations: "72",
  totalTemples: "1000+",
  yearFounded: "1200+",
  
  // Localized versions
  description_km: "ស្វែងរកទ្វារចូលវេទមន្ត្រទៅកាន់ចក្រភពខ្មែរបុរាណរបស់កម្ពុជា ដែលប្រាសាទអស្ចារ្យជួបប្រទះនឹងវប្បធម៌មូលដ្ឋានរស់រវើកនៅចំកណ្តាលអាស៊ីអាគ្នេយ៍។",
  province_km: "ខេត្តសៀមរាប",
  title_en: "Siem Reap",
  title_km: "សៀមរាប"
})

// Reactive data
const isLoading = ref(true)
const error = ref(null)
const locations = ref([])
const topViewLocations = ref([])
const relatedProducts = ref([])
const pagination = ref({
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 1,
  total_page: 1,
  page_no: 1
})

// Filter data
const districts = ref([])
const communes = ref([])
const villages = ref([])

// Filter selections
const selectedDistrict = ref('')
const selectedCommune = ref('')
const selectedVillage = ref('')
const selectedRating = ref('')
const minViews = ref('')
const currentPage = ref(1)
const searchQuery = ref('')

// Translation helper functions
const getLocalizedText = (key) => {
  const currentLang = currentLanguage.value
  if (currentLang === 'km' && siemReapInfo.value[`${key}_km`]) {
    return siemReapInfo.value[`${key}_km`]
  }
  return siemReapInfo.value[key] || siemReapInfo.value[`${key}_en`] || ''
}

const getLocalizedLocationName = (location) => {
  if (!location) return ''
  
  const currentLang = currentLanguage.value
  if (currentLang === 'km' && location.local_name) {
    return location.local_name
  } else if (currentLang === 'km' && location.name_local) {
    return location.name_local
  }
  return location.name || ''
}


const getLocalizedTravelTips = () => {
  const tips = [
    {
      category: t('getting-around'),
      icon: "🛵",
      tips: t('getting-around-tips')
    },
    {
      category: t('temple-visits'),  
      icon: "🏛️",
      tips: t('temple-visits-tips')
    },
    {
      category: t('local-etiquette'),
      icon: "🙏",
      tips: t('local-etiquette-tips')
    },
    {
      category: t('money-shopping'),
      icon: "💰", 
      tips: t('money-shopping-tips')
    }
  ]
  return tips
}

const handleLanguageChange = () => {
  document.title = `${t('camtour-brand')} - ${t('siem-reap-page-title')}`
}

const scrollToContent = () => {
  const contentElement = document.getElementById('content');
  if (contentElement) {
    contentElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
};

onMounted(async () => {
  window.addEventListener('language-changed', handleLanguageChange)
  await fetchDistricts()
  await fetchLocations()
  document.title = `${t('camtour-brand')} - ${t('siem-reap-page-title')}`
})

watch(currentLanguage, () => {
  document.title = `${t('camtour-brand')} - ${t('siem-reap-page-title')}`
  if (error.value) {
    error.value = t('error-loading-products')
  }
})

const fetchDistricts = async () => {
  try {
    const response = await axios.get('/api/web/view/location/districts/8', {
      ...globalStore.getAxiosHeader(),
    })
    if (!response.data.error && response.data.result) {
      districts.value = response.data.data || []
    } else {
      console.error('Failed to load districts:', response.data.message)
    }
  } catch (err) {
    console.error('Error fetching districts:', err)
    await globalStore.onCheckError(err)
  }
}

const onDistrictChange = async () => {
  selectedCommune.value = ''
  selectedVillage.value = ''
  communes.value = []
  villages.value = []
  if (selectedDistrict.value) {
    try {
      const response = await axios.get(`/api/web/view/location/communes/${selectedDistrict.value}`, {
        ...globalStore.getAxiosHeader(),
      }) 
      if (!response.data.error && response.data.result) {
        communes.value = response.data.data || []
      } else {
        console.error('Failed to load communes:', response.data.message)
      }
    } catch (err) {
      console.error('Error fetching communes:', err)
      await globalStore.onCheckError(err)
    }
  }
  await fetchLocations()
}

const onCommuneChange = async () => {
  selectedVillage.value = ''
  villages.value = []
  if (selectedCommune.value) {
    try {
      const response = await axios.get(`/api/web/view/location/villages/${selectedCommune.value}`, {
        ...globalStore.getAxiosHeader(),
      }) 
      if (!response.data.error && response.data.result) {
        villages.value = response.data.data || []
      } else {
        console.error('Failed to load villages:', response.data.message)
      }
    } catch (err) {
      console.error('Error fetching villages:', err)
      await globalStore.onCheckError(err)
    }
  }
  await fetchLocations()
}

const fetchLocations = async () => {
  isLoading.value = true
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      per_page: 8
    }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    if (selectedDistrict.value) params.district_id = selectedDistrict.value
    if (selectedCommune.value) params.commune_id = selectedCommune.value
    if (selectedVillage.value) params.village_id = selectedVillage.value
    if (selectedRating.value) params.star = selectedRating.value
    if (minViews.value) params.min_total_view = minViews.value
    const response = await axios.get('/api/web/view/siemreap', {
      params,
      ...globalStore.getAxiosHeader(),
    })
    if (!response.data.error && response.data.result) {
      const data = response.data.data
      locations.value = data.locations || []
      topViewLocations.value = data.top_view_location || []
      relatedProducts.value = data.product_relates || []
      pagination.value = {
        total: data.pagination?.total || 0,
        per_page: data.pagination?.per_page || 8,
        current_page: data.pagination?.current_page || 1,
        last_page: data.pagination?.last_page || 1,
        total_page: data.pagination?.last_page || 1,
        page_no: data.pagination?.current_page || 1
      }
    } else {
      error.value = response.data.message || 'Failed to load locations'
      locations.value = []
      topViewLocations.value = []
      relatedProducts.value = []
    }
  } catch (err) {
    console.error('Error fetching locations:', err)
    error.value = 'An error occurred while loading locations. Please try again.'
    locations.value = []
    topViewLocations.value = []
    relatedProducts.value = []
    await globalStore.onCheckError(err)
  } finally {
    isLoading.value = false
  }
}

const selectRating = (rating) => {
  selectedRating.value = rating.toString()
  fetchLocations()
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.total_page) {
    currentPage.value = page
    fetchLocations().then(() => {
      setTimeout(() => {
        scrollToContent();
      }, 100);
    });
  }
}

const goToLocationDetail = (id) => {
  router.push(`/location/detail/${id}`)
}

const goToProductDetail = (id) => {
  router.push(`/product/detail/${id}`)
}

const formatAddress = (location) => {
  const parts = []
  if (location.village) {
    parts.push(getLocalizedLocationName(location.village))
  }
  if (location.commune) {
    parts.push(getLocalizedLocationName(location.commune))
  }
  if (location.district) {
    parts.push(getLocalizedLocationName(location.district))
  }
  if (location.province) {
    parts.push(getLocalizedLocationName(location.province))
  }
  return parts.join(', ')
}

onUnmounted(() => {
  window.removeEventListener('language-changed', handleLanguageChange)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hiking-page-container {
  min-height: 100vh;
  color: #1e293b;
}

.hero-header {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background: #000;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 20s ease-in-out;
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(26, 126, 140, 0.8) 0%,
    rgba(13, 148, 136, 0.6) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 900px;
  padding: 0 40px;
  color: white;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.adventure-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 30px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-header h1 {
  font-size: 4.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1s ease-out 0.4s both;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-header p {
  font-size: 1.3rem;
  opacity: 0.95;
  margin-bottom: 30px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out 0.6s both;
}

.underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 100%);
  margin: 0 auto 40px;
  border-radius: 2px;
  animation: fadeInUp 1s ease-out 0.8s both;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 40px 0 50px;
  animation: fadeInUp 1s ease-out 1s both;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 1rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Quick Facts */
.quick-facts {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  animation: fadeInUp 1s ease-out 1.2s both;
}

.fact-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 15px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  color: white;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  cursor: pointer;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  margin-left: 50px;
  margin-bottom: 20px;
  border-right: 3px solid rgba(255, 255, 255, 0.8);
  border-bottom: 3px solid rgba(255, 255, 255, 0.8);
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Main Container */
.main-container {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.filters-sidebar {
  width: 300px;
  flex-shrink: 0;
}

.filter-section {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(26, 126, 140, 0.08);
  border: 1px solid rgba(26, 126, 140, 0.1);
  transition: all 0.3s ease;
}

.filter-section:hover {
  box-shadow: 0 15px 40px rgba(26, 126, 140, 0.12);
  transform: translateY(-2px);
}

.filter-section h3,
.filter-section h4 {
  color: #1A7E8C;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Siem Reap Info Section */
.siem-reap-info .info-content p {
  margin-bottom: 10px;
  color: #374151;
  font-size: 0.9rem;
}

.siem-reap-info .info-content strong {
  color: #1A7E8C;
  font-weight: 600;
}

.climate-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.climate-info h4 {
  color: #1A7E8C;
  font-size: 1rem;
  margin-bottom: 10px;
}

.climate-info p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #6b7280;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.filter-select,
.views-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-select:focus,
.views-input:focus {
  outline: none;
  border-color: #1A7E8C;
  box-shadow: 0 0 0 3px rgba(26, 126, 140, 0.1);
  transform: translateY(-1px);
}

.star-rating-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.star-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.star-btn:hover {
  border-color: #1A7E8C;
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 126, 140, 0.1);
}

.star-btn.active {
  border-color: #1A7E8C;
  background: #1A7E8C;
  color: white;
  box-shadow: 0 5px 20px rgba(26, 126, 140, 0.3);
}

.star-btn.all-rating {
  background: #f8fafc;
  border-color: #d1d5db;
}

.star-btn.all-rating.active {
  background: #6b7280;
  border-color: #6b7280;
}

.stars-display {
  display: flex;
  gap: 2px;
  min-width: 90px;
}

.star {
  color: #fbbf24;
  font-size: 16px;
}

.star.empty {
  color: #d1d5db;
}

.star-btn.active .star,
.star-btn.active .star.empty {
  color: white;
}

.rating-label {
  font-weight: 500;
  font-size: 14px;
}

.content-area {
  flex: 1;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(26, 126, 140, 0.1);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #1A7E8C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: linear-gradient(135deg, #1A7E8C, #0d9488);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, #0d9488, #1A7E8C);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 126, 140, 0.4);
}

/* Cultural Heritage Section */
.cultural-heritage {
  margin-bottom: 50px;
}

.cultural-heritage h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.heritage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.heritage-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.15);
  transition: all 0.4s ease;
  border: 1px solid rgba(26, 126, 140, 0.05);
}

.heritage-card:hover {
  /* transform: translateY(-8px); */
  box-shadow: 0 20px 40px rgba(26, 126, 140, 0.25);
}

.heritage-image {
  height: 200px;
  overflow: hidden;
}

.heritage-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.heritage-card:hover .heritage-image img {
  transform: scale(1.1);
}

.heritage-content {
  padding: 25px;
}

.heritage-content h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}

.heritage-content p {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.heritage-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.heritage-period {
  background: linear-gradient(135deg, #1A7E8C, #0d9488);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.heritage-type {
  color: #9ca3af;
  font-size: 0.8rem;
  font-style: italic;
}

/* Local Cuisine Section */
.local-cuisine {
  margin-bottom: 50px;
}

.local-cuisine h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.cuisine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.cuisine-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(26, 126, 140, 0.05);
}

.cuisine-card:hover {
  /* transform: translateY(-5px); */
  box-shadow: 0 15px 40px rgba(26, 126, 140, 0.2);
}

.cuisine-image {
  height: 150px;
  overflow: hidden;
}

.cuisine-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.cuisine-card:hover .cuisine-image img {
  transform: scale(1.05);
}

.cuisine-content {
  padding: 20px;
}

.cuisine-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1e293b;
}

.cuisine-content p {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.cuisine-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cuisine-type {
  background: #f0f9ff;
  color: #1A7E8C;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.cuisine-price {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Travel Tips Section */
.travel-tips {
  margin-bottom: 50px;
}

.travel-tips h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.tip-card {
  background: white;
  border-radius: 18px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.1);
  transition: all 0.4s ease;
  border: 1px solid rgba(26, 126, 140, 0.05);
}

.tip-card:hover {
  /* transform: translateY(-5px); */
  box-shadow: 0 15px 40px rgba(26, 126, 140, 0.2);
}

.tip-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.tip-card h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #1A7E8C;
}

.tip-card ul {
  list-style: none;
  padding: 0;
}

.tip-card li {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  line-height: 1.4;
}

.tip-card li:before {
  content: '•';
  color: #1A7E8C;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.top-destinations {
  margin-bottom: 50px;
}

.top-destinations h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.top-locations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.top-location-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.15);
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid rgba(26, 126, 140, 0.05);
}

.top-location-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(26, 126, 140, 0.25);
}

.top-card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.top-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.top-location-card:hover .top-card-image img {
  transform: scale(1.1);
}

.view-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, rgba(26, 126, 140, 0.9), rgba(13, 148, 136, 0.9));
  color: white;
  padding: 8px 15px;
  border-radius: 25px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.top-card-content {
  padding: 25px;
}

.top-card-content h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}

.location-address {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.results-count {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.location-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.1);
  cursor: pointer;
  transition: all 0.4s ease;
  border: 1px solid rgba(26, 126, 140, 0.05);
  position: relative;
}

.location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(26, 126, 140, 0.2);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.location-card:hover .card-image img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #1A7E8C, #0d9488);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1e293b;
}

.description {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
}

.location-details .address {
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  color: #1A7E8C;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.views {
  color: #9ca3af;
  font-size: 0.8rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 40px 0;
}

.page-btn {
  background: linear-gradient(135deg, #1A7E8C, #0d9488);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.page-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0d9488, #1A7E8C);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 126, 140, 0.4);
}

.page-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.page-info {
  color: #6b7280;
  font-weight: 500;
  padding: 0 20px;
}

.related-products {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 2px solid rgba(26, 126, 140, 0.1);
}

.related-products h2 {
  color: #1A7E8C;
  font-size: 2.2rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(26, 126, 140, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(26, 126, 140, 0.1);
  cursor: pointer;
  transition: all 0.4s ease;
  border: 1px solid rgba(26, 126, 140, 0.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(26, 126, 140, 0.2);
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1e293b;
}

.product-details {
  color: #6b7280;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #1A7E8C;
  font-weight: 700;
  font-size: 1.2rem;
}

.qty {
  color: #9ca3af;
  font-size: 0.8rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .locations-grid,
  .top-locations-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .heritage-grid,
  .cuisine-grid,
  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hero-header h1 {
    font-size: 3.5rem;
  }
  
  .hero-stats {
    gap: 40px;
  }
}

@media (max-width: 968px) {
  .main-container {
    flex-direction: column;
    padding: 40px 20px;
  }
  
  .filters-sidebar {
    width: 100%;
  }
  
  .hero-header h1 {
    font-size: 3rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .quick-facts {
    flex-direction: column;
    gap: 15px;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .heritage-grid,
  .cuisine-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-header {
    height: 80vh;
    padding: 0 20px;
  }
  
  .hero-header h1 {
    font-size: 2.5rem;
  }
  
  .hero-header p {
    font-size: 1.1rem;
  }
  
  .locations-grid,
  .top-locations-grid {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    padding: 30px 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .hero-content {
    padding: 0 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .hero-header h1 {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .hero-header p {
    font-size: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .adventure-tag {
    font-size: 14px;
    padding: 10px 20px;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .fact-item {
    padding: 12px 16px;
    font-size: 0.8rem;
  }
}

/* Additional Animations */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.filter-section {
  animation: slideInFromLeft 0.6s ease-out;
}

.content-area > section {
  animation: slideInFromRight 0.6s ease-out;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1A7E8C, #0d9488);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0d9488, #1A7E8C);
}

/* Enhanced hover effects */
.heritage-card:hover h3,
.cuisine-card:hover h4,
.tip-card:hover h4 {
  color: #1A7E8C;
  transition: color 0.3s ease;
}

.location-icon,
.star-icon {
  margin-right: 5px;
}

/* Focus states for accessibility */
.filter-select:focus,
.views-input:focus,
.star-btn:focus,
.page-btn:focus,
.retry-btn:focus {
  outline: 2px solid #1A7E8C;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .hero-header,
  .filters-sidebar,
  .pagination,
  .scroll-indicator {
    display: none;
  }
  
  .main-container {
    flex-direction: column;
    padding: 20px;
    background: white;
  }
  
  .content-area {
    width: 100%;
  }
  
  .locations-grid,
  .heritage-grid,
  .cuisine-grid,
  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
</style>