<template>
  <div>
    <!-- Profile Modal -->
    <div class="modal-overlay" v-if="show" @click.self="closeModal">
      <div class="profile-modal">
        <div class="modal-header">
          <h3>{{ t("my-profile") }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <!-- Profile Header -->
          <div class="profile-header">
            <div class="profile-avatar-container">
              <div class="profile-avatar" v-if="!profileImageLoaded || !formData.image">
                {{ userInitials }}
              </div>
              <div class="profile-avatar" v-else>
                <img
                  :src="formData.image"
                  :alt="fullName"
                  @error="handleProfileImageError"
                  class="avatar-image"
                />
              </div>
              <div class="avatar-upload">
                <label for="profileImageUpload" class="upload-icon">
                  <span>📷</span>
                </label>
                <input
                  type="file"
                  id="profileImageUpload"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden-input"
                />
              </div>
            </div>
            <div class="profile-name">{{ fullName }}</div>
            <div class="profile-email">{{ formData.email }}</div>
          </div>

          <!-- Status Bar -->
          <div class="profile-status-bar" v-if="statusMessage">
            <div :class="['status-message', statusType]">
              {{ statusMessage }}
            </div>
          </div>

          <!-- Profile Form -->
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-section">
              <h4>{{ t("personal-info") }}</h4>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">{{ t("first-name") }}</label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="firstName"
                      v-model="formData.first_name"
                      :placeholder="t('enter-first-name')"
                      required
                      :class="{ 'input-error': errors.first_name }"
                    />
                    <span v-if="errors.first_name" class="error-message">
                      {{ errors.first_name }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">{{ t("last-name") }}</label>
                  <div class="input-wrapper">
                    <input
                      type="text"
                      id="lastName"
                      v-model="formData.last_name"
                      :placeholder="t('enter-last-name')"
                      required
                      :class="{ 'input-error': errors.last_name }"
                    />
                    <span v-if="errors.last_name" class="error-message">
                      {{ errors.last_name }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="gender">{{ t("gender") }}</label>
                  <div class="input-wrapper">
                    <select
                      id="gender"
                      v-model="formData.gender"
                      :class="{ 'input-error': errors.gender }"
                      class="form-select"
                    >
                      <option value="0">{{ t("prefer-not-to-say") }}</option>
                      <option value="1">{{ t("male") }}</option>
                      <option value="2">{{ t("female") }}</option>
                    </select>
                    <span v-if="errors.gender" class="error-message">
                      {{ errors.gender }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">{{ t("phone-number") }}</label>
                  <div class="input-wrapper">
                    <input
                      type="tel"
                      id="phone"
                      v-model="formData.phone"
                      :placeholder="t('enter-phone')"
                      required
                      :class="{ 'input-error': errors.phone }"
                    />
                    <span v-if="errors.phone" class="error-message">
                      {{ errors.phone }}
                    </span>
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
                    :placeholder="t('enter-email')"
                    required
                    :class="{ 'input-error': errors.email }"
                    disabled
                  />
                  <span class="field-info">{{ t("email-cannot-be-changed") }}</span>
                  <span v-if="errors.email" class="error-message">
                    {{ errors.email }}
                  </span>
                </div>
              </div>
            </div>

            <div class="form-section" v-if="showPasswordSection">
              <h4>{{ t("change-password") }}</h4>
              <div class="toggle-section">
                <button
                  type="button"
                  class="toggle-btn"
                  @click="showPasswordSection = false"
                >
                  {{ t("cancel") }}
                </button>
              </div>

              <div class="form-group">
                <label for="currentPassword">{{ t("current-password") }}</label>
                <div class="input-wrapper password-wrapper">
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    id="currentPassword"
                    v-model="passwordData.current_password"
                    :placeholder="t('enter-current-password')"
                    :class="{ 'input-error': errors.current_password }"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <i
                      :class="showCurrentPassword ? 'eye-icon-open' : 'eye-icon-closed'"
                    ></i>
                  </button>
                  <span v-if="errors.current_password" class="error-message">
                    {{ errors.current_password }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword">{{ t("new-password") }}</label>
                <div class="input-wrapper password-wrapper">
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    id="newPassword"
                    v-model="passwordData.new_password"
                    :placeholder="t('enter-new-password')"
                    :class="{ 'input-error': errors.new_password }"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i :class="showNewPassword ? 'eye-icon-open' : 'eye-icon-closed'"></i>
                  </button>
                  <span v-if="errors.new_password" class="error-message">
                    {{ errors.new_password }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmNewPassword">{{ t("confirm-new-password") }}</label>
                <div class="input-wrapper password-wrapper">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmNewPassword"
                    v-model="passwordData.new_password_confirmation"
                    :placeholder="t('confirm-new-password')"
                    :class="{ 'input-error': errors.new_password_confirmation }"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i
                      :class="showConfirmPassword ? 'eye-icon-open' : 'eye-icon-closed'"
                    ></i>
                  </button>
                  <span v-if="errors.new_password_confirmation" class="error-message">
                    {{ errors.new_password_confirmation }}
                  </span>
                </div>
              </div>

              <div class="form-actions password-actions">
                <button
                  type="button"
                  class="cancel-btn"
                  @click="showPasswordSection = false"
                >
                  {{ t("cancel") }}
                </button>
                <button
                  type="button"
                  class="update-btn"
                  :disabled="isSubmittingPassword"
                  @click="updatePassword"
                >
                  <span v-if="isSubmittingPassword" class="spinner"></span>
                  <span v-else>{{ t("update-password") }}</span>
                </button>
              </div>
            </div>

            <div class="form-section" v-else>
              <h4>{{ t("security") }}</h4>
              <div class="toggle-section">
                <button
                  type="button"
                  class="toggle-btn"
                  @click="showPasswordSection = true"
                >
                  {{ t("change-password") }}
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeModal">
                {{ t("cancel") }}
              </button>
              <button type="submit" class="update-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner"></span>
                <span v-else>{{ t("update-profile") }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, reactive, ref, watch } from "vue";

export default {
  name: "ProfileModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "updated"],
  setup(props, { emit }) {
    // Global store and translation
    const globalStore = useGlobalStore();
    const { t } = useTranslation();

    // Form data
    const formData = reactive({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "0",
      image: "",
    });

    // Password change data
    const passwordData = reactive({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });

    // UI states
    const isSubmitting = ref(false);
    const isSubmittingPassword = ref(false);
    const showPasswordSection = ref(false);
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const profileImageLoaded = ref(true);
    const statusMessage = ref("");
    const statusType = ref("success");

    // Form errors
    const errors = reactive({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "",
      image: "",
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });

    // Computed properties
    const fullName = computed(() => {
      if (formData.first_name && formData.last_name) {
        return `${formData.first_name} ${formData.last_name}`;
      }
      return "Traveler";
    });

    const userInitials = computed(() => {
      if (formData.first_name && formData.last_name) {
        return `${formData.first_name.charAt(0)}${formData.last_name.charAt(
          0
        )}`.toUpperCase();
      }
      return "T";
    });

    // Watch for show prop to load user data
    watch(
      () => props.show,
      (newValue) => {
        if (newValue) {
          loadUserData();
        }
      }
    );

    // Methods
    function loadUserData() {
      const userData = globalStore.profile;
      if (userData) {
        // Reset form data
        Object.keys(formData).forEach((key) => {
          if (userData[key] !== undefined) {
            formData[key] = userData[key];
          }
        });

        // Convert gender to string if it's numeric
        if (typeof formData.gender === "number") {
          formData.gender = formData.gender.toString();
        }

        // Check if profile has image
        if (formData.image) {
          profileImageLoaded.value = true;
        } else {
          profileImageLoaded.value = false;
        }
      } else {
        fetchUserData();
      }

      // Reset password data
      passwordData.current_password = "";
      passwordData.new_password = "";
      passwordData.new_password_confirmation = "";

      // Reset UI states
      showPasswordSection.value = false;
      statusMessage.value = "";

      // Reset errors
      Object.keys(errors).forEach((key) => {
        errors[key] = "";
      });
    }

    async function fetchUserData() {
      try {
        const response = await axios.get(
          "/api/web/auth/me",
          globalStore.getAxiosHeader()
        );

        if (response.data.result) {
          const userData = response.data.data;

          // Update form data
          Object.keys(formData).forEach((key) => {
            if (userData[key] !== undefined) {
              formData[key] = userData[key];
            }
          });

          // Convert gender to string if it's numeric
          if (typeof formData.gender === "number") {
            formData.gender = formData.gender.toString();
          }

          // Check if profile has image
          if (formData.image) {
            profileImageLoaded.value = true;
          } else {
            profileImageLoaded.value = false;
          }
        } else {
          console.error("Failed to load user data:", response.data.message);
          showStatusMessage("error", t("error-fetching-profile"));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showStatusMessage("error", t("error-fetching-profile"));
        
        // Use global error handler
        await globalStore.onCheckError(error);
      }
    }

    function handleProfileImageError() {
      profileImageLoaded.value = false;
    }

    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Check file type
      if (!file.type.match("image.*")) {
        showStatusMessage("error", t("invalid-image-format"));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showStatusMessage("error", t("image-too-large"));
        return;
      }

      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        formData.image = e.target.result;
        profileImageLoaded.value = true;
      };
      reader.readAsDataURL(file);
    }

    function showStatusMessage(type, message) {
      statusType.value = type;
      statusMessage.value = message;

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        statusMessage.value = "";
      }, 5000);
    }

    function validateForm() {
      let isValid = true;

      // Reset errors
      Object.keys(errors).forEach((key) => {
        errors[key] = "";
      });

      // Validate fields
      if (!formData.first_name.trim()) {
        errors.first_name = t("first-name-required");
        isValid = false;
      }

      if (!formData.last_name.trim()) {
        errors.last_name = t("last-name-required");
        isValid = false;
      }

      if (!formData.phone.trim()) {
        errors.phone = t("phone-required");
        isValid = false;
      }

      return isValid;
    }

    function validatePasswordForm() {
      let isValid = true;

      // Reset password-related errors
      errors.current_password = "";
      errors.new_password = "";
      errors.new_password_confirmation = "";

      // Validate password fields
      if (!passwordData.current_password) {
        errors.current_password = t("current-password-required");
        isValid = false;
      }

      if (!passwordData.new_password) {
        errors.new_password = t("new-password-required");
        isValid = false;
      } else if (passwordData.new_password.length < 8) {
        errors.new_password = t("password-min-length");
        isValid = false;
      }

      if (!passwordData.new_password_confirmation) {
        errors.new_password_confirmation = t("confirm-password-required");
        isValid = false;
      } else if (passwordData.new_password !== passwordData.new_password_confirmation) {
        errors.new_password_confirmation = t("passwords-dont-match");
        isValid = false;
      }

      return isValid;
    }

    async function updateProfile() {
      if (!validateForm()) return;

      isSubmitting.value = true;

      try {
        // Create FormData object for multipart/form-data
        const formDataToSend = new FormData();
        
        // Add Laravel method spoofing for PUT request
        formDataToSend.append("_method", "PUT");
        
        formDataToSend.append("first_name", formData.first_name);
        formDataToSend.append("last_name", formData.last_name);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("gender", formData.gender);

        // Add image if it's a File object or base64 data
        if (formData.image) {
          // If it's a base64 string from the preview
          if (
            typeof formData.image === "string" &&
            formData.image.startsWith("data:image")
          ) {
            try {
              // Convert base64 to file
              const response = await fetch(formData.image);
              const blob = await response.blob();
              const file = new File([blob], "profile-image.jpg", { type: blob.type });
              formDataToSend.append("image", file);
              console.log("Added base64 image to form data");
            } catch (imgError) {
              console.error("Error converting base64 to file:", imgError);
            }
          }
          // If it's a file object directly
          else if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image);
            console.log("Added File object to form data");
          }
          // If it's a URL, don't change it
          else if (
            typeof formData.image === "string" &&
            !formData.image.startsWith("data:")
          ) {
            console.log("Image is a URL, not adding to form data");
            // Don't append anything - keep existing image
          }
        }

        // Use POST request with method spoofing for file uploads
        const response = await axios.post(
          "/api/web/customer/update",
          formDataToSend,
          {
            ...globalStore.getAxiosHeader(),
            headers: {
              ...globalStore.getAxiosHeader().headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.result) {
          console.log("Profile updated successfully:", response.data);

          // Force refresh user profile in global store
          await globalStore.fetchUserProfile();

          // Check if the image was updated correctly
          console.log("Updated profile data:", globalStore.profile);

          showStatusMessage("success", t("profile-updated-successfully"));

          // Emit updated event
          emit("updated");

          // Auto-close modal after successful update with a small delay
          setTimeout(() => {
            closeModal();
          }, 1500); // 1.5 second delay to show success message

        } else {
          showStatusMessage("error", response.data.message || t("update-failed"));
        }
      } catch (error) {
        console.error("Profile update error:", error);

        // Log detailed error information
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }

        // Handle validation errors from API
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          Object.keys(apiErrors).forEach((key) => {
            if (errors[key] !== undefined) {
              errors[key] = apiErrors[key][0];
            }
          });
        }

        showStatusMessage("error", error.response?.data?.message || t("update-failed"));

        // Use global error handler
        await globalStore.onCheckError(error);
      } finally {
        isSubmitting.value = false;
      }
    }

    async function updatePassword() {
      if (!validatePasswordForm()) return;

      isSubmittingPassword.value = true;

      try {
        // Prepare data for password update
        const passwordFormData = {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          new_password_confirmation: passwordData.new_password_confirmation,
        };

        // Make API call to the password update endpoint
        const response = await axios.post(
          "/api/profile/pass",
          passwordFormData,
          globalStore.getAxiosHeader()
        );

        if (response.data.result) {
          showStatusMessage("success", t("password-updated-successfully"));

          // Reset password form
          passwordData.current_password = "";
          passwordData.new_password = "";
          passwordData.new_password_confirmation = "";

          // Hide password section
          showPasswordSection.value = false;

          // Auto-close modal after successful password update with a small delay
          setTimeout(() => {
            closeModal();
          }, 1500); // 1.5 second delay to show success message

        } else {
          showStatusMessage(
            "error",
            response.data.message || t("password-update-failed")
          );
        }
      } catch (error) {
        console.error("Password update error:", error);

        // Handle validation errors from API
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          Object.keys(apiErrors).forEach((key) => {
            if (key in errors) {
              errors[key] = apiErrors[key][0];
            }
          });
        }

        showStatusMessage(
          "error",
          error.response?.data?.message || t("password-update-failed")
        );

        // Use global error handler
        await globalStore.onCheckError(error);
      } finally {
        isSubmittingPassword.value = false;
      }
    }

    function closeModal() {
      emit("close");
    }

    return {
      formData,
      passwordData,
      errors,
      isSubmitting,
      isSubmittingPassword,
      showPasswordSection,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      profileImageLoaded,
      statusMessage,
      statusType,
      fullName,
      userInitials,
      t,
      handleProfileImageError,
      handleImageUpload,
      updateProfile,
      updatePassword,
      closeModal,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.profile-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(25, 173, 207, 0.15);
  animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to right, #19adcf, #0088b9);
  color: white;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.5;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.modal-header h3::before {
  content: "🧳";
  margin-right: 8px;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  transform: rotate(90deg);
}

.modal-body {
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

/* Profile Header */
.profile-header {
  padding: 30px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
  position: relative;
}

.profile-avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(255, 126, 95, 0.3);
  border: 3px solid #fff;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.avatar-upload:hover {
  transform: scale(1.1);
  background-color: #f0f9ff;
}

.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-icon span {
  font-size: 16px;
}

.hidden-input {
  display: none;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.profile-email {
  font-size: 14px;
  color: #64748b;
}

/* Status Bar */
.profile-status-bar {
  padding: 10px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.status-message {
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
}

.status-message.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-left: 3px solid #10b981;
}

.status-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-left: 3px solid #ef4444;
}

/* Profile Form */
.profile-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e5e7eb;
  position: relative;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-section h4::before {
  content: "✈️";
  margin-right: 8px;
  font-size: 14px;
}

.form-section:nth-child(2) h4::before {
  content: "🔐";
}

.toggle-section {
  position: absolute;
  top: 0;
  right: 0;
}

.toggle-btn {
  background: none;
  border: none;
  color: #19adcf;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background-color: rgba(25, 173, 207, 0.1);
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 15px;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 6px;
}

.input-wrapper {
  position: relative;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #19adcf;
  box-shadow: 0 0 0 3px rgba(25, 173, 207, 0.1);
  background-color: #fff;
}

input::placeholder {
  color: #9ca3af;
}

input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.field-info {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  font-style: italic;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 5px;
}

/* Password field */
.password-wrapper {
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 45px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #19adcf;
}

.eye-icon-closed {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2319ADCF'%3E%3Cpath fill-rule='evenodd' d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z' clip-rule='evenodd' /%3E%3Cpath d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' /%3E%3C/svg%3E");
}

.eye-icon-open {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2319ADCF'%3E%3Cpath d='M10 12a2 2 0 100-4 2 2 0 000 4z' /%3E%3Cpath fill-rule='evenodd' d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z' clip-rule='evenodd' /%3E%3C/svg%3E");
}

/* Form select styling */
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2319ADCF'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-position: right 15px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
}

.cancel-btn,
.update-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.update-btn {
  background: linear-gradient(to right, #19adcf, #0088b9);
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(25, 173, 207, 0.2);
}

.update-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: all 0.5s ease;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(25, 173, 207, 0.3);
}

.update-btn:hover::before {
  left: 100%;
}

.update-btn:disabled {
  background: linear-gradient(to right, #a8d0da, #7abbc8);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media queries */
@media (max-width: 768px) {
  .profile-modal {
    width: 95%;
    max-height: 95vh;
  }

  .form-section h4 {
    font-size: 15px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    font-size: 30px;
  }

  .profile-avatar-container {
    width: 80px;
    height: 80px;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .cancel-btn,
  .update-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-modal {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-body {
    padding-bottom: 20px;
  }

  .profile-header {
    padding: 20px 15px;
  }

  .profile-avatar,
  .profile-avatar-container {
    width: 70px;
    height: 70px;
    font-size: 26px;
  }

  .avatar-upload {
    width: 26px;
    height: 26px;
  }

  .form-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  input,
  select,
  .cancel-btn,
  .update-btn {
    padding: 10px 14px;
  }
}
</style>