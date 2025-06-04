<template>
  <div>
    <div
      class="chatbot-button"
      id="chatbotButton"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <div class="pulse-ring"></div>
      <i
        ><img
          class="iconchatbot"
          src="https://cdn-icons-png.flaticon.com/512/6008/6008363.png"
          alt="Travel Assistant"
      /></i>
    </div>
    <div
      class="chatbot-overlay"
      id="chatbotOverlay"
      :class="{ active: isChatbotActive }"
      @click="closeChatbot"
    ></div>
    <div
      class="chatbot-container"
      id="chatbotContainer"
      :class="{ active: isChatbotActive }"
    >
      <div class="chatbot-header">
        <div class="header-content">
          <img
            class="header-logo"
            src="../../assets/icons/robot.png"
            alt="Cambodia Icon"
          />
          <h3>Camtour Assistant</h3>
        </div>
        <button class="close-btn" @click="closeChatbot">&times;</button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages" ref="messagesContainer">
        <div class="message bot-message" v-if="messages.length === 0">
          <div class="welcome-message">
            <p>Welcome to your Camtour Assistant! I can help you discover:</p>
            <div class="location-cards">
              <button
                class="location-card phnom-penh"
                @click="selectLocation('Phnom Penh')"
              >
                <div class="location-image phnom-penh-img"></div>
                <div class="location-info">
                  <span class="location-icon">🏙️</span>
                  <span class="location-name">Phnom Penh</span>
                </div>
              </button>
              <button
                class="location-card siem-reap"
                @click="selectLocation('Siem Reap')"
              >
                <div class="location-image siem-reap-img"></div>
                <div class="location-info">
                  <span class="location-icon">🏯</span>
                  <span class="location-name">Siem Reap</span>
                </div>
              </button>
              <button
                class="location-card battambang"
                @click="selectLocation('Battambang')"
              >
                <div class="location-image battambang-img"></div>
                <div class="location-info">
                  <span class="location-icon">🚂</span>
                  <span class="location-name">Battambang</span>
                </div>
              </button>
            </div>
            <p>Or ask me anything about traveling in Cambodia:</p>
          </div>
          <div class="quick-questions">
            <button
              v-for="(question, index) in visibleQuestions"
              :key="index"
              class="quick-question"
              @click="handleQuickQuestion(question)"
            >
              {{ question }}
            </button>
          </div>
          <button
            class="show-more-btn"
            v-if="allQuestions.length > 4"
            @click="toggleQuestions"
          >
            {{ showingAllQuestions ? "Show fewer questions ▲" : "Show more questions ▼" }}
          </button>
        </div>
        <transition-group name="message-transition">
          <div
            v-for="(message, index) in messages"
            :key="'msg-' + index"
            class="message"
            :class="message.isUser ? 'user-message' : 'bot-message'"
          >
            <div class="message-content">
              <span v-if="!message.isUser" class="bot-indicator">
                <img
                  src="../../assets/icons/guide-avatar.png"
                  alt="Guide"
                  class="guide-avatar"
                />
              </span>
              <div v-if="message.isUser" class="user-content">
                {{ message.text }}
              </div>
              <div
                v-else
                class="bot-content"
                v-html="formatBotMessage(message.text)"
              ></div>
            </div>
            <div
              v-if="
                !message.isUser && message.suggestions && message.suggestions.length > 0
              "
              class="message-suggestions"
            >
              <p class="suggestion-label">You might also want to explore:</p>
              <div class="suggestion-buttons">
                <button
                  v-for="(suggestion, idx) in message.suggestions"
                  :key="'sugg-' + index + '-' + idx"
                  class="suggestion-button"
                  @click="handleQuickQuestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </transition-group>
        <div v-if="isTyping" class="message bot-message typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="chatbot-input">
        <input
          type="text"
          v-model="userInput"
          :placeholder="inputPlaceholder"
          @keypress.enter="sendMessage"
          :disabled="isTyping"
          ref="messageInput"
        />
        <button @click="sendMessage" :disabled="isTyping || !userInput.trim()">
          <span v-if="!isTyping">
            <svg
              class="send-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </span>
          <span v-else>...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ChatBot",
  data() {
    return {
      isChatbotActive: false,
      userInput: "",
      messages: [],
      isDragging: false,
      dragStarted: false,
      dragTimeout: null,
      dragOffset: { x: 0, y: 0 },
      showingAllQuestions: false,
      isTyping: false,
      conversationContext: [],
      currentLocation: null,
      inputPlaceholder: "Ask about Camtour...",
      scrollY: 0,
      allQuestions: [
        "Top attractions in Phnom Penh?",
        "Best time to visit Cambodia?",
        "How to get from Phnom Penh to Siem Reap?",
        "Currency used in Cambodia?",
        "Angkor Wat visiting tips?",
        "Must-see temples in Siem Reap?",
        "Local food to try in Cambodia?",
        "Cambodia visa requirements?",
        "Bamboo Train in Battambang?",
        "Cambodian cultural customs?",
        "Best hotels in Siem Reap?",
        "Getting around Phnom Penh?",
        "Is Cambodia safe for tourists?",
        "Useful Khmer phrases?",
        "Day trips from Battambang?",
        "Phnom Penh nightlife?",
        "Best time to visit Angkor Wat?",
        "Floating villages on Tonle Sap?",
        "Shopping in Cambodian markets?",
        "Rainy season in Cambodia?",
      ],
      locationSuggestions: {
        "Phnom Penh": [
          "Top attractions in Phnom Penh?",
          "Best areas to stay in Phnom Penh?",
          "How to get around Phnom Penh?",
          "Local food in Phnom Penh?",
        ],
        "Siem Reap": [
          "Best time to visit Angkor Wat?",
          "Must-see temples in Siem Reap?",
          "Hotels near Angkor Wat?",
          "Authentic Khmer food in Siem Reap?",
        ],
        Battambang: [
          "Is the Bamboo Train worth visiting?",
          "Top things to do in Battambang?",
          "How to get to Battambang from Siem Reap?",
          "Best places to eat in Battambang?",
        ],
      },
    };
  },
  computed: {
    visibleQuestions() {
      if (this.currentLocation && this.locationSuggestions[this.currentLocation]) {
        return this.locationSuggestions[this.currentLocation];
      }
      return this.showingAllQuestions ? this.allQuestions : this.allQuestions.slice(0, 4);
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.handleDrag, { passive: false });
    document.addEventListener("mouseup", this.stopDrag, { passive: true });
    document.addEventListener("touchmove", this.handleDrag, { passive: false });
    document.addEventListener("touchend", this.stopDrag, { passive: true });
    window.addEventListener("orientationchange", this.handleOrientationChange);
    window.addEventListener("resize", this.handleResize);
    setTimeout(() => {
      if (!this.isChatbotActive && !localStorage.getItem("chatbotDismissed")) {
        this.isChatbotActive = true;
      }
    }, 5000);
  },
  beforeUnmount() {
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchmove", this.handleDrag);
    document.removeEventListener("touchend", this.stopDrag);
    window.removeEventListener("orientationchange", this.handleOrientationChange);
    window.removeEventListener("resize", this.handleResize);
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
    }
    this.removeBodyScrollLock();
  },
  methods: {
    handleButtonClick(e) {
      if (this.dragStarted) {
        e.preventDefault();
        return;
      }
      this.toggleChatbot();
    },
    toggleChatbot() {
      this.isChatbotActive = !this.isChatbotActive;
      if (this.isChatbotActive) {
        this.applyBodyScrollLock();
      } else {
        this.removeBodyScrollLock();
      }
      if (this.isChatbotActive) {
        this.$nextTick(() => {
          this.scrollToBottom();
          if (window.innerWidth > 768 && this.$refs.messageInput) {
            this.$refs.messageInput.focus();
          }
        });
      }
    },
    closeChatbot() {
      this.isChatbotActive = false;
      this.removeBodyScrollLock();
      localStorage.setItem("chatbotDismissed", "true");
    },
    applyBodyScrollLock() {
      if (window.innerWidth <= 768) {
        this.scrollY = window.scrollY;
        document.body.classList.add("chatbot-open");
        document.body.style.position = "fixed";
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
      }
    },
    removeBodyScrollLock() {
      if (document.body.classList.contains("chatbot-open")) {
        document.body.classList.remove("chatbot-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        if (window.innerWidth <= 768) {
          window.scrollTo(0, this.scrollY);
        }
      }
    },

    startDrag(e) {
      if (e.touches && e.touches.length > 1) return;
      this.isDragging = true;
      this.dragStarted = false;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const button = document.getElementById("chatbotButton");
      const rect = button.getBoundingClientRect();
      this.dragOffset = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      button.style.transition = "none";
      this.dragTimeout = setTimeout(() => {
        if (this.isDragging) {
          this.dragStarted = true;
        }
      }, 200);
      if (e.touches) {
        e.preventDefault();
      }
    },

    handleDrag(e) {
      if (!this.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!this.dragStarted) {
        const moveThreshold = 10;
        const deltaX = Math.abs(
          clientX -
            (this.dragOffset.x +
              parseInt(document.getElementById("chatbotButton").style.left || 0))
        );
        const deltaY = Math.abs(
          clientY -
            (this.dragOffset.y +
              parseInt(document.getElementById("chatbotButton").style.top || 0))
        );
        if (deltaX > moveThreshold || deltaY > moveThreshold) {
          this.dragStarted = true;
        }
      }
      if (this.dragStarted) {
        const button = document.getElementById("chatbotButton");
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;
        let newX = clientX - this.dragOffset.x;
        let newY = clientY - this.dragOffset.y;
        const safeAreaTop = 20;
        const safeAreaBottom = 80;
        const safeAreaSides = 20;
        newX = Math.max(
          safeAreaSides,
          Math.min(newX, window.innerWidth - buttonWidth - safeAreaSides)
        );
        newY = Math.max(
          safeAreaTop,
          Math.min(newY, window.innerHeight - buttonHeight - safeAreaBottom)
        );
        button.style.left = newX + "px";
        button.style.top = newY + "px";
        button.style.right = "auto";
        button.style.bottom = "auto";
        if (e.touches) {
          e.preventDefault();
        }
      }
    },

    stopDrag() {
      if (this.dragTimeout) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
      }
      const wasClick = this.isDragging && !this.dragStarted;
      this.isDragging = false;
      const button = document.getElementById("chatbotButton");
      if (button) {
        button.style.transition = "all 0.3s ease";
      }
      if (wasClick) {
        this.toggleChatbot();
      }
      setTimeout(() => {
        this.dragStarted = false;
      }, 50);
    },

    handleOrientationChange() {
      setTimeout(() => {
        const button = document.getElementById("chatbotButton");
        if (button) {
          const rect = button.getBoundingClientRect();
          if (
            rect.right > window.innerWidth ||
            rect.bottom > window.innerHeight ||
            rect.left < 0 ||
            rect.top < 0
          ) {
            button.style.right = "20px";
            button.style.bottom = "20px";
            button.style.left = "auto";
            button.style.top = "auto";
          }
        }
        if (this.isChatbotActive) {
          this.removeBodyScrollLock();
          this.$nextTick(() => {
            this.applyBodyScrollLock();
          });
        }
      }, 300);
    },

    handleResize() {
      if (this.isChatbotActive) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    toggleQuestions() {
      this.showingAllQuestions = !this.showingAllQuestions;
    },

    selectLocation(location) {
      this.currentLocation = location;
      this.inputPlaceholder = `Ask about ${location}...`;
      const locationMessages = {
        "Phnom Penh":
          "Great choice! Phnom Penh is Cambodia's vibrant capital with rich history, beautiful architecture, and amazing food. What would you like to know about Phnom Penh?",
        "Siem Reap":
          "Excellent! Siem Reap is home to the magnificent Angkor temples, Cambodia's most famous attraction. What would you like to know about Siem Reap?",
        Battambang:
          "Wonderful! Battambang offers a more authentic Cambodian experience with fewer tourists, colonial architecture, and the famous Bamboo Train. What would you like to know about Battambang?",
      };

      this.addBotMessage(locationMessages[location], this.locationSuggestions[location]);
    },

    handleQuickQuestion(question) {
      this.addMessage(question, true);
      this.processBotResponse(question);
    },

    sendMessage() {
      const message = this.userInput.trim();
      if (message && !this.isTyping) {
        this.addMessage(message, true);
        this.userInput = "";
        this.processBotResponse(message);
      }
    },

    addMessage(text, isUser) {
      this.messages.push({
        text,
        isUser,
        timestamp: new Date().getTime(),
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    addBotMessage(text, suggestions = []) {
      this.messages.push({
        text,
        isUser: false,
        suggestions,
        timestamp: new Date().getTime(),
      });
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    processBotResponse(userMessage) {
      this.isTyping = true;
      this.conversationContext.push({
        role: "user",
        content: userMessage,
      });
      axios
        .post("/api/web/view/chatbot", {
          message: userMessage,
          context: this.conversationContext,
          location: this.currentLocation,
        })
        .then((response) => {
          setTimeout(() => {
            this.isTyping = false;
            this.addBotMessage(response.data.message, response.data.suggestions || []);
            this.conversationContext.push({
              role: "assistant",
              content: response.data.message,
            });
            if (this.conversationContext.length > 10) {
              this.conversationContext = this.conversationContext.slice(-10);
            }
          }, 1000 + Math.random() * 1000);
        })
        .catch((error) => {
          setTimeout(() => {
            this.isTyping = false;
            this.addBotMessage(
              "I'm sorry, I'm having trouble connecting right now. Please try again later or ask another question.",
              [
                "Cambodia visa info?",
                "Best time to visit Cambodia?",
                "Cambodian cultural customs?",
              ]
            );
            console.error("Error processing message:", error);
          }, 1000);
        });
    },

    formatBotMessage(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      });
    },
  },
};
</script>

<style scoped>
:root {
  --primary-color: #ff6b35;
  --secondary-color: #2ec4b6;
  --accent-color: #ffcb05;
  --dark-color: #20283d;
  --light-color: #f7fff7;
  --shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  --border-radius: 16px;
}

:global(body.chatbot-open) {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}

.iconchatbot {
  width: 55px;
  height: 55px;
}

.chatbot-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 64px;
  height: 64px;
  background-color: #00ab9a;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  z-index: 9999;
  transition: all 0.3s ease;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  border: none;
  outline: none;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--primary-color);
  opacity: 0.6;
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.chatbot-button:hover {
  background-color: var(--accent-color);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.chatbot-button:active {
  transform: scale(0.95);
}

.chatbot-button i {
  font-size: 24px;
  pointer-events: none;
  z-index: 1;
  position: relative;
}

.chatbot-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 650px;
  max-width: 90vw;
  max-height: 90vh;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: none;
  flex-direction: column;
  overflow: hidden;
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.chatbot-container.active {
  display: flex;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.chatbot-header {
  background-color: #2ec4b5;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  animation: float 3s infinite ease-in-out;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.chatbot-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  line-height: 0.8;
  transition: transform 0.2s;
  padding: 5px;
  border-radius: 50%;
}

.close-btn:hover {
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.1);
}

.chatbot-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: var(--light-color);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-blend-mode: overlay;
  background-opacity: 0.1;
  scrollbar-width: thin;
  scrollbar-color: #ddd #f5f5f5;
  -webkit-overflow-scrolling: touch;
}

.chatbot-messages::-webkit-scrollbar {
  width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 10px;
}

.message {
  margin-bottom: 18px;
  max-width: 85%;
  display: flex;
  flex-direction: column;
}

.message-content {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.message-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.bot-message .message-content {
  background-color: white;
  color: var(--dark-color);
  border-top-left-radius: 5px;
  align-self: flex-start;
  border-left: 3px solid var(--secondary-color);
}

.user-message .message-content {
  background-color: var(--primary-color);
  color: white;
  border-top-right-radius: 5px;
  align-self: flex-end;
}

.bot-indicator {
  margin-right: 10px;
  flex-shrink: 0;
}

.guide-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--secondary-color);
}

.welcome-message {
  margin-bottom: 15px;
}

.welcome-message p {
  margin: 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--dark-color);
}

.location-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 18px 0;
}

.location-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  width: calc(33.33% - 8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.location-card:active {
  transform: scale(0.98);
}

.location-image {
  height: 120px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: #ddd;
}

.location-image::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.location-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.location-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.location-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark-color);
}

.phnom-penh-img {
  background-image: url("../../assets/locations/phnom-penh.jpg");
}

.siem-reap-img {
  background-image: url("../../assets/locations/siem-reap.jpg");
}

.battambang-img {
  background-image: url("../../assets/locations/battambang.jpg");
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.quick-question {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.quick-question:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quick-question:active {
  transform: scale(0.98);
  background-color: var(--primary-color);
  color: white;
}

.show-more-btn {
  background-color: transparent;
  color: var(--secondary-color);
  border: none;
  padding: 5px;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  margin-top: 8px;
  font-weight: 500;
  transition: color 0.2s;
}

.show-more-btn:hover {
  color: var(--primary-color);
}

.message-suggestions {
  margin-top: 10px;
  margin-left: 25px;
}

.suggestion-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  margin-left: 5px;
  font-style: italic;
}

.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-button {
  background-color: rgba(46, 196, 182, 0.1);
  color: var(--secondary-color);
  border: 1px solid rgba(46, 196, 182, 0.3);
  border-radius: 15px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-button:hover {
  background-color: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
  transform: translateY(-2px);
}

.suggestion-button:active {
  transform: scale(0.98);
  background-color: var(--secondary-color);
  color: white;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 15px;
  max-width: 100px;
  margin-bottom: 15px;
  background-color: white;
  border-radius: 18px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: var(--primary-color);
  border-radius: 50%;
  opacity: 0.6;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Input area */
.chatbot-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: white;
  position: relative;
  z-index: 1;
}

.chatbot-input input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 15px;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chatbot-input input:focus {
  box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.15);
}

.chatbot-input button {
  margin-left: 10px;
  padding: 0 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.chatbot-input button:hover:not(:disabled) {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.chatbot-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
  transform: none;
}

.send-icon {
  margin-right: 5px;
}

.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  z-index: 9999;
  display: none;
  backdrop-filter: blur(8px);
  transition: opacity 0.3s;
}

.chatbot-overlay.active {
  display: block;
  animation: fadeOverlay 0.4s ease;
}

@keyframes fadeOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message-transition-enter-active,
.message-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.message-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.message-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.bot-content {
  line-height: 1.6;
}

.bot-content a {
  color: var(--secondary-color);
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}

.bot-content a:hover {
  color: var(--primary-color);
  text-decoration: none;
}
@media (max-width: 768px) {
  .chatbot-button {
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }

  .iconchatbot {
    width: 50px;
    height: 50px;
  }
  .chatbot-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    transform: none;
    z-index: 10000;
  }

  .chatbot-container.active {
    display: flex;
    animation: slideInMobile 0.3s ease;
  }

  @keyframes slideInMobile {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chatbot-overlay {
    z-index: 9999;
  }

  .chatbot-header {
    border-radius: 0;
    padding: 15px;
    padding-top: max(15px, env(safe-area-inset-top, 15px));
  }

  .chatbot-header h3 {
    font-size: 18px;
  }

  .header-logo {
    width: 28px;
    height: 28px;
  }

  .chatbot-messages {
    padding: 10px;
    padding-left: max(10px, env(safe-area-inset-left, 10px));
    padding-right: max(10px, env(safe-area-inset-right, 10px));
  }
  .location-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
  }

  .location-card {
    width: 100%;
    flex-direction: row;
    height: 80px;
    margin-bottom: 0;
  }

  .location-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

  .location-info {
    flex: 1;
    padding: 15px;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  }

  .location-name {
    font-size: 16px;
    text-align: left;
  }
  .chatbot-input {
    padding: 15px;
    padding-bottom: max(15px, env(safe-area-inset-bottom, 15px));
  }

  .chatbot-input input {
    padding: 12px 16px;
    font-size: 16px;
    border-radius: 20px;
  }

  .chatbot-input button {
    margin-left: 8px;
    padding: 0 16px;
    min-width: 60px;
    border-radius: 20px;
  }

  .message {
    margin-bottom: 15px;
    max-width: 90%;
  }

  .message-content {
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.4;
  }

  .bot-indicator {
    margin-right: 8px;
  }

  .guide-avatar {
    width: 25px;
    height: 25px;
  }

  .quick-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 10px 0;
  }

  .quick-question {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 15px;
    flex: 1;
    min-width: calc(50% - 3px);
    text-align: center;
  }

  .suggestion-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .suggestion-button {
    padding: 6px 10px;
    font-size: 11px;
    flex: 1;
    min-width: calc(50% - 2.5px);
    text-align: center;
  }

  .message-suggestions {
    margin-left: 15px;
  }
}

@media (max-width: 480px) {
  .chatbot-button {
    width: 55px;
    height: 55px;
    bottom: 15px;
    right: 15px;
  }

  .iconchatbot {
    width: 45px;
    height: 45px;
  }

  .chatbot-header {
    padding: 12px 15px;
    padding-top: max(12px, env(safe-area-inset-top, 12px));
  }

  .chatbot-header h3 {
    font-size: 16px;
  }

  .header-logo {
    width: 24px;
    height: 24px;
  }

  .chatbot-messages {
    padding: 8px;
  }

  .message-content {
    padding: 8px 12px;
    font-size: 13px;
  }

  .location-card {
    height: 70px;
  }

  .location-image {
    width: 70px;
    height: 70px;
  }

  .location-info {
    padding: 10px;
  }

  .location-name {
    font-size: 14px;
  }

  .quick-question {
    padding: 6px 10px;
    font-size: 11px;
  }

  .chatbot-input {
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
  }

  .chatbot-input input {
    padding: 10px 14px;
    font-size: 16px;
  }

  .chatbot-input button {
    padding: 0 12px;
    min-width: 50px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .chatbot-button:active {
    transform: scale(0.95);
  }

  .quick-question:active,
  .suggestion-button:active,
  .location-card:active {
    transform: scale(0.98);
    background-color: var(--primary-color);
    color: white;
  }

  .close-btn:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

@supports (-webkit-touch-callout: none) {
  .chatbot-container {
    height: -webkit-fill-available;
  }

  .chatbot-input input {
    font-size: 16px;
  }
}

@media (max-width: 768px) and (orientation: landscape) {
  .location-cards {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .location-card {
    width: calc(50% - 5px);
    height: 60px;
  }

  .location-image {
    width: 60px;
    height: 60px;
  }

  .chatbot-messages {
    padding: 5px 10px;
  }

  .chatbot-input {
    padding: 10px 15px;
  }
}
</style>
