<template>
  <div class="detail-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{{ t('loading-location-details') }}</p>
    </div>
    <div v-else-if="errorMessage" class="error-container">
      <div class="error-card">
        <h2>{{ t('error-loading-location') }}</h2>
        <p>{{ errorMessage }}</p>
        <button @click="fetchLocationDetail" class="retry-btn">{{ t('try-again') }}</button>
      </div>
    </div>
    <div v-else-if="location">
      <div class="detail-hero-section">
        <!-- <div class="breadcrumb fade-in">
          <router-link to="/">{{ t('home') }}</router-link> &gt;
          <router-link to="/">{{ t('hiking') }}</router-link> &gt;
          <span>{{ getLocalizedLocationName(location) }}</span>
        </div> -->

        <div v-if="location.photos && location.photos.length > 0" class="hero-carousel">
          <div ref="carouselInner" class="carousel-inner">
            <div
              v-for="(photo, index) in location.photos"
              :key="index"
              class="carousel-item"
              :class="{ active: currentSlide === index }"
            >
              <img
                :src="photo.photo_url"
                :alt="`${getLocalizedLocationName(location)} - ${t('photo')} ${index + 1}`"
                @error="handleImageError"
              />
            </div>
          </div>
          <div class="carousel-controls fade-in">
            <button class="carousel-control prev" @click="prevSlide">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button class="carousel-control next" @click="nextSlide">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <div class="carousel-indicators">
            <button
              v-for="(photo, index) in location.photos"
              :key="index"
              class="indicator-dot"
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"
            ></button>
          </div>
          <div class="hero-overlay">
            <div class="hero-content slide-up">
              <div class="location-category">
                {{ getLocalizedCategoryName(location.category) }}
              </div>
              <h1 class="location-title">{{ getLocalizedLocationName(location) }}</h1>
              <h2 class="location-subtitle khmer-font">{{ getLocalizedLocationDescription(location) }}</h2>
              <div class="location-meta">
                <div class="location-rating">
                  <div class="star">★</div>
                  <div class="rating-score">{{ averageRating }}</div>
                  <div class="review-count">({{ location.total_view || 0 }} {{ t('views') }})</div>
                </div>
                <div class="location-address">
                  <span>{{ formatLocalizedAddress(location) }}</span>
                </div>
                <div v-if="location.tags && location.tags.length" class="location-tags">
                  <div v-for="tag in location.tags" :key="tag.id" class="tag">
                    {{ getLocalizedTagName(tag) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="hero-carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                :src="location.is_thumbnail || placeholderImage"
                :alt="getLocalizedLocationName(location)"
                @error="handleImageError"
              />
            </div>
          </div>
          <div class="hero-overlay">
            <div class="hero-content slide-up">
              <div class="location-category">
                {{ getLocalizedCategoryName(location.category) }}
              </div>
              <h1 class="location-title">{{ getLocalizedLocationName(location) }}</h1>
              <h2 class="location-subtitle khmer-font">{{ getLocalizedLocationDescription(location) }}</h2>
              <div class="location-meta">
                <div class="location-rating">
                  <div class="star">★</div>
                  <div class="rating-score">{{ averageRating }}</div>
                  <div class="review-count">({{ location.total_view || 0 }} {{ t('views') }})</div>
                </div>
                <div class="location-address">
                  <span>{{ formatLocalizedAddress(location) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-actions slide-up">
          <button class="action-btn favorite-btn" @click="toggleFavorite">
            <svg viewBox="0 0 24 24" :class="{ filled: isFavorite }">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
          </button>
          <button class="action-btn share-btn" @click="shareLocation">
            <svg viewBox="0 0 24 24">
              <path
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
              ></path>
            </svg>
            <span>{{ t('share') }}</span>
          </button>
          <a
            v-if="location.url_location"
            :href="location.url_location"
            target="_blank"
            class="action-btn map-btn"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              ></path>
            </svg>
            <span>{{ t('view-map') }}</span>
          </a>
        </div>
      </div>

      <div class="detail-content-container">
        <div class="detail-tabs fade-in">
          <button
            v-for="tab in getLocalizedTabs()"
            :key="tab.id"
            class="tab-btn-location"
            :class="{ active: activeTab === tab.id }"
            @click="switchTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="detail-content-section">
          <div
            v-if="activeTab === 'overview'"
            class="tab-content overview-section slide-up"
          >
            <div class="section-row">
              <div class="content-column">
                <div class="content-card">
                  <div class="content-header">
                    <h3>{{ t('about-this-location') }}</h3>
                  </div>
                  <div class="content-body">
                    <p class="location-description">
                      {{ getLocalizedDescription(location) }}
                    </p>
                    <div class="location-short-desc">
                      {{ getLocalizedShortDescription(location) }}
                    </div>

                    <!-- Key Information -->
                    <div class="key-info-grid">
                      <div class="key-info-item">
                        <div class="info-icon">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                            ></path>
                          </svg>
                        </div>
                        <div class="info-content">
                          <div class="info-label">{{ t('best-time-to-visit') }}</div>
                          <div class="info-value">
                            {{ t('year-round-recommended-season') }}
                          </div>
                        </div>
                      </div>

                      <div class="key-info-item">
                        <div class="info-icon">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                            ></path>
                          </svg>
                        </div>
                        <div class="info-content">
                          <div class="info-label">{{ t('category') }}</div>
                          <div class="info-value">
                            {{ getLocalizedCategoryName(location.category) }}
                          </div>
                        </div>
                      </div>

                      <div class="key-info-item">
                        <div class="info-icon">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            ></path>
                          </svg>
                        </div>
                        <div class="info-content">
                          <div class="info-label">{{ t('popularity') }}</div>
                          <div class="info-value">
                            {{ location.total_view || 0 }} {{ t('views') }}
                          </div>
                        </div>
                      </div>

                      <div class="key-info-item address">
                        <div class="info-icon">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            ></path>
                          </svg>
                        </div>
                        <div class="text-sm space-y-1 text-gray-700">
                          <div v-if="location?.village?.name">
                            <strong>{{ t('village') }}:</strong> {{ getLocalizedLocationName(location.village) }}
                          </div>
                          <div v-if="location?.commune?.name">
                            <strong>{{ t('commune') }}:</strong> {{ getLocalizedLocationName(location.commune) }}
                          </div>
                          <div v-if="location?.district?.name">
                            <strong>{{ t('district') }}:</strong> {{ getLocalizedLocationName(location.district) }}
                          </div>
                          <div v-if="location?.province?.name">
                            <strong>{{ t('province') }}:</strong> {{ getLocalizedLocationName(location.province) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Map Section -->
                <div v-if="location.lat && location.lot" class="content-card">
                  <div class="content-header">
                    <h3>{{ t('location-map') }}</h3>
                  </div>
                  <div class="content-body">
                    <div class="location-map">
                      <iframe
                        :src="`https://www.google.com/maps?q=${location.lat},${location.lot}&hl=es;z=14&output=embed`"
                        width="100%"
                        height="400"
                        style="border: 0; border-radius: 8px"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                      ></iframe>

                      <div class="mt-2 text-sm text-gray-700">
                        <p>{{ t('latitude') }}: {{ location.lat }}</p>
                        <p>{{ t('longitude') }}: {{ location.lot }}</p>
                        <a
                          :href="
                            location.url_location ||
                            `https://maps.google.com/?q=${location.lat},${location.lot}`
                          "
                          target="_blank"
                          class="text-blue-600 hover:underline"
                        >
                          {{ t('open-in-google-maps') }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Photos Gallery -->
                <div
                  v-if="location.photos && location.photos.length > 0"
                  class="content-card"
                >
                  <div class="content-header">
                    <h3>{{ t('photo-gallery') }}</h3>
                  </div>
                  <div class="content-body">
                    <div class="photo-gallery">
                      <div
                        v-for="(photo, index) in location.photos"
                        :key="index"
                        class="gallery-item"
                        @click="openLightbox(index)"
                      >
                        <img
                          :src="photo.photo_url"
                          :alt="`${getLocalizedLocationName(location)} - ${t('photo')} ${index + 1}`"
                          @error="handleImageError"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sidebar-column">
                <!-- User Reviews -->
                <div class="content-card sidebar-card">
                  <div class="content-header">
                    <h3>{{ t('reviews') }}</h3>
                  </div>
                  <div class="content-body">
                    <div class="rating-summary">
                      <div class="rating-big">
                        <span class="rating-number">{{ averageRating }}</span>
                        <div class="rating-stars">
                          <span
                            v-for="n in 5"
                            :key="n"
                            class="star-icon"
                            :class="{
                              filled: n <= Math.floor(averageRating),
                              half:
                                n === Math.ceil(averageRating) &&
                                !Number.isInteger(averageRating),
                            }"
                          ></span>
                        </div>
                        <span class="rating-count">
                          {{ location.total_view ? location.total_view : 0 }} {{ t('reviews') }}
                        </span>
                      </div>
                    </div>

                    <div
                      v-if="location.stars && location.stars.length > 0"
                      class="reviews-list"
                    >
                      <div
                        v-for="review in location.stars"
                        :key="review.id"
                        class="review-item"
                      >
                        <div class="review-header">
                          <div class="review-avatar">{{ review.id }}</div>
                          <div class="review-meta">
                            <div class="review-author">{{ review.rater_name }}</div>
                            <div class="review-rating">
                              <span v-for="n in 5" :key="n" class="star">
                                {{ n <= review.star ? "★" : "☆" }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="review-content">{{ review.comment }}</div>
                      </div>
                    </div>

                    <div v-else class="empty-reviews">
                      <p>{{ t('no-reviews-yet') }}</p>
                    </div>

                    <!-- Review Section -->
                    <div class="review-section">
                      <!-- Review Button -->
                      <button @click="toggleReviewForm" class="review-btn">
                        {{ t('write-a-review') }}
                      </button>

                      <!-- Review Form Dropdown -->
                      <div v-if="showReviewForm" class="review-form-dropdown">
                        <div class="star-rating">
                          <div class="rating-label">{{ t('your-rating') }}:</div>
                          <div class="stars-container">
                            <span
                              v-for="n in 5"
                              :key="n"
                              class="star"
                              :class="{ active: n <= rating }"
                              @click="rating = n"
                            >
                              {{ n <= rating ? "★" : "☆" }}
                            </span>
                          </div>
                        </div>

                        <div class="comment-input">
                          <textarea
                            v-model="comment"
                            :placeholder="t('share-your-experience')"
                            rows="3"
                          ></textarea>
                        </div>

                        <div class="form-actions">
                          <button
                            class="submit-review-btn"
                            @click="submitReview"
                            :disabled="isSubmitting"
                          >
                            <span v-if="isSubmitting">{{ t('submitting') }}...</span>
                            <span v-else>{{ t('submit') }}</span>
                          </button>
                        </div>

                        <!-- Error message if any -->
                        <div v-if="reviewError" class="error-message">
                          {{ reviewError }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Weather Widget -->
                <div class="content-card sidebar-card">
                  <div class="content-header">
                    <h3>{{ t('weather') }}</h3>
                  </div>
                  <div class="content-body">
                    <div class="weather-widget">
                      <div class="weather-current">
                        <div class="weather-icon">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.79-1.41-1.41-1.79 1.79z"
                            ></path>
                          </svg>
                        </div>
                        <div class="weather-info">
                          <div class="weather-temp">32°C</div>
                          <div class="weather-desc">{{ t('sunny') }}</div>
                          <div class="weather-location">
                            {{ getLocalizedLocationName(location.district) || t('cambodia') }}
                          </div>
                        </div>
                      </div>
                      <div class="weather-forecast">
                        <div class="forecast-day">
                          <div class="day-name">{{ t('mon') }}</div>
                          <div class="day-icon">☀️</div>
                          <div class="day-temp">33°</div>
                        </div>
                        <div class="forecast-day">
                          <div class="day-name">{{ t('tue') }}</div>
                          <div class="day-icon">⛅</div>
                          <div class="day-temp">32°</div>
                        </div>
                        <div class="forecast-day">
                          <div class="day-name">{{ t('wed') }}</div>
                          <div class="day-icon">🌦️</div>
                          <div class="day-temp">31°</div>
                        </div>
                        <div class="forecast-day">
                          <div class="day-name">{{ t('thu') }}</div>
                          <div class="day-icon">🌧️</div>
                          <div class="day-temp">29°</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Related Destinations -->
                <div class="content-card sidebar-card">
                  <div class="content-header">
                    <h3>{{ t('nearby-places') }}</h3>
                  </div>
                  <div class="content-body">
                    <div class="nearby-places">
                      <div class="empty-nearby">
                        <p>
                          {{ t('explore-more-places-in') }}
                          {{ getLocalizedLocationName(location.province) || t('cambodia') }}!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Section -->
          <div
            v-if="activeTab === 'products'"
            class="tab-content products-section slide-up"
          >
            <div class="section-header-wrapper">
              <div class="header">{{ t('shopping') }}</div>
              <h2 class="title">{{ t('available-products') }}</h2>
              <p class="subtitle">{{ t('discover-amazing-products-from-location') }}</p>
            </div>

            <div
              v-if="location.products && location.products.length > 0"
              class="product-grid slide-right"
            >
              <div
                v-for="(product, index) in location.products"
                :key="`${product.product_id}-${product.color}-${index}`"
                class="product-card hover-float"
              >
                <router-link :to="`/product/detail/${product.product_id}`">
                  <div class="product-label sale">{{ t('sale') }}</div>
                  <img
                    :src="product.is_thumbnail || placeholderImage"
                    :alt="product.product_name"
                    class="product-image"
                    @error="handleImageError"
                  />
                  <div class="quick-action">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"
                      ></path>
                    </svg>
                  </div>
                  <div class="product-info">
                    <h3 class="product-brand">{{ product.product_name }}</h3>
                    <p class="product-name">
                      {{ product.color }} - {{ t('size') }} {{ product.size }}
                    </p>
                    <div class="product-price">
                      <span class="current-price">${{ product.price }}</span>
                    </div>
                    <p class="stock-info" :class="{ low: product.qty < 10 }">
                      {{ product.qty }} {{ t('in-stock') }}
                    </p>
                    <p class="product-category">
                      {{
                        product.color && product.color.toLowerCase() === "red"
                          ? t('featured')
                          : t('regular')
                      }}
                    </p>
                    <div class="rating-stars">
                      <span class="star-icon filled"></span>
                      <span class="star-icon filled"></span>
                      <span class="star-icon filled"></span>
                      <span class="star-icon filled"></span>
                      <span class="star-icon half"></span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-else class="empty-products">
              <div class="empty-icon"></div>
              <h3>{{ t('no-products-available') }}</h3>
              <p>{{ t('check-back-soon-products') }}</p>
            </div>
          </div>

          <!-- Activities Section -->
          <div
            v-if="activeTab === 'activities'"
            class="tab-content activities-section slide-up"
          >
            <div class="section-header-wrapper">
              <div class="header">{{ t('experiences') }}</div>
              <h2 class="title">{{ t('available-activities') }}</h2>
              <p class="subtitle">
                {{ t('explore-exciting-adventures-activities') }}
              </p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="activities-loading">
              <div class="loading-spinner"></div>
              <p>{{ t('loading-activities') }}</p>
            </div>

            <!-- Activities Grid -->
            <div
              v-else-if="
                location.active_travel_activities &&
                location.active_travel_activities.length > 0
              "
              class="activities-grid"
            >
              <div
                v-for="activity in location.active_travel_activities"
                :key="activity.id"
                class="activity-card"
              >
                <div class="activity-image">
                  <img
                    :src="activity.image || placeholderImage"
                    :alt="getLocalizedActivityName(activity)"
                    @error="handleImageError"
                  />
                  <div v-if="activity.is_active" class="activity-status active">
                    {{ t('available') }}
                  </div>
                </div>
                <div class="activity-content">
                  <h3 class="activity-title">{{ getLocalizedActivityName(activity) }}</h3>
                  <p class="activity-desc">
                    {{
                      getLocalizedActivityDescription(activity) ||
                      t('experience-amazing-activity-location')
                    }}
                  </p>
                  <div class="activity-details">
                    <div class="activity-duration">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                        />
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span
                        >{{ activity.duration_hours }}
                        {{ activity.duration_hours === 1 ? t('hour') : t('hours') }}</span
                      >
                    </div>
                    <div class="activity-difficulty">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"
                        />
                      </svg>
                      <span
                        class="difficulty-badge"
                        :class="getDifficultyClass(activity.difficulty_level)"
                      >
                        {{ getLocalizedDifficulty(activity.difficulty_level) }}
                      </span>
                    </div>
                    <div class="activity-price">
                      ${{ parseFloat(activity.price_per_person).toFixed(2) }}
                      <span class="currency">{{ activity.currency || "USD" }}</span>
                      <span class="per-person">{{ t('per-person') }}</span>
                    </div>
                  </div>

                  <!-- Additional Activity Info -->
                  <div v-if="activity.max_participants" class="activity-meta">
                    <div class="activity-capacity">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.42 1.42 0 0 0 18.6 7c-.8 0-1.54.5-1.85 1.26L14.59 15H16v7h4zm-12.5 0v-7.5h1.75L7.5 7H6c-1.1 0-2 .9-2 2v13h3.5zm3.5-13c.83 0 1.5-.67 1.5-1.5S11.83 6 11 6s-1.5.67-1.5 1.5S10.17 9 11 9z"
                        />
                      </svg>
                      <span>{{ t('max') }} {{ activity.max_participants }} {{ t('people') }}</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="activity-actions">
                    <button
                      class="btn-book-activity"
                      @click="bookActivity(activity)"
                      :disabled="!activity.is_active"
                    >
                      {{ activity.is_active ? t('book-now') : t('not-available') }}
                    </button>
                    <button
                      class="btn-activity-details"
                      @click="viewActivityDetails(activity)"
                    >
                      {{ t('view-details') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-activities">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"
                  />
                </svg>
              </div>
              <h3>{{ t('no-activities-available') }}</h3>
              <p>
                {{ t('no-activities-available-description') }}
              </p>
              <button class="btn-suggest-activity" @click="suggestActivity">
                {{ t('suggest-an-activity') }}
              </button>
            </div>

            <!-- Activity Detail Modal -->
            <div
              v-if="showActivityModal"
              class="activity-modal-overlay"
              @click="closeActivityModal"
            >
              <div class="activity-modal-content" @click.stop>
                <div class="modal-header">
                  <h3>{{ getLocalizedActivityName(selectedActivity) }}</h3>
                  <button class="modal-close" @click="closeActivityModal">&times;</button>
                </div>
                <div class="modal-body">
                  <div class="activity-modal-image">
                    <img
                      :src="selectedActivity?.image || placeholderImage"
                      :alt="getLocalizedActivityName(selectedActivity)"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="activity-modal-info">
                    <div class="modal-description">
                      <h4>{{ t('description') }}</h4>
                      <p>
                        {{
                          getLocalizedActivityDescription(selectedActivity) ||
                          t('experience-amazing-activity-professional-guides')
                        }}
                      </p>
                    </div>

                    <div class="modal-details-grid">
                      <div class="detail-item">
                        <strong>{{ t('duration') }}:</strong>
                        <span
                          >{{ selectedActivity?.duration_hours }}
                          {{
                            selectedActivity?.duration_hours === 1 ? t('hour') : t('hours')
                          }}</span
                        >
                      </div>
                      <div class="detail-item">
                        <strong>{{ t('difficulty') }}:</strong>
                        <span
                          :class="getDifficultyClass(selectedActivity?.difficulty_level)"
                        >
                          {{ getLocalizedDifficulty(selectedActivity?.difficulty_level) }}
                        </span>
                      </div>
                      <div class="detail-item">
                        <strong>{{ t('price') }}:</strong>
                        <span class="price-highlight">
                          ${{
                            parseFloat(selectedActivity?.price_per_person || 0).toFixed(2)
                          }}
                          {{ selectedActivity?.currency || "USD" }} {{ t('per-person') }}
                        </span>
                      </div>
                      <div v-if="selectedActivity?.max_participants" class="detail-item">
                        <strong>{{ t('max-participants') }}:</strong>
                        <span>{{ selectedActivity.max_participants }} {{ t('people') }}</span>
                      </div>
                    </div>

                    <!-- Included Items -->
                    <div
                      v-if="
                        selectedActivity?.included_items &&
                        selectedActivity.included_items.length > 0
                      "
                      class="modal-section"
                    >
                      <h4>{{ t('whats-included') }}</h4>
                      <ul class="included-list">
                        <li v-for="item in selectedActivity.included_items" :key="item">
                          <svg viewBox="0 0 24 24" class="check-icon">
                            <path
                              d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 6.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"
                            />
                          </svg>
                          {{ item }}
                        </li>
                      </ul>
                    </div>

                    <!-- Requirements -->
                    <div
                      v-if="
                        selectedActivity?.requirements &&
                        selectedActivity.requirements.length > 0
                      "
                      class="modal-section"
                    >
                      <h4>{{ t('requirements') }}</h4>
                      <ul class="requirements-list">
                        <li
                          v-for="requirement in selectedActivity.requirements"
                          :key="requirement"
                        >
                          <svg viewBox="0 0 24 24" class="info-icon">
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                            />
                          </svg>
                          {{ requirement }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn-book-modal"
                    @click="bookActivity(selectedActivity)"
                    :disabled="!selectedActivity?.is_active"
                  >
                    {{
                      selectedActivity?.is_active ? t('book-this-activity') : t('not-available')
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'tips'" class="tab-content tips-section slide-up">
            <div class="section-header-wrapper">
              <div class="header">{{ t('travel-guide') }}</div>
              <h2 class="title">{{ t('essential-travel-tips') }}</h2>
              <p class="subtitle">{{ t('make-most-visit-insider-tips') }}</p>
            </div>
            <div v-if="isLoadingGuide" class="tips-loading">
              <div class="loading-spinner"></div>
              <p>{{ t('loading-travel-guide') }}</p>
            </div>
            <div v-else-if="guideError" class="tips-error">
              <p>{{ guideError }}</p>
              <button @click="fetchLocationGuide" class="retry-btn">{{ t('try-again') }}</button>
            </div>
            <div v-else-if="locationGuide" class="tips-grid">
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
                    />
                    <path
                      d="M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('best-time-to-visit') }}</h3>
                <div class="tip-content">
                  <p>
                    {{ locationGuide.best_time_to_visit || t('information-not-available') }}
                  </p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('local-contacts') }}</h3>
                <div class="tip-content">
                  <p v-if="locationGuide.local_contacts">{{ t('important-local-numbers') }}:</p>
                  <ul v-if="locationGuide.local_contacts">
                    <li
                      v-for="(number, service) in locationGuide.local_contacts"
                      :key="service"
                    >
                      {{ service.replace(/([A-Z])/g, " $1").trim() }}: {{ number }}
                    </li>
                  </ul>
                  <p v-else>{{ t('contact-information-not-available') }}</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('currency-budget') }}</h3>
                <div class="tip-content">
                  <div v-if="locationGuide.currency_and_budget">
                    <p v-if="locationGuide.currency_and_budget.currency">
                      <strong>{{ t('currency') }}:</strong>
                      {{ locationGuide.currency_and_budget.currency }}
                    </p>
                    <p v-if="locationGuide.currency_and_budget.notes">
                      {{ locationGuide.currency_and_budget.notes }}
                    </p>
                    <p v-if="locationGuide.currency_and_budget.ATMs">
                      <strong>{{ t('atms') }}:</strong> {{ locationGuide.currency_and_budget.ATMs }}
                    </p>
                    <p v-if="locationGuide.currency_and_budget.budget">
                      <strong>{{ t('budget') }}:</strong>
                      {{ locationGuide.currency_and_budget.budget }}
                    </p>
                  </div>
                  <p v-else>{{ t('currency-budget-information-not-available') }}</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('local-transportation') }}</h3>
                <div class="tip-content">
                  <div v-if="locationGuide.local_transportation">
                    <p v-if="locationGuide.local_transportation.shortDistances">
                      <strong>{{ t('short-distances') }}:</strong>
                      {{ locationGuide.local_transportation.shortDistances }}
                    </p>
                    <p v-if="locationGuide.local_transportation.longDistances">
                      <strong>{{ t('long-distances') }}:</strong>
                      {{ locationGuide.local_transportation.longDistances }}
                    </p>
                    <p v-if="locationGuide.local_transportation.tip">
                      <strong>{{ t('tip') }}:</strong> {{ locationGuide.local_transportation.tip }}
                    </p>
                  </div>
                  <p v-else>{{ t('transportation-information-not-available') }}</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('what-to-pack') }}</h3>
                <div class="tip-content">
                  <div
                    v-if="
                      locationGuide.what_to_pack && locationGuide.what_to_pack.length > 0
                    "
                  >
                    <p>{{ t('essential-items-include') }}:</p>
                    <ul>
                      <li v-for="item in locationGuide.what_to_pack" :key="item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <p v-else>{{ t('packing-information-not-available') }}</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('local-etiquette') }}</h3>
                <div class="tip-content">
                  <div v-if="locationGuide.local_etiquette">
                    <p v-if="locationGuide.local_etiquette.greeting">
                      {{ locationGuide.local_etiquette.greeting }}
                    </p>
                    <div
                      v-if="
                        locationGuide.local_etiquette.customs &&
                        locationGuide.local_etiquette.customs.length > 0
                      "
                    >
                      <p>{{ t('important-customs') }}:</p>
                      <ul>
                        <li
                          v-for="custom in locationGuide.local_etiquette.customs"
                          :key="custom"
                        >
                          {{ custom }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p v-else>{{ t('etiquette-information-not-available') }}</p>
                </div>
              </div>
              <div
                v-if="locationGuide.what_on_sale && locationGuide.what_on_sale.length > 0"
                class="tip-card"
              >
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    />
                  </svg>
                </div>
                <h3 class="tip-title">{{ t('whats-on-sale') }}</h3>
                <div class="tip-content">
                  <p>{{ t('local-products-available') }}:</p>
                  <ul>
                    <li v-for="item in locationGuide.what_on_sale" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else class="tips-fallback">
              <div class="empty-icon"></div>
              <h3>{{ t('travel-guide-not-available') }}</h3>
              <p>{{ t('no-travel-guide-information-available') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">×</button>
          <div
            v-if="
              location.photos &&
              location.photos.length > 0 &&
              lightboxIndex >= 0 &&
              lightboxIndex < location.photos.length
            "
            class="lightbox-image-container"
          >
            <img
              :src="location.photos[lightboxIndex].photo_url"
              :alt="`${getLocalizedLocationName(location)} - ${t('photo')} ${lightboxIndex + 1}`"
              class="lightbox-image"
              @error="handleImageError"
            />
          </div>
          <div
            v-if="location.photos && location.photos.length > 0"
            class="lightbox-controls"
          >
            <button
              class="lightbox-control prev"
              @click="prevLightboxImage"
              :disabled="lightboxIndex === 0"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
            <div class="lightbox-counter">
              {{ lightboxIndex + 1 }} / {{ location.photos.length }}
            </div>
            <button
              class="lightbox-control next"
              @click="nextLightboxImage"
              :disabled="lightboxIndex === location.photos.length - 1"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage" class="success-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <!-- Fallback for no data -->
    <div v-else class="empty-state-container">
      <div class="empty-state-card">
        <div class="empty-icon"></div>
        <h2>{{ t('location-not-found') }}</h2>
        <p>
          {{ t('location-not-found-description') }}
        </p>
        <div class="empty-actions">
          <router-link to="/Locations" class="empty-btn primary">
            {{ t('browse-locations') }}
          </router-link>
          <button @click="fetchLocationDetail" class="empty-btn secondary">
            {{ t('try-again') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/css/locationDetial.css";
import { useTranslation } from '@/components/useTranslation';
import axios from "axios";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "../../stores/global";
const { currentLanguage, t } = useTranslation();
const route = useRoute();
const globalStore = useGlobalStore();
const locationGuide = ref(null);
const isLoadingGuide = ref(false);
const guideError = ref("");
const location = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const currentSlide = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const activeTab = ref("overview");
const isFavorite = ref(false);
const showSuccessMessage = ref(false);
const successMessage = ref("");
const showReviewForm = ref(false);
const rating = ref(0);
const comment = ref("");
const isSubmitting = ref(false);
const reviewError = ref("");
const selectedActivity = ref(null);
const showActivityModal = ref(false);
let autoRotateInterval = null;
const placeholderImage =
  "https://placehold.co/600x400/19ADCF/ffffff?text=Cambodia+Travel";
const getLocalizedLocationName = (location) => {
  if (!location) return '';
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && location.local_name) {
    return location.local_name;
  } else if (currentLang === 'km' && location.name_local) {
    return location.name_local;
  }
  return location.name || '';
};

const getLocalizedCategoryName = (category) => {
  if (!category) return t('adventure');
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && category.local_name) {
    return category.local_name;
  } else if (currentLang === 'km' && category.name_local) {
    return category.name_local;
  }
  return category.name || t('adventure');
};

const getLocalizedLocationDescription = (location) => {
  if (!location) return '';
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && location.description_local) {
    return location.description_local;
  }
  return location.name_local || location.local_name || '';
};

const getLocalizedDescription = (location) => {
  if (!location) return t('no-description-available');
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && location.description_local) {
    return location.description_local;
  }
  return location.description || t('no-description-available');
};

const getLocalizedShortDescription = (location) => {
  if (!location) return t('explore-this-amazing-location');
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && location.short_description_local) {
    return location.short_description_local;
  }
  return location.short_description || t('explore-this-amazing-location');
};

const getLocalizedTagName = (tag) => {
  if (!tag) return '';
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && tag.local_name) {
    return tag.local_name;
  } else if (currentLang === 'km' && tag.name_local) {
    return tag.name_local;
  }
  return tag.name || '';
};

const getLocalizedActivityName = (activity) => {
  if (!activity) return '';
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && activity.title_local) {
    return activity.title_local;
  } else if (currentLang === 'km' && activity.local_title) {
    return activity.local_title;
  }
  return activity.title || '';
};

const getLocalizedActivityDescription = (activity) => {
  if (!activity) return '';
  
  const currentLang = currentLanguage.value;
  if (currentLang === 'km' && activity.description_local) {
    return activity.description_local;
  } else if (currentLang === 'km' && activity.local_description) {
    return activity.local_description;
  }
  return activity.description || '';
};

const getLocalizedDifficulty = (difficulty) => {
  if (!difficulty) return '';
  
  const difficultyMap = {
    'easy': t('easy'),
    'moderate': t('moderate'), 
    'hard': t('hard'),
    'challenging': t('challenging')
  };
  
  return difficultyMap[difficulty?.toLowerCase()] || difficulty;
};

const formatLocalizedAddress = (location) => {
  if (!location) return '';
  
  const parts = [];
  if (location.village) {
    parts.push(getLocalizedLocationName(location.village));
  }
  if (location.commune) {
    parts.push(getLocalizedLocationName(location.commune));
  }
  if (location.district) {
    parts.push(getLocalizedLocationName(location.district));
  }
  if (location.province) {
    parts.push(getLocalizedLocationName(location.province));
  }
  return parts.join(', ');
};

const getLocalizedTabs = () => {
  return [
    { id: "overview", label: t('overview') },
    { id: "products", label: t('products') },
    { id: "activities", label: t('activities') },
    { id: "tips", label: t('travel-tips') },
  ];
};

const averageRating = computed(() => {
  if (!location.value || !location.value.stars || location.value.stars.length === 0) {
    return "0.0";
  }
  const sum = location.value.stars.reduce((total, review) => total + review.star, 0);
  return (sum / location.value.stars.length).toFixed(1);
});

const handleLanguageChange = () => {
  document.title = `${t('camtour-brand')} - ${getLocalizedLocationName(location.value) || t('location-detail')}`;
  if (errorMessage.value) {
    errorMessage.value = t('error-loading-location-details');
  }
};

const getDifficultyClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "difficulty-easy";
    case "moderate":
      return "difficulty-moderate";
    case "hard":
      return "difficulty-hard";
    default:
      return "difficulty-easy";
  }
};

const viewActivityDetails = (activity) => {
  selectedActivity.value = activity;
  showActivityModal.value = true;
  document.body.classList.add("no-scroll");
};

const closeActivityModal = () => {
  showActivityModal.value = false;
  selectedActivity.value = null;
  document.body.classList.remove("no-scroll");
};

const bookActivity = (activity) => {
  if (!activity.is_active) {
    showSuccessToast(t('activity-not-available'));
    return;
  }
  showSuccessToast(t('booking-initiated-for') + ` ${getLocalizedActivityName(activity)}!`);
  if (showActivityModal.value) {
    closeActivityModal();
  }
};

const suggestActivity = () => {
  showSuccessToast(t('thank-you-suggestions'));
};

const fetchLocationGuide = async () => {
  const locationId = route.params.id;
  if (!locationId) return;
  isLoadingGuide.value = true;
  guideError.value = "";
  try {
    const response = await axios.get(`/api/web/view/location/guide`, {
      params: { location_id: locationId },
      ...globalStore.getAxiosHeader(),
    });
    if (response.data && !response.data.error && response.data.data) {
      const guideData = response.data.data.find(
        (guide) => guide.location_id == locationId
      );
      locationGuide.value = guideData || null;
    } else {
      console.warn("No guide data found for this location");
      locationGuide.value = null;
    }
  } catch (error) {
    console.error("Failed to fetch location guide:", error);
    guideError.value = error.response?.data?.message || t('failed-to-load-travel-guide');
    locationGuide.value = null;
    if (typeof globalStore.onCheckError === "function") {
      await globalStore.onCheckError(error);
    }
  } finally {
    isLoadingGuide.value = false;
  }
};

const fetchLocationDetail = async () => {
  const locationId = route.params.id;
  if (!locationId) {
    errorMessage.value = t('no-location-id-provided');
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const [locationResponse] = await Promise.all([
      axios.get(`/api/web/view/location/detail/${locationId}`, {
        ...globalStore.getAxiosHeader(),
      }),
      fetchLocationGuide(),
    ]);
    if (locationResponse.data.result && locationResponse.data.data) {
      location.value = { ...locationResponse.data.data };
      document.title = `${t('camtour-brand')} - ${getLocalizedLocationName(location.value)}`;
      await checkFavoriteStatus(location.value.id);
      currentSlide.value = 0;
      await nextTick();
      startAutoRotation();
    } else {
      errorMessage.value =
        locationResponse.data.message || t('failed-to-load-location-data');
      location.value = null;
    }
  } catch (error) {
    console.error("Failed to fetch location details:", error);
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      t('error-occurred-loading-location-details');
    location.value = null;
    if (typeof globalStore.onCheckError === "function") {
      await globalStore.onCheckError(error);
    }
  } finally {
    isLoading.value = false;
  }
};

const nextSlide = () => {
  if (!location.value?.photos?.length) return;
  currentSlide.value = (currentSlide.value + 1) % location.value.photos.length;
};

const prevSlide = () => {
  if (!location.value?.photos?.length) return;
  currentSlide.value =
    (currentSlide.value - 1 + location.value.photos.length) %
    location.value.photos.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoRotation = () => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }
  if (!location.value?.photos?.length || location.value.photos.length <= 1) {
    return;
  }
  autoRotateInterval = setInterval(() => {
    if (location.value?.photos?.length > 1) {
      nextSlide();
    }
  }, 5000);
};

// Lightbox methods
const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.classList.add("no-scroll");
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.classList.remove("no-scroll");
};

const nextLightboxImage = () => {
  if (!location.value?.photos) return;
  if (lightboxIndex.value < location.value.photos.length - 1) {
    lightboxIndex.value++;
  }
};

const prevLightboxImage = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--;
  }
};

// Tab methods
const switchTab = (tabId) => {
  activeTab.value = tabId;
};

// Favorite methods
const checkFavoriteStatus = async (locationId) => {
  try {
    if (!globalStore.isLoggedIn) {
      isFavorite.value = false;
      return;
    }
    const response = await axios.get(`/api/web/user/favorites/check/${locationId}`, {
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      isFavorite.value = response.data.data?.is_favorite || false;
    }
  } catch (error) {
    console.error("Failed to check favorite status:", error);
  }
};

const toggleFavorite = async () => {
  if (!globalStore.isLoggedIn) {
    if (typeof globalStore.showLoginModal === "function") {
      globalStore.showLoginModal();
    }
    return;
  }
  if (!location.value) return;

  try {
    const url = isFavorite.value
      ? `/api/web/user/favorites/remove/${location.value.id}`
      : `/api/web/user/favorites/add/${location.value.id}`;
    const response = await axios.post(
      url,
      {},
      {
        ...globalStore.getAxiosHeader(),
      }
    );
    if (response.data.result) {
      isFavorite.value = !isFavorite.value;
      showSuccessToast(
        isFavorite.value
          ? t('location-added-to-favorites')
          : t('location-removed-from-favorites')
      );
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    showSuccessToast(t('failed-to-update-favorites'));
  }
};

// Share functionality
const shareLocation = () => {
  if (navigator.share && window.location.href) {
    navigator
      .share({
        title: getLocalizedLocationName(location.value) || t('camtour-brand'),
        text:
          getLocalizedShortDescription(location.value) || t('check-out-amazing-place-cambodia'),
        url: window.location.href,
      })
      .catch((error) => console.error("Error sharing:", error));
  } else {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showSuccessToast(t('link-copied-to-clipboard')))
      .catch((err) => console.error("Failed to copy:", err));
  }
};

// Review methods
const resetForm = () => {
  rating.value = 0;
  comment.value = "";
  reviewError.value = "";
};

const toggleReviewForm = () => {
  showReviewForm.value = !showReviewForm.value;
  if (!showReviewForm.value) {
    resetForm();
  }
};

const submitReview = async () => {
  if (rating.value === 0) {
    reviewError.value = t('please-select-rating');
    return;
  }
  if (!comment.value.trim()) {
    reviewError.value = t('please-enter-review');
    return;
  }

  // Clear error message
  reviewError.value = "";
  isSubmitting.value = true;

  try {
    const locationId = route.params.id;
    const formData = new FormData();
    formData.append("star", rating.value);
    formData.append("comment", comment.value);
    const response = await axios.post(
      `/api/web/locations/reviews/${locationId}`,
      formData,
      {
        ...globalStore.getAxiosHeader(),
      }
    );
    if (response.data.result) {
      resetForm();
      showReviewForm.value = false;
      await fetchLocationDetail();
      showSuccessToast(t('review-submitted-successfully'));
    } else {
      reviewError.value = response.data.message || t('failed-to-submit-review');
    }
  } catch (error) {
    console.error("Review submission error:", error);
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "You need to login first."
    ) {
      reviewError.value = t('please-log-in-to-submit-review');
    } else {
      reviewError.value =
        error.response?.data?.message || t('error-occurred-try-again');
    }
    try {
      if (typeof globalStore.onCheckError === "function") {
        await globalStore.onCheckError(error);
      }
    } catch (e) {
      console.error("Error handling failed:", e);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Utility methods
const showSuccessToast = (message) => {
  successMessage.value = message;
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 3000);
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

// Cleanup method
const cleanup = () => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
  document.body.classList.remove("no-scroll");
  if (lightboxOpen.value) {
    lightboxOpen.value = false;
  }
  if (showActivityModal.value) {
    showActivityModal.value = false;
  }
  locationGuide.value = null;
  isLoadingGuide.value = false;
  guideError.value = "";
  location.value = null;
  isLoading.value = true;
  errorMessage.value = "";
  currentSlide.value = 0;
  lightboxIndex.value = 0;
  activeTab.value = "overview";
  isFavorite.value = false;
  showReviewForm.value = false;
  rating.value = 0;
  comment.value = "";
  isSubmitting.value = false;
  reviewError.value = "";
  showSuccessMessage.value = false;
  successMessage.value = "";
  selectedActivity.value = null;
  document.title = t('camtour-brand');
};

// Route watchers
const routeWatcher = watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId && newId) {
      cleanup();
      await fetchLocationDetail();
    }
  }
);

const routeLeaveWatcher = watch(
  () => route.name,
  (newRouteName, oldRouteName) => {
    if (oldRouteName === "LocationDetail" && newRouteName !== "LocationDetail") {
      cleanup();
    }
  }
);

// Language watcher
watch(currentLanguage, () => {
  handleLanguageChange();
});

// Lifecycle hooks
onMounted(async () => {
  window.addEventListener('language-changed', handleLanguageChange);
  await fetchLocationDetail();
});

onBeforeUnmount(() => {
  window.removeEventListener('language-changed', handleLanguageChange);
  cleanup();
  if (routeWatcher) routeWatcher();
  if (routeLeaveWatcher) routeLeaveWatcher();
});
</script>
