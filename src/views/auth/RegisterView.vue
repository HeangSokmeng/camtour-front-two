<template>
  <div class="register-container">
    <router-link to="/" class="back-home-btn">
      <span class="back-icon">←</span>
      <span class="back-text">{{ t("back-to-home") }}</span>
    </router-link>

    <div class="register-card">
      <div class="register-header">
        <h2>{{ t("adventure-starts-here") }}</h2>
        <p class="welcome-text">{{ t("join-travel-community") }}</p>
      </div>

      <div class="social-login">
        <button
          class="social-btn google"
          @click="loginWithGoogle"
          :aria-label="t('continue-with-google')"
        >
          <img src="../../assets/icons/google.png" :alt="t('google')" class="social-icon" /> 
          <span style="font-size:small">Continue with Google</span>
        </button>
      </div>

      <div class="separator">
        <span>{{ t("or-sign-up-with-email") }}</span>
      </div>

      <form @submit.prevent="registerUser" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">{{ t("first-name") }}</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                :placeholder="t('first-name-placeholder')"
                required
                :class="{ 'input-error': errors.firstName, 'input-focus': focusedInput === 'firstName' }"
                @focus="focusedInput = 'firstName'"
                @blur="focusedInput = null"
              />
              <i class="input-icon user-icon">
                <UserIcon />
              </i>
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              <div v-if="focusedInput === 'firstName'" class="key-hint">
                <div class="keyboard-key">A-Z</div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="lastName">{{ t("last-name") }}</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                :placeholder="t('last-name-placeholder')"
                required
                :class="{ 'input-error': errors.lastName, 'input-focus': focusedInput === 'lastName' }"
                @focus="focusedInput = 'lastName'"
                @blur="focusedInput = null"
              />
              <i class="input-icon user-icon">
                <UserIcon />
              </i>
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              <div v-if="focusedInput === 'lastName'" class="key-hint">
                <div class="keyboard-key">A-Z</div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="dob">{{ t("date-of-birth") }}</label>
          <div class="input-wrapper date-input">
            <input
              type="date"
              id="dob"
              v-model="formData.dob"
              required
              :class="{ 'input-error': errors.dob, 'input-focus': focusedInput === 'dob' }"
              @focus="focusedInput = 'dob'"
              @blur="focusedInput = null"
            />
            <span v-if="errors.dob" class="error-message">{{ errors.dob }}</span>
            <div v-if="focusedInput === 'dob'" class="key-hint">
              <div class="keyboard-key">{{ t("calendar") }}</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="image">{{ t("profile-image") }}</label>
          <div class="input-wrapper image-upload-wrapper">
            <div class="profile-image-container" @click="triggerFileInput">
              <img
                width="100px"
                v-if="imagePreview"
                :src="imagePreview"
                class="profile-image-preview"
                :alt="t('profile-preview')"
              />
              <div v-else class="profile-image-placeholder">
                <span class="text">{{ t("photo") }}</span>
              </div>
              <input
                type="file"
                id="image"
                ref="imageInput"
                accept="image/*"
                class="file-input"
                @change="handleImageUpload"
                :class="{ 'input-error': errors.image }"
              />
            </div>
            <span v-if="errors.image" class="error-message">{{ errors.image }}</span>
            <div v-if="focusedInput === 'image'" class="key-hint">
              <span class="keyboard-key">{{ t("upload") }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="gender">{{ t("gender") }}</label>
          <div class="input-wrapper">
            <select
              id="gender"
              v-model="formData.gender"
              required
              :class="{ 'input-error': errors.gender, 'input-focus': focusedInput === 'gender' }"
              class="form-select"
              @focus="focusedInput = 'gender'"
              @blur="focusedInput = null"
            >
              <option value="0">{{ t("prefer-not-to-say") }}</option>
              <option value="1">{{ t("male") }}</option>
              <option value="2">{{ t("female") }}</option>
            </select>
            <span v-if="errors.gender" class="error-message">{{ errors.gender }}</span>
            <div v-if="focusedInput === 'gender'" class="key-hint">
              <div class="keyboard-key">▼</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="email">{{ t("email") }}</label>
          <div class="input-wrapper">
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :placeholder="t('email-placeholder')"
              required
              :class="{ 'input-error': errors.email, 'input-focus': focusedInput === 'email' }"
              @focus="focusedInput = 'email'"
              @blur="focusedInput = null"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            <div v-if="focusedInput === 'email'" class="key-hint">
              <div class="keyboard-key">@</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="phone">{{ t("phone-number") }}</label>
          <div class="input-wrapper">
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              :placeholder="t('phone-placeholder')"
              required
              :class="{ 'input-error': errors.phone, 'input-focus': focusedInput === 'phone' }"
              @focus="focusedInput = 'phone'"
              @blur="focusedInput = null"
            />
            <i class="input-icon phone-icon">
              <PhoneIcon />
            </i>
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            <div v-if="focusedInput === 'phone'" class="key-hint">
              <div class="keyboard-key">0-9</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="password">{{ t("password") }}</label>
          <div class="input-wrapper password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              :placeholder="t('password-placeholder')"
              required
              :class="{ 'input-error': errors.password, 'input-focus': focusedInput === 'password' }"
              @focus="focusedInput = 'password'"
              @blur="focusedInput = null"
            />

            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? t('hide-password') : t('show-password')"
            >
              <i :class="showPassword ? 'eye-icon-open' : 'eye-icon-closed'">
                <EyeOpenIcon v-if="showPassword" />
                <EyeClosedIcon v-else />
              </i>
            </button>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            <div v-if="focusedInput === 'password'" class="key-hint">
              <div class="keyboard-key">A-Z</div>
              <div class="keyboard-key">0-9</div>
              <div class="keyboard-key">!@#</div>
            </div>
          </div>
          <div class="password-strength" v-if="formData.password">
            <div class="strength-meter">
              <div
                class="strength-bar"
                :style="{ width: passwordStrength + '%', backgroundColor: strengthColor }"
              ></div>
            </div>
            <span class="strength-text">{{ t(strengthTextKey) }}</span>
          </div>
          <div class="password-requirements">
            <div class="requirement" :class="{ met: passwordHasLength }">
              <i class="check-icon">
                <CheckIcon v-if="passwordHasLength" />
                <CircleIcon v-else />
              </i>
              <span>{{ t("password-requirement-length") }}</span>
            </div>
            <div class="requirement" :class="{ met: passwordHasUpper }">
              <i class="check-icon">
                <CheckIcon v-if="passwordHasUpper" />
                <CircleIcon v-else />
              </i>
              <span>{{ t("password-requirement-uppercase") }}</span>
            </div>
            <div class="requirement" :class="{ met: passwordHasLower }">
              <i class="check-icon">
                <CheckIcon v-if="passwordHasLower" />
                <CircleIcon v-else />
              </i>
              <span>{{ t("password-requirement-lowercase") }}</span>
            </div>
            <div class="requirement" :class="{ met: passwordHasSpecial }">
              <i class="check-icon">
                <CheckIcon v-if="passwordHasSpecial" />
                <CircleIcon v-else />
              </i>
              <span>{{ t("password-requirement-special") }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">{{ t("confirm-password") }}</label>
          <div class="input-wrapper password-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :placeholder="t('confirm-password-placeholder')"
              required
              :class="{ 'input-error': errors.confirmPassword, 'input-focus': focusedInput === 'confirmPassword' }"
              @focus="focusedInput = 'confirmPassword'"
              @blur="focusedInput = null"
            />

            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? t('hide-password') : t('show-password')"
            >
              <i :class="showConfirmPassword ? 'eye-icon-open' : 'eye-icon-closed'">
                <EyeOpenIcon v-if="showConfirmPassword" />
                <EyeClosedIcon v-else />
              </i>
            </button>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            <div v-if="focusedInput === 'confirmPassword'" class="key-hint">
              <div class="keyboard-key">A-Z</div>
              <div class="keyboard-key">0-9</div>
              <div class="keyboard-key">!@#</div>
            </div>
          </div>
        </div>

        <div class="form-group terms-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="formData.termsAccepted" required />
            <span class="checkmark"></span>
            <span class="terms-text">
              {{ t("agree-to-terms-start") }}
              <a href="#" @click.prevent="showTerms">{{ t("terms-of-service") }}</a>
              {{ t("and") }}
              <a href="#" @click.prevent="showPrivacy">{{ t("privacy-policy") }}</a>
            </span>
          </label>
          <span v-if="errors.termsAccepted" class="error-message">{{ errors.termsAccepted }}</span>
        </div>

        <button type="submit" class="register-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">
            <i class="spinner-icon">
              <SpinnerIcon />
            </i>
            {{ t("creating-account") }}
          </span>
          <span v-else>{{ t("start-your-journey") }}</span>
        </button>
      </form>

      <p class="login-link">
        {{ t("already-have-account") }}
        <router-link to="/login">{{ t("sign-in") }}</router-link>
      </p>
    </div>

    <div class="modal-overlay" v-if="showSuccessModal" @click="goToLogin">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">
          <svg viewBox="0 0 50 50" width="50" height="50">
            <circle cx="25" cy="25" r="23" fill="none" stroke="#19ADCF" stroke-width="4" />
            <path d="M14,27L22,35L36,16" fill="none" stroke="#19ADCF" stroke-width="4" />
          </svg>
        </div>
        <h3>{{ t("welcome-aboard") }}</h3>
        <p>{{ t("journey-begins-now") }}</p>
        <button class="modal-btn success-btn" @click="goToLogin">
          {{ t("continue-to-login") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/css/register.css";
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, h, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const { currentLanguage, t } = useTranslation();
const router = useRouter();
const globalStore = useGlobalStore();

const UserIcon = () => h('svg', {
  width: '20',
  height: '20',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
    'clip-rule': 'evenodd'
  })
]);

const PhoneIcon = () => h('svg', {
  width: '20',
  height: '20',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    d: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'
  })
]);

const EyeOpenIcon = () => h('svg', {
  width: '20',
  height: '20',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', { d: 'M10 12a2 2 0 100-4 2 2 0 000 4z' }),
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z',
    'clip-rule': 'evenodd'
  })
]);

const EyeClosedIcon = () => h('svg', {
  width: '20',
  height: '20',
  viewBox: '0 0 20 20',
  fill: 'currentColor'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z',
    'clip-rule': 'evenodd'
  }),
  h('path', {
    d: 'M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z'
  })
]);

const CheckIcon = () => h('svg', {
  width: '16',
  height: '16',
  viewBox: '0 0 20 20',
  fill: '#4CAF50'
}, [
  h('path', {
    'fill-rule': 'evenodd',
    d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
    'clip-rule': 'evenodd'
  })
]);

const CircleIcon = () => h('svg', {
  width: '16',
  height: '16',
  viewBox: '0 0 20 20',
  fill: '#9CA3AF'
}, [
  h('circle', {
    cx: '10',
    cy: '10',
    r: '7.5',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5'
  })
]);

const SpinnerIcon = () => h('svg', {
  class: 'animate-spin',
  width: '20',
  height: '20',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor'
}, [
  h('circle', {
    class: 'opacity-25',
    cx: '12',
    cy: '12',
    r: '10',
    stroke: 'currentColor',
    'stroke-width': '4'
  }),
  h('path', {
    class: 'opacity-75',
    d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
    fill: 'currentColor'
  })
]);

const focusedInput = ref(null);
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showSuccessModal = ref(false);
const imagePreview = ref(null);
const imageInput = ref(null);

const formData = reactive({
  firstName: "",
  lastName: "",
  dob: "",
  gender: "0",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
  image: null,
});

const errors = reactive({
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  termsAccepted: "",
  image: "",
});

const passwordHasLength = computed(() => formData.password.length >= 8);
const passwordHasUpper = computed(() => /[A-Z]/.test(formData.password));
const passwordHasLower = computed(() => /[a-z]/.test(formData.password));
const passwordHasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(formData.password));

const passwordStrength = computed(() => {
  if (!formData.password) return 0;
  let strength = 0;
  if (passwordHasLength.value) strength += 25;
  if (passwordHasUpper.value) strength += 25;
  if (passwordHasLower.value) strength += 25;
  if (passwordHasSpecial.value) strength += 25;
  return strength;
});

const strengthColor = computed(() => {
  if (passwordStrength.value < 50) return "#FF5252";
  if (passwordStrength.value < 100) return "#FFC107";
  return "#4CAF50";
});

const strengthTextKey = computed(() => {
  if (passwordStrength.value < 50) return "password-strength-weak";
  if (passwordStrength.value < 100) return "password-strength-medium";
  return "password-strength-strong";
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d]{1,16}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

const validateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 13;
};

const validateForm = () => {
  let isValid = true;

  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  if (!formData.firstName.trim()) {
    errors.firstName = t("first-name-required");
    isValid = false;
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = t("first-name-min-length");
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = t("last-name-required");
    isValid = false;
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = t("last-name-min-length");
    isValid = false;
  }

  if (!formData.dob) {
    errors.dob = t("dob-required");
    isValid = false;
  } else if (!validateAge(formData.dob)) {
    errors.dob = t("dob-min-age");
    isValid = false;
  }

  if (!formData.email) {
    errors.email = t("email-required");
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = t("email-invalid");
    isValid = false;
  }

  if (!formData.phone) {
    errors.phone = t("phone-required");
    isValid = false;
  } else if (!validatePhone(formData.phone)) {
    errors.phone = t("phone-invalid");
    isValid = false;
  }

  if (!formData.password) {
    errors.password = t("password-required");
    isValid = false;
  } else if (passwordStrength.value < 75) {
    errors.password = t("password-too-weak");
    isValid = false;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = t("confirm-password-required");
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = t("passwords-do-not-match");
    isValid = false;
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = t("terms-must-be-accepted");
    isValid = false;
  }

  return isValid;
};

const triggerFileInput = () => {
  imageInput.value.click();
  focusedInput.value = "image";
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (!validTypes.includes(file.type)) {
    errors.image = t("image-invalid-type");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.image = t("image-too-large");
    return;
  }

  errors.image = "";
  formData.image = file;

  const reader = new FileReader();
  reader.onload = (event) => {
    imagePreview.value = event.target.result;
  };
  reader.readAsDataURL(file);
};

const registerUser = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.firstName.trim());
    formDataToSend.append("last_name", formData.lastName.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("phone", formData.phone.trim());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("password_confirmation", formData.confirmPassword);
    formDataToSend.append("gender", formData.gender);

    if (formData.dob) {
      formDataToSend.append("dob", formData.dob);
    }

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    const response = await axios.post("/api/web/view/customer", formDataToSend, {
      ...globalStore.getAxiosHeader(),
      headers: {
        ...globalStore.getAxiosHeader().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.result) {
      showSuccessModal.value = true;
    } else {
      throw new Error(response.data.message || t("registration-failed"));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const validationErrors = error.response.data.errors;

      Object.keys(validationErrors).forEach((key) => {
        const mappedKey = mapServerErrorKey(key);
        if (Object.prototype.hasOwnProperty.call(errors, mappedKey)) {
          errors[mappedKey] = validationErrors[key][0];
        }
      });
    } else {
      await globalStore.onCheckError(error);
      const errorMessage = error.response?.data?.message || error.message || t("registration-error");
      alert(errorMessage);
    }
  } finally {
    isSubmitting.value = false;
  }
};
const errorMessage = ref("");
const isLoading = ref(false);
const loginWithGoogle = async () => {
  errorMessage.value = "";
  isLoading.value = true;
  try {
    const redirectUrl = `${axios.defaults.baseURL}/api/auth/redirect/google`;
    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Google login error:", error);
    errorMessage.value = t("login-failed");
  } finally {
    isLoading.value = false;
  }
};

const mapServerErrorKey = (serverKey) => {
  const keyMap = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email",
    phone: "phone",
    password: "password",
    password_confirmation: "confirmPassword",
    gender: "gender",
    dob: "dob",
    image: "image",
  };
  return keyMap[serverKey] || serverKey;
};

const goToLogin = () => {
  router.push("/login");
};

const showTerms = () => {
  router.push("/terms");
};

const showPrivacy = () => {
  router.push("/privacy");
};

const handleLanguageChange = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

watch(currentLanguage, () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
});

onMounted(() => {
  window.addEventListener("language-changed", handleLanguageChange);

  if (globalStore.getIsAuthenticated) {
    router.push("/");
  }
});

onUnmounted(() => {
  window.removeEventListener("language-changed", handleLanguageChange);
});

watch(
  () => globalStore.getIsAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      router.push("/");
    }
  }
);
</script>