<template>
  <div class="confirmation-container">
    <div class="confirmation-content">
      <div class="confirmation-header">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1>Ordering Confirmed!</h1>
        <p>
          Thank you for your Ordering. We've received your order and will process it right
          away.
        </p>
      </div>

      <div class="order-details">
        <div class="order-number">
          <span>Order Number:</span>
          <strong>{{ orderId }}</strong>
        </div>

        <!-- <div class="confirmation-message">
          <p>
            A confirmation email has been sent to <strong>{{ email }}</strong> with all
            your Ordering details.
          </p>
        </div> -->
      </div>

      <div class="next-steps">
        <h2>What's Next?</h2>
        <div class="steps-container">
          <div class="step">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="step-content">
              <h3>Prepare for Your Trip</h3>
              <p>
                Make sure your travel documents are ready and check our travel guides for
                useful tips.
              </p>
            </div>
          </div>

          <div class="step">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="step-content">
              <h3>Meet Your Guide</h3>
              <p>
                Our travel guide will contact you a few days before your trip with
                specific details.
              </p>
            </div>
          </div>

          <div class="step">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="step-content">
              <h3>Enjoy Your Tour</h3>
              <p>Get ready for an amazing experience exploring the beauty of Cambodia!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="recommended-items">
        <h2>You Might Also Like</h2>
        <div class="recommended-grid">
          <div v-for="item in recommendedTours" :key="item.id" class="recommended-item">
            <router-link :to="`/product-detail/${item.id}`" class="tour-card">
              <div class="tour-image">
                <img :src="item.image" :alt="item.name" @error="handleImageError" />
              </div>
              <div class="tour-info">
                <h3>{{ item.name }}</h3>
                <div class="tour-meta">
                  <span class="tour-price">${{ item.price }}</span>
                  <span class="tour-duration">{{ item.duration }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="confirmation-actions">
        <router-link to="/" class="home-btn">Return to Home</router-link>
        <router-link to="/product" class="browse-more-btn">Browse More Tours</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
// const globalStore = useGlobalStore();
const orderId = ref(route.query.order_id || "ORD-123456");
const userEmail = ref("");
// const email = computed(() => {
//   if (globalStore.getIsAuthenticated && globalStore.profile?.email) {
//     return globalStore.profile.email;
//   }
//   return userEmail.value || "your email address";
// });
const recommendedTours = ref([
  {
    id: 1,
    name: "Angkor Wat Sunrise Tour",
    price: 79,
    duration: "1 Day",
    image: "https://placehold.co/300x200/19ADCF/ffffff?text=Angkor+Wat+Sunrise",
  },
  {
    id: 2,
    name: "Phnom Penh City Tour",
    price: 59,
    duration: "1 Day",
    image: "https://placehold.co/300x200/19ADCF/ffffff?text=Phnom+Penh+City",
  },
  {
    id: 3,
    name: "Tonle Sap Lake Cruise",
    price: 65,
    duration: "5 Hours",
    image: "https://placehold.co/300x200/19ADCF/ffffff?text=Tonle+Sap+Lake",
  },
]);

const placeholderImage = "https://placehold.co/300x200/19ADCF/ffffff?text=Cambodia+Tour";

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

onMounted(() => {
  if (!route.query.order_id && !localStorage.getItem("lastOrderId")) {
    console.log("No order ID found, redirecting to home");
    router.push("/");
    return;
  }
  if (!route.query.order_id && localStorage.getItem("lastOrderId")) {
    orderId.value = localStorage.getItem("lastOrderId");
  }
  const storedEmail = localStorage.getItem("checkoutEmail");
  if (storedEmail) {
    userEmail.value = storedEmail;
  }
  fetchRecommendedTours();
});

const fetchRecommendedTours = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error fetching recommended tours:", error);
  }
};
</script>

<style>
.confirmation-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.confirmation-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: #e8f5e9;
  color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon svg {
  width: 40px;
  height: 40px;
  stroke: currentColor;
}

.confirmation-header h1 {
  color: #4caf50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.confirmation-header p {
  color: #616161;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.order-details {
  text-align: center;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.order-number {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.order-number strong {
  margin-left: 0.5rem;
  color: #19adcf;
  font-weight: 700;
}

.confirmation-message p {
  margin: 0;
  color: #616161;
}

.next-steps {
  margin-bottom: 3rem;
}

.next-steps h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.step-icon {
  width: 50px;
  height: 50px;
  background-color: #e1f5fa;
  color: #19adcf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.step-icon svg {
  width: 25px;
  height: 25px;
  stroke: currentColor;
}

.step-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}

.step-content p {
  margin: 0;
  color: #616161;
  font-size: 0.95rem;
}

.recommended-items {
  margin-bottom: 3rem;
}

.recommended-items h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.recommended-item {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommended-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.tour-card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.tour-image {
  height: 200px;
  overflow: hidden;
}

.tour-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.tour-card:hover .tour-image img {
  transform: scale(1.05);
}

.tour-info {
  padding: 1.25rem;
  background-color: white;
}

.tour-info h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #333;
}

.tour-meta {
  display: flex;
  justify-content: space-between;
  color: #757575;
  font-size: 0.9rem;
}

.tour-price {
  font-weight: 700;
  color: #19adcf;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.home-btn,
.browse-more-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.home-btn {
  background-color: #f5f5f5;
  color: #424242;
  border: 1px solid #e0e0e0;
}

.home-btn:hover {
  background-color: #e0e0e0;
}

.browse-more-btn {
  background-color: #19adcf;
  color: white;
}

.browse-more-btn:hover {
  background-color: #148da8;
}

@media (max-width: 768px) {
  .steps-container {
    grid-template-columns: 1fr;
  }

  .recommended-grid {
    grid-template-columns: 1fr;
  }

  .confirmation-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .home-btn,
  .browse-more-btn {
    text-align: center;
  }
}
</style>
