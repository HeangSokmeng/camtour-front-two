<template>
  <div>
    <header
      class="fixed-header"
      :class="{ scrolled: isScrolled, hidden: isHeaderHidden }"
    >
      <div class="nav-container">
        <select
          v-model="currentLanguage"
          class="language-selector"
          @change="changeLanguage"
        >
          <option value="en">EN</option>
          <option value="km">KH</option>
        </select>
        <button class="menu-toggle" @click.stop="toggleMenu">
          <span v-if="!menuOpen" class="menu-icon">☰</span>
          <span v-else class="close-icon">&times;</span>
        </button>
        <nav :class="{ open: menuOpen }">
          <ul class="nav-menu">
            <li class="mobile-close-item">
              <button class="mobile-close-btn" @click="closeMenuOnNavigation">
                <span class="close-icon">&times;</span>
              </button>
            </li>
            <li>
              <RouterLink to="/" class="nav-link" @click="closeMenuOnNavigation">
                {{ t("home") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/siem-reap" class="nav-link" @click="closeMenuOnNavigation">
                {{ t("siem-reap") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/adventure" class="nav-link" @click="closeMenuOnNavigation">
                {{ t("adventure") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/product" class="nav-link" @click="closeMenuOnNavigation">
                {{ t("shopping") }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about-us" class="nav-link" @click="closeMenuOnNavigation">
                {{ t("about-us") }}
              </RouterLink>
            </li>
          </ul>
          
          <!-- Auth buttons inside navigation for mobile -->
          <div class="auth-buttons mobile-nav" v-if="!isAuthenticated">
            <RouterLink to="/register" class="auth-btn" @click="closeMenuOnNavigation">
              {{ t("signup") }}
            </RouterLink>
            <RouterLink to="/login" class="auth-btn" @click="closeMenuOnNavigation">
              {{ t("login") }}
            </RouterLink>
          </div>
        </nav>
      </div>
      
      <!-- Auth buttons for desktop -->
      <div class="auth-buttons desktop-auth" v-if="!isAuthenticated">
        <RouterLink to="/register" class="auth-btn" @click="closeMenuOnNavigation">
          {{ t("signup") }}
        </RouterLink>
        <RouterLink to="/login" class="auth-btn" @click="closeMenuOnNavigation">
          {{ t("login") }}
        </RouterLink>
      </div>
      
      <div class="user-profile" :class="{ open: menuOpen }" v-else>
        <div class="wishlist-btn-container">
          <RouterLink
            to="/favorites"
            class="icon-btn wishlist-btn"
            @click="closeMenuOnNavigation"
          >
            <div class="icon-wrapper">
              <svg
                class="wishlist-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
              <span v-if="wishlistCount > 0" class="count-badge">{{
                wishlistCount
              }}</span>
            </div>
          </RouterLink>
        </div>
        <div class="cart-btn-container"><CartHeaderIcon /></div>
        <div class="profile-trigger" @click.stop="toggleProfileMenu">
          <div class="user-avatar">
            <img
              :src="userData.image"
              :alt="userFullName"
              @error="handleProfileImageError"
              class="avatar-image"
            />
          </div>
        </div>
        <div class="profile-dropdown" v-if="profileMenuOpen">
          <div class="dropdown-header">
            <div class="user-info">
              <div class="user-avatar dropdown-avatar">
                <img
                  v-if="profileImageLoaded"
                  :src="userData.image"
                  :alt="userFullName"
                  @error="handleProfileImageError"
                  class="avatar-image"
                />
                <div v-else class="avatar-text">{{ userInitials }}</div>
              </div>
              <div class="user-details">
                <div class="user-name">{{ userFullName }}</div>
                <div class="user-email">{{ userData.email }}</div>
              </div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <ul class="dropdown-menu">
            <li>
              <a @click.prevent="openProfileModal" class="dropdown-item">
                {{ t("my-profile") }}
              </a>
            </li>
            <li>
              <RouterLink
                to="/favorites"
                class="dropdown-item"
                @click="closeMenuOnNavigation"
              >
                {{ t("my-favorites") }}
                <span v-if="wishlistCount > 0" class="menu-count"
                  >({{ wishlistCount }})</span
                >
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/order"
                class="dropdown-item"
                @click="closeMenuOnNavigation"
              >
                My Orders
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/settings"
                class="dropdown-item"
                @click="closeMenuOnNavigation"
              >
                {{ t("settings") }}
              </RouterLink>
            </li>
            <div class="dropdown-divider"></div>
            <li>
              <button @click="handleLogout" class="dropdown-item logout-item">
                {{ t("logout") }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
    
    <!-- Rest of your modals... -->
    <div class="modal-overlay" v-if="showLogoutModal" @click="cancelLogout">
      <div class="modal-content sad-animation" @click.stop>
        <div class="modal-header">
          <h3>{{ t("confirm-logout") }}</h3>
          <button class="modal-close" @click="cancelLogout">×</button>
        </div>
        <div class="modal-body">
          <div class="sad-face">😢</div>
          <p>{{ t("logout-message") }}</p>
          <div class="tear tear-1"></div>
          <div class="tear tear-2"></div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="cancelLogout">
            {{ t("cancel") }}
          </button>
          <button
            class="modal-btn confirm-btn"
            @click="confirmLogout"
            :disabled="isLoggingOut"
          >
            <span v-if="isLoggingOut">{{ t("logging-out") }}</span>
            <span v-else>{{ t("logout") }}</span>
          </button>
        </div>
      </div>
    </div>
    <ProfileModal
      :show="showProfileModal"
      @close="showProfileModal = false"
      @updated="handleProfileUpdated"
    />
  </div>
</template>

// script
<script setup>
import "@/assets/css/appHeader.css";
import CartHeaderIcon from "@/components/CartHeaderIcon.vue";
import ProfileModal from "@/components/ProfileModal.vue";
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import {
  computed,
  defineExpose,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
// const cartStore = useCartStore();
const router = useRouter();
const globalStore = useGlobalStore();
const { currentLanguage, setLanguage, t } = useTranslation();
const showProfileModal = ref(false);
const menuOpen = ref(false);
const profileMenuOpen = ref(false);
const showLogoutModal = ref(false);
const isLoggingOut = ref(false);
const isAuthenticated = ref(false);
const isLoading = ref(true);
const profileImageLoaded = ref(true);
const currentImageIndex = ref(0);
const wishlistCount = ref(0);
const isScrolled = ref(false);
const isHeaderHidden = ref(false);
const lastScrollY = ref(0);
const scrollThreshold = 100;
const hideThreshold = 200;
let autoSlideInterval = null;
let scrollTimeout = null;
let fetchWishlistTimeout = null;
const heroImages = ref([
  {
    src:
      "https://c4.wallpaperflare.com/wallpaper/623/232/3/beautiful-village-wallpaper-preview.jpg",
    alt: "Angkor Wat Temple Complex",
    title: "Angkor Wat",
    description: "Ancient temple complex",
  },
  {
    src: "https://bangkokattractions.com/wp-content/uploads/2023/01/cambodia.jpg",
    alt: "Bayon Temple Faces",
    title: "Bayon Temple",
    description: "Temple of faces",
  },
  {
    src:
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/6/2025/01/28121636/phnom-penh-fi-1600x900.jpeg",
    alt: "Banteay Srei Temple",
    title: "Banteay Srei",
    description: "Pink sandstone temple",
  },
]);
const userData = ref({
  id: null,
  first_name: "",
  last_name: "",
  gender: null,
  image: "",
  phone: "",
  email: "",
  is_email_verified: false,
  role_id: null,
  created_at: "",
});
const userFullName = computed(() => {
  if (userData.value.first_name && userData.value.last_name) {
    return `${userData.value.first_name} ${userData.value.last_name}`;
  }
  return "User";
});
const userInitials = computed(() => {
  if (userData.value.first_name && userData.value.last_name) {
    return `${userData.value.first_name.charAt(0)}${userData.value.last_name.charAt(
      0
    )}`.toUpperCase();
  }
  return "U";
});
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isScrolled.value = currentScrollY > scrollThreshold;
  if (currentScrollY > hideThreshold) {
    if (currentScrollY > lastScrollY.value && !menuOpen.value && !profileMenuOpen.value) {
      isHeaderHidden.value = true;
    } else if (currentScrollY < lastScrollY.value) {
      isHeaderHidden.value = false;
    }
  } else {
    isHeaderHidden.value = false;
  }
  lastScrollY.value = currentScrollY;
};
const throttledHandleScroll = () => {
  if (scrollTimeout) return;
  scrollTimeout = setTimeout(() => {
    handleScroll();
    scrollTimeout = null;
  }, 10);
};
const fetchWishlistCount = async () => {
  if (!isAuthenticated.value) {
    wishlistCount.value = 0;
    return;
  }
  try {
    const headers = globalStore.getAxiosHeader();
    if (!headers) {
      wishlistCount.value = 0;
      return;
    }
    const response = await axios.get("/api/web/wishlist/count", headers);
    if (response.data?.result && typeof response.data.data?.count === "number") {
      wishlistCount.value = response.data.data.count;
    } else {
      wishlistCount.value = 0;
    }
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await globalStore.logout();
    }
    wishlistCount.value = 0;
  }
};

const handleWishlistUpdate = async (event) => {
  if (event?.detail?.count !== undefined && typeof event.detail.count === "number") {
    wishlistCount.value = event.detail.count;
  } else if (event?.detail?.action) {
    switch (event.detail.action) {
      case "add":
        wishlistCount.value += 1;
        break;
      case "remove":
        wishlistCount.value = Math.max(0, wishlistCount.value - 1);
        break;
      case "clear":
        wishlistCount.value = 0;
        break;
      default:
        await fetchWishlistCount();
    }
  } else {
    await fetchWishlistCount();
  }
};
const refreshWishlistCount = async () => {
  if (isAuthenticated.value) {
    await fetchWishlistCount();
  }
};
const openProfileModal = () => {
  showProfileModal.value = true;
  closeMenuOnNavigation();
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
const handleProfileUpdated = () => {};
const changeLanguage = () => {
  setLanguage(currentLanguage.value);
  notifyLanguageChange();
};
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value && profileMenuOpen.value) {
    profileMenuOpen.value = false;
  }
  if (menuOpen.value) {
    isHeaderHidden.value = false;
  }
};
const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
  if (profileMenuOpen.value) {
    isHeaderHidden.value = false;
  }
};
const closeMenuOnNavigation = () => {
  menuOpen.value = false;
  profileMenuOpen.value = false;
};
const notifyLanguageChange = () => {
  window.dispatchEvent(
    new CustomEvent("language-changed", { detail: { language: currentLanguage.value } })
  );
};
const handleDocumentClick = (e) => {
  const profileEl = document.querySelector(".user-profile");
  const menuToggleEl = document.querySelector(".menu-toggle");
  if (profileEl && !profileEl.contains(e.target) && profileMenuOpen.value) {
    profileMenuOpen.value = false;
  }
  if (
    menuToggleEl &&
    !menuToggleEl.contains(e.target) &&
    !e.target.closest("nav") &&
    menuOpen.value
  ) {
    menuOpen.value = false;
  }
};
const fetchUserData = async () => {
  isLoading.value = true;
  try {
    const headers = globalStore.getAxiosHeader();
    const response = await axios.get("/api/web/auth/me", headers);
    if (response.data.result) {
      userData.value = response.data.data;
      isAuthenticated.value = true;
      if (!globalStore.profile) {
        globalStore.$patch({ profile: response.data.data });
      }
      await fetchWishlistCount();
    } else {
      isAuthenticated.value = false;
      clearAuthData();
    }
  } catch (error) {
    isAuthenticated.value = false;
    await globalStore.onCheckError(error);
    clearAuthData();
  } finally {
    isLoading.value = false;
  }
};
const handleProfileImageError = () => {
  profileImageLoaded.value = false;
};
const handleLogout = () => {
  showLogoutModal.value = true;
};
const cancelLogout = () => {
  showLogoutModal.value = false;
};
const confirmLogout = async () => {
  isLoggingOut.value = true;
  try {
    window.dispatchEvent(new CustomEvent("user-logout"));
    await globalStore.logout();
    showLogoutModal.value = false;
    profileMenuOpen.value = false;
    menuOpen.value = false;
    isAuthenticated.value = false;
    wishlistCount.value = 0;
    userData.value = {
      id: null,
      first_name: "",
      last_name: "",
      gender: null,
      image: "",
      phone: "",
      email: "",
      is_email_verified: false,
      role_id: null,
      created_at: "",
    };
    router.push("/");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    isLoggingOut.value = false;
  }
};
const clearAuthData = () => {
  isAuthenticated.value = false;
  wishlistCount.value = 0;
  userData.value = {
    id: null,
    first_name: "",
    last_name: "",
    gender: null,
    image: "",
    phone: "",
    email: "",
    is_email_verified: false,
    role_id: null,
    created_at: "",
  };
  localStorage.removeItem("token");
  sessionStorage.removeItem("is_check_usr");
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};
const debugWishlistState = () => {
  // console.log("Wishlist Debug Info:", {
  //   isAuthenticated: isAuthenticated.value,
  //   wishlistCount: wishlistCount.value,
  //   userId: userData.value.id,
  //   hasToken: !!globalStore.token,
  //   profileId: globalStore.profile?.id,
  // });
};
watch(
  () => globalStore.getIsAuthenticated,
  async (newValue) => {
    isAuthenticated.value = newValue;
    if (newValue) {
      await fetchUserData();
      if (userData.value.id) {
        window.dispatchEvent(
          new CustomEvent("user-login", { detail: { userId: userData.value.id } })
        );
      }
    } else {
      userData.value = {
        id: null,
        first_name: "",
        last_name: "",
        gender: null,
        image: "",
        phone: "",
        email: "",
        is_email_verified: false,
        role_id: null,
        created_at: "",
      };
      wishlistCount.value = 0;
    }
  },
  { immediate: true }
);
watch(
  () => globalStore.token,
  (newToken) => {
    if (newToken) {
      fetchUserData();
    } else {
      isAuthenticated.value = false;
      profileImageLoaded.value = false;
      wishlistCount.value = 0;
    }
  }
);
watch(
  () => globalStore.profile,
  async (newProfile, oldProfile) => {
    if (newProfile) {
      userData.value = newProfile;
      profileImageLoaded.value = !!newProfile.image;
      if (!oldProfile || oldProfile.id !== newProfile.id) {
        await fetchWishlistCount();
      }
    }
  },
  { deep: true }
);
watch(currentLanguage, (newLang) => {
  document.documentElement.setAttribute("lang", newLang);
  if (newLang === "km") {
    document.body.classList.add("khmer-lang");
  } else {
    document.body.classList.remove("khmer-lang");
  }
});
onMounted(async () => {
  try {
    startAutoSlide();
    isAuthenticated.value = globalStore.getIsAuthenticated;
    if (isAuthenticated.value) {
      await fetchUserData();
    } else if (localStorage.getItem("token")) {
      await fetchUserData();
    }
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("wishlist-refresh", refreshWishlistCount);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    setLanguage(currentLanguage.value);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menuOpen.value = false;
        profileMenuOpen.value = false;
        showLogoutModal.value = false;
      }
    });
  } catch (error) {
    console.error("Error during component mounting:", error);
  }
});
onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  window.removeEventListener("wishlist-refresh", refreshWishlistCount);
  window.removeEventListener("scroll", throttledHandleScroll);
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  if (fetchWishlistTimeout) {
    clearTimeout(fetchWishlistTimeout);
  }
});
onBeforeUnmount(() => {
  stopAutoSlide();
});
defineExpose({ refreshWishlistCount, debugWishlistState });
</script>

<style scoped>
</style>
