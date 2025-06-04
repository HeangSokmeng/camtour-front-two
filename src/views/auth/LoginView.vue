<template>
  <div class="login-container">
    <router-link to="/" class="back-home-btn">
      <span class="back-icon">←</span>
      <span class="back-text">{{ t("back-to-home") }}</span>
    </router-link>

    <div class="login-card">
      <div class="login-image-container">
        <div class="login-image-content">
          <div class="login-brand">{{ t("camtour-brand") }}</div>
          <div class="login-slogan">{{ t("login-slogan") }}</div>
          <div class="travel-icons">
            <div class="travel-icon">✈️</div>
            <div class="travel-icon">🏝️</div>
            <div class="travel-icon">🗺️</div>
          </div>
        </div>
        <div class="wave-decoration"></div>
        <div class="decorative-icons">
          <span class="decorative-icon">🏰</span>
          <span class="decorative-icon">🌄</span>
          <span class="decorative-icon">🏛️</span>
        </div>
      </div>
      <div class="login-form-container">
        <div class="login-header">
          <h2 class="login-title">{{ t("welcome-back") }}</h2>
          <p class="login-subtitle">{{ t("login-subtitle") }}</p>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">{{ t("email") }}</label>
            <input
              type="email"
              id="email"
              v-model="credentials.email"
              :placeholder="t('email-placeholder')"
              required
              :class="{ 'input-error': errors.email }"
            />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label for="password">{{ t("password") }}</label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="credentials.password"
                :placeholder="t('password-placeholder')"
                required
                :class="{ 'input-error': errors.password }"
              />
              <button
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? t('hide-password') : t('show-password')"
              >
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>
          <div class="form-actions">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="credentials.remember" />
              <label for="remember">{{ t("remember-me") }}</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">
              {{ t("forgot-password") }}
            </router-link>
          </div>
          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <span v-else>{{ t("login-button") }}</span>
          </button>
        </form>
        <div class="divider">
          <span>{{ t("or-continue-with") }}</span>
        </div>

        <!-- Uncomment when social login is implemented -->
        <!-- <div class="social-login">
          <button class="social-btn google" @click="loginWithGoogle" :aria-label="t('login-with-google')">
            <img src="../assets/icon/google-icon.svg" :alt="t('google')" />
          </button>
          <button class="social-btn apple" @click="loginWithApple" :aria-label="t('login-with-apple')">
            <img src="../assets/icon/apple-icon.svg" :alt="t('apple')" />
          </button>
          <button class="social-btn facebook" @click="loginWithFacebook" :aria-label="t('login-with-facebook')">
            <img src="../assets/icon/facebook-icon.svg" :alt="t('facebook')" />
          </button>
        </div> -->

        <div class="register-prompt">
          <p>
            {{ t("no-account") }}
            <router-link to="/register" class="register-link">
              {{ t("register-now") }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/css/login.css";
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const { currentLanguage, t } = useTranslation();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const credentials = reactive({
  email: "",
  password: "",
  remember: false,
});
const errors = reactive({
  email: "",
  password: "",
});
const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const returnUrl = ref("/");
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const validateForm = () => {
  let isValid = true;
  errors.email = "";
  errors.password = "";
  if (!credentials.email) {
    errors.email = t("email-required");
    isValid = false;
  } else if (!validateEmail(credentials.email)) {
    errors.email = t("email-invalid");
    isValid = false;
  }
  if (!credentials.password) {
    errors.password = t("password-required");
    isValid = false;
  } else if (credentials.password.length < 6) {
    errors.password = t("password-min-length");
    isValid = false;
  }
  return isValid;
};

const handleLogin = async () => {
  errorMessage.value = "";
  if (!validateForm()) {
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post(
      "/api/auth/login",
      credentials,
      globalStore.getAxiosHeader()
    );
    if (response.data.result) {
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      globalStore.updateToken(token);
      await globalStore.fetchUserProfile();
      setTimeout(() => {
        router.push(returnUrl.value);
      }, 100);
    } else {
      errorMessage.value = response.data.message || t("login-failed");
    }
  } catch (error) {
    console.error("Login error:", error);

    if (error.response && error.response.data) {
      if (error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.email) {
          errors.email = validationErrors.email[0];
        }
        if (validationErrors.password) {
          errors.password = validationErrors.password[0];
        }
      } else {
        errorMessage.value = error.response.data.message || t("login-failed");
      }
    } else {
      errorMessage.value = t("network-error");
    }
  } finally {
    isLoading.value = false;
  }
};

const handleLanguageChange = () => {
  errorMessage.value = "";
  errors.email = "";
  errors.password = "";
};
watch(currentLanguage, () => {
  errorMessage.value = "";
  errors.email = "";
  errors.password = "";
});

onMounted(() => {
  returnUrl.value = route.query.returnUrl || "/";
  window.addEventListener("language-changed", handleLanguageChange);
  if (globalStore.getIsAuthenticated) {
    router.push(returnUrl.value);
  }
});

onUnmounted(() => {
  window.removeEventListener("language-changed", handleLanguageChange);
});

watch(
  () => globalStore.getIsAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      router.push(returnUrl.value);
    }
  }
);
</script>
