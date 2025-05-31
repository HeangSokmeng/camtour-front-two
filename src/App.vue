<template>
  <div id="app">
    <AppHeader v-if="!isLoginPage" />
    <ChatBot v-if="!isLoginPage" />
    <main>
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    <AppFooter v-if="!isLoginPage" />
    <CartDrawer />
    <!-- <FloatingCartButton /> -->
    <!-- Notification system for cart actions -->
    <div class="notification-container" v-if="showNotification">
      <div class="notification" :class="notificationType">
        <div class="notification-icon">
          <svg
            v-if="notificationType === 'success'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="notification-content">
          {{ notificationMessage }}
        </div>
        <button class="notification-close" @click="hideNotification">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// Components
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import CartDrawer from "@/components/CartDrawer.vue";
import { createTranslationProvider } from "@/components/useTranslation";
import ChatBot from "@/views/ai/ChatBotView.vue";
// Initialize translation provider
createTranslationProvider();

const route = useRoute();
const isLoginPage = computed(() => ["/login", "/register"].includes(route.path));
</script>

<style>
/* Global transitions for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
