<template>
  <div>
    <!-- Floating chatbot button with travel icon -->
    <div
      class="chatbot-button"
      id="chatbotButton"
      @mousedown="startDrag"
      @touchstart="startDrag"
      @click="toggleChatbot"
    >
      <div class="pulse-ring"></div>
      <i><img class="iconchatbot" src="https://cdn-icons-png.flaticon.com/512/6008/6008363.png" alt="Travel Assistant" /></i>
    </div>

    <!-- Chatbot overlay with blurred travel background -->
    <div
      class="chatbot-overlay"
      id="chatbotOverlay"
      :class="{ active: isChatbotActive }"
      @click="closeChatbot"
    ></div>

    <!-- Chatbot container -->
    <div
      class="chatbot-container"
      id="chatbotContainer"
      :class="{ active: isChatbotActive }"
    >
      <div class="chatbot-header">
        <div class="header-content">
          <img class="header-logo" src="../../assets/icons/robot.png" alt="Cambodia Icon" />
          <h3>Camtour Assistant</h3>
        </div>
        <button class="close-btn" @click="closeChatbot">&times;</button>
      </div>

      <div class="chatbot-messages" id="chatbotMessages" ref="messagesContainer">
        <!-- Welcome message with photo cards -->
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

        <!-- Message history -->
        <transition-group name="message-transition">
          <div
            v-for="(message, index) in messages"
            :key="'msg-' + index"
            class="message"
            :class="message.isUser ? 'user-message' : 'bot-message'"
          >
            <div class="message-content">
              <span v-if="!message.isUser" class="bot-indicator">
                <img src="../../assets/icons/guide-avatar.png" alt="Guide" class="guide-avatar" />
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

            <!-- Suggested follow-ups after bot messages with travel icons -->
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

        <!-- Typing indicator with custom animation -->
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
        />
        <button @click="sendMessage" :disabled="isTyping || !userInput.trim()">
          <span v-if="!isTyping">
            <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
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
      dragOffset: { x: 0, y: 0 },
      showingAllQuestions: false,
      isTyping: false,
      conversationContext: [],
      currentLocation: null,
      inputPlaceholder: "Ask about Camtour...",
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
    // Add event listeners for dragging
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.stopDrag);
    document.addEventListener("touchmove", this.handleDrag);
    document.addEventListener("touchend", this.stopDrag);

    // Set a timeout to automatically open chatbot after 5 seconds
    setTimeout(() => {
      if (!this.isChatbotActive && !localStorage.getItem("chatbotDismissed")) {
        this.isChatbotActive = true;
      }
    }, 5000);
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchmove", this.handleDrag);
    document.removeEventListener("touchend", this.stopDrag);
  },
  methods: {
    toggleChatbot() {
      if (!this.isDragging) {
        this.isChatbotActive = !this.isChatbotActive;

        // If this is the first time opening the chat, scroll to the bottom
        if (this.isChatbotActive && this.messages.length === 0) {
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      }
    },
    closeChatbot() {
      this.isChatbotActive = false;
      localStorage.setItem("chatbotDismissed", "true");
    },
    startDrag(e) {
      this.isDragging = true;
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;

      const button = document.getElementById("chatbotButton");
      const rect = button.getBoundingClientRect();

      this.dragOffset = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };

      button.style.transition = "none";
      e.preventDefault();
    },
    handleDrag(e) {
      if (!this.isDragging) return;

      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;

      const button = document.getElementById("chatbotButton");
      const buttonWidth = button.offsetWidth;
      const buttonHeight = button.offsetHeight;

      let newX = clientX - this.dragOffset.x;
      let newY = clientY - this.dragOffset.y;

      // Constrain to window boundaries
      newX = Math.max(0, Math.min(newX, window.innerWidth - buttonWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - buttonHeight));

      button.style.left = newX + "px";
      button.style.top = newY + "px";

      if (e.touches) {
        e.preventDefault();
      }
    },
    stopDrag() {
      this.isDragging = false;
      const button = document.getElementById("chatbotButton");
      button.style.transition = "all 0.3s ease";
    },
    toggleQuestions() {
      this.showingAllQuestions = !this.showingAllQuestions;
    },
    selectLocation(location) {
      this.currentLocation = location;
      this.inputPlaceholder = `Ask about ${location}...`;

      // Add a bot message about the selected location
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
      // Start typing animation
      this.isTyping = true;

      // Add this message to the conversation context
      this.conversationContext.push({
        role: "user",
        content: userMessage,
      });

      // Call the backend API
      axios
        .post("/api/web/view/chatbot", {
          message: userMessage,
          context: this.conversationContext,
          location: this.currentLocation,
        })
        .then((response) => {
          // Add a small delay to simulate typing
          setTimeout(() => {
            this.isTyping = false;

            // Add the bot's response to messages
            this.addBotMessage(response.data.message, response.data.suggestions || []);

            // Add to conversation context
            this.conversationContext.push({
              role: "assistant",
              content: response.data.message,
            });

            // Limit context size to prevent it from growing too large
            if (this.conversationContext.length > 10) {
              this.conversationContext = this.conversationContext.slice(-10);
            }
          }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        })
        .catch((error) => {
          setTimeout(() => {
            this.isTyping = false;

            // Add error message
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
      // Convert URLs to clickable links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    },
  },
};
</script>

<style scoped>
/* Base styles with travel-themed variables */
:root {
  --primary-color: #FF6B35; /* Warm orange for travel theme */
  --secondary-color: #2EC4B6; /* Turquoise - representing water/beaches */
  --accent-color: #FFCB05; /* Sunny yellow - representing sunshine */
  --dark-color: #20283D; /* Deep blue for night sky */
  --light-color: #F7FFF7; /* Off-white for clean interface */
  --shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  --border-radius: 16px;
}

.iconchatbot {
  width: 55px;
  height: 55px;
}

/* Chatbot button with pulsing effect */
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
  cursor: move;
  box-shadow: var(--shadow);
  z-index: 1000;
  transition: all 0.3s ease;
  touch-action: none;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--primary-color);
  opacity: 0.6;
  animation: pulse 2s infinite;
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

.chatbot-button i {
  font-size: 24px;
  pointer-events: none;
  z-index: 1;
}

/* Chatbot container */
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
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 16px;
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

/* Chatbot header */
.chatbot-header {
  background-color: #2ec4b5;
  /* background-image: linear-gradient(to right, var(--primary-color)); */
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chatbot-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  line-height: 0.8;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* Messages container with travel-themed background */
.chatbot-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: var(--light-color);
  /* background-image: url('../../assets/bg/cambodia-map-bg.png'); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-blend-mode: overlay;
  background-opacity: 0.1;
  scrollbar-width: thin;
  scrollbar-color: #ddd #f5f5f5;
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

/* Message styling */
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
}

/* .guide-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--secondary-color);
} */

/* Welcome message styling with photo cards */
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
  width: calc(33.33% - 10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.location-image {
  height: 120px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.location-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
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

/* Location images - replace with actual images */
.phnom-penh-img {
  background-image: url('../../assets/locations/phnom-penh.jpg');
}

.siem-reap-img {
  background-image: url('../../assets/locations/siem-reap.jpg');
}

.battambang-img {
  background-image: url('../../assets/locations/battambang.jpg');
}

/* Quick questions styling */
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

/* Suggestions after bot messages */
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
  border-color: var(--secondary-color);
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
}

.chatbot-input button:hover:not(:disabled) {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.chatbot-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.send-icon {
  margin-right: 5px;
}

/* Overlay with blurred travel background */
.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  /* background-image: url('../../assets/bg/cambodia-bg.jpg'); */
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  z-index: 1000;
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

/* Message transitions */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .chatbot-container {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    top: 0;
    left: 0;
    transform: none;
  }

  .location-card {
    width: 100%;
    margin-bottom: 10px;
  }

  .location-image {
    height: 100px;
  }

  .chatbot-header {
    border-radius: 0;
  }
}

/* Additional travel-themed styling */
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

/* Custom content styling - add travel icons to specific content */
.bot-content:contains("hotel"), 
.bot-content:contains("stay") {
  background-image: url('../../assets/icons/hotel-icon.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 20px;
  padding-right: 25px;
}

.bot-content:contains("food"),
.bot-content:contains("restaurant") {
  background-image: url('../../assets/icons/food-icon.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 20px;
  padding-right: 25px;
}

.bot-content:contains("temple"),
.bot-content:contains("Angkor") {
  background-image: url('../../assets/icons/temple-icon.png');
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 20px;
  padding-right: 25px;
}

/* Add a subtle pattern to the chatbot container */
.chatbot-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-image: url('../../assets/patterns/cambodia-pattern.png'); */
  background-repeat: repeat;
  background-size: 200px;
  opacity: 0.03;
  pointer-events: none;
  z-index: -1;
}
</style>