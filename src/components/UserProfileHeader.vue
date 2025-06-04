<template>
  <div class="profile-container" v-if="globalStore.getIsAuthenticated">
    <div class="profile-menu-wrapper">
      <button class="profile-button" @click="toggleMenu" ref="profileButton">
        <div
          v-if="globalStore.getUser && globalStore.getUser.image"
          class="profile-avatar"
        >
          <img :src="globalStore.getUser.image" alt="Profile" />
        </div>
        <div v-else class="profile-initials">
          {{ globalStore.getUserInitials }}
        </div>
        <span class="profile-name">{{ globalStore.getUserFullName }}</span>
        <span class="dropdown-icon" :class="{ open: isMenuOpen }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      <div v-if="isMenuOpen" class="profile-dropdown" ref="profileMenu">
        <div class="profile-info">
          <div
            v-if="globalStore.getUser && globalStore.getUser.image"
            class="dropdown-avatar"
          >
            <img :src="globalStore.getUser.image" alt="Profile" />
          </div>
          <div v-else class="dropdown-initials">
            {{ globalStore.getUserInitials }}
          </div>
          <div class="profile-details">
            <p class="profile-fullname">{{ globalStore.getUserFullName }}</p>
            <p class="profile-email">
              {{ globalStore.getUser ? globalStore.getUser.email : "" }}
            </p>
          </div>
        </div>

        <div class="dropdown-divider"></div>

        <ul class="dropdown-menu">
          <li>
            <router-link to="/profile" class="dropdown-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{{
                selectedLanguage === "en" ? "My Profile" : "ប្រវត្តិរូបរបស់ខ្ញុំ"
              }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/favorite" class="dropdown-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                ></path>
              </svg>
              <span>{{ selectedLanguage === "en" ? "Favorites" : "ចំណូលចិត្ត" }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/history" class="dropdown-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ selectedLanguage === "en" ? "History" : "ប្រវត្តិ" }}</span>
            </router-link>
          </li>
        </ul>

        <div class="dropdown-divider"></div>

        <div class="dropdown-actions">
          <button class="logout-btn" @click="logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>{{ selectedLanguage === "en" ? "Logout" : "ចាកចេញ" }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="auth-buttons" v-else>
    <router-link to="/register" class="auth-btn" data-translate="signup">
      Register
    </router-link>
    <router-link to="/login" class="auth-btn" data-translate="login"> Login </router-link>
  </div>
</template>

<script setup>
import { useGlobalStore } from "@/stores/global";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const globalStore = useGlobalStore();
const isMenuOpen = ref(false);
const selectedLanguage = ref("en");
const profileButton = ref(null);
const profileMenu = ref(null);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = (event) => {
  if (
    isMenuOpen.value &&
    profileButton.value &&
    profileMenu.value &&
    !profileButton.value.contains(event.target) &&
    !profileMenu.value.contains(event.target)
  ) {
    isMenuOpen.value = false;
  }
};

const logout = async () => {
  await globalStore.logout();
  isMenuOpen.value = false;
  router.push("/");
};

onMounted(() => {
  selectedLanguage.value = localStorage.getItem("selectedLanguage") || "en";
  document.addEventListener("click", closeMenu);
  if (globalStore.token && !globalStore.profile) {
    globalStore.fetchUserProfile();
  }
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<style scoped>
.profile-container {
  position: relative;
  z-index: 100;
}

.profile-button {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
  color: var(--dark-color, #333);
}

.profile-button:hover {
  background: var(--light-secondary, #f5f5f5);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-avatar,
.profile-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-initials {
  background: var(--primary-color, #19adcf);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.profile-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.dropdown-icon {
  transition: transform 0.2s ease;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 101;
  animation: fadeIn 0.2s ease;
}

.profile-info {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-avatar,
.dropdown-initials {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-initials {
  background: var(--primary-color, #19adcf);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
}

.profile-details {
  overflow: hidden;
}

.profile-fullname {
  font-weight: 600;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  font-size: 13px;
  color: var(--dark-secondary, #666);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0;
}

.dropdown-menu {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
  color: var(--dark-color, #333);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--light-secondary, #f5f5f5);
}

.dropdown-item svg {
  color: var(--dark-secondary, #666);
}

.dropdown-actions {
  padding: 16px;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 59, 48, 0.2);
}

.logout-btn svg {
  color: #ff3b30;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-name {
    display: none;
  }

  .profile-dropdown {
    width: 250px;
    right: -10px;
  }
}

/* For compatibility with existing auth buttons */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-btn {
  padding: 8px 16px;
  background-color: var(--primary-color, #19adcf);
  color: white;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.auth-btn:hover {
  background-color: var(--primary-dark, #1597b3);
}
</style>
