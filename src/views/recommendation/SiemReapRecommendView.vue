<template>
  <div class="travel-recommendation">
    <!-- Search Header -->
    <div class="recommendation-header">
      <div class="header-container">
        <div class="header-content">
          <h1 class="header-title">{{ t("plan-perfect-trip") }}</h1>
          <p class="header-subtitle">
            {{ t("discover-siem-reap-attractions") }}
          </p>

          <!-- Budget Input -->
          <div class="budget-input-section" v-if="!sessionStarted">
            <div class="budget-wrapper">
              <label class="budget-label">{{ t("your-budget") }}</label>
              <div class="budget-input-container">
                <span class="currency-symbol">$</span>
                <input
                  type="number"
                  v-model="budget"
                  :placeholder="t('enter-budget')"
                  class="budget-input"
                  min="50"
                  max="5000"
                  step="10"
                />
              </div>
              <button
                @click="startRecommendation"
                :disabled="!budget || budget < 50 || isLoading"
                class="start-btn"
              >
                {{ isLoading ? t("starting") : t("start-planning") }}
              </button>
            </div>
          </div>

          <!-- Progress Indicator -->
          <div v-if="sessionStarted && !isComplete" class="progress-section">
            <div class="progress-info">
              <span class="progress-text"
                >{{ t("question") }} {{ currentQuestionIndex + 1 }} {{ t("of") }}
                {{ Math.max(totalQuestions, 9) }}</span
              >
              <span class="progress-percentage"
                >{{
                  Math.round(
                    ((currentQuestionIndex + 1) / Math.max(totalQuestions, 9)) * 100
                  )
                }}%</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    ((currentQuestionIndex + 1) / Math.max(totalQuestions, 9)) * 100 +
                    '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-container">
      <!-- Questions Section -->
      <div
        v-if="sessionStarted && !isComplete && currentQuestion"
        class="questions-section"
      >
        <div class="question-card">
          <div class="question-header">
            <h2 class="question-title">
              {{ getTranslatedText(currentQuestion, "title") }}
            </h2>
            <p class="question-description">
              {{ getTranslatedText(currentQuestion, "description") }}
            </p>
          </div>

          <div class="question-options">
            <button
              v-for="option in currentQuestion.active_options ||
              currentQuestion.options ||
              []"
              :key="option.id"
              @click="selectAnswer(option)"
              :class="['option-btn', { selected: selectedAnswer?.id === option.id }]"
            >
              <div class="option-content">
                <span class="option-label">{{ getTranslatedText(option, "label") }}</span>
                <span v-if="option.price" class="option-price"
                  >${{ formatPrice(option.price) }}</span
                >
                <p
                  v-if="getTranslatedText(option, 'description')"
                  class="option-description"
                >
                  {{ getTranslatedText(option, "description") }}
                </p>
              </div>
            </button>
          </div>

          <div class="question-actions">
            <button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0 || isLoading"
              class="nav-btn prev-btn"
              v-if="currentQuestionIndex > 0"
            >
              {{ t("previous") }}
            </button>
            <button
              @click="submitAnswer"
              :disabled="!selectedAnswer || isLoading"
              class="nav-btn next-btn"
            >
              {{
                isLoading
                  ? t("processing")
                  : isLastQuestion
                  ? t("get-recommendation")
                  : t("next")
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- No More Questions - Auto-Complete Missing -->
      <div
        v-if="
          sessionStarted &&
          !isComplete &&
          !currentQuestion &&
          !isLoading &&
          getMissingQuestions().length > 0
        "
        class="waiting-section"
      >
        <div class="waiting-card">
          <div class="waiting-icon">🔧</div>
          <h3>{{ t("missing-questions-detected") || "Missing Questions Detected" }}</h3>
          <p>
            We need {{ getMissingQuestions().length }} more answers to generate your
            recommendation:
          </p>
          <div class="missing-questions-list">
            <div
              v-for="missing in getMissingQuestions()"
              :key="missing"
              class="missing-question-item"
            >
              ❌ {{ missing.replace("_", " ").toUpperCase() }}
            </div>
          </div>
          <div class="auto-complete-actions">
            <button @click="autoFillMissing" class="retry-btn auto-fill-btn">
              🔧 Auto-Complete Missing Questions
            </button>
            <button @click="resetSession" class="retry-btn secondary">
              🔄 Start Over
            </button>
          </div>
        </div>
      </div>

      <!-- No More Questions - Waiting for Recommendation -->
      <div
        v-if="
          sessionStarted &&
          !isComplete &&
          !currentQuestion &&
          !isLoading &&
          getMissingQuestions().length === 0
        "
        class="waiting-section"
      >
        <div class="waiting-card">
          <div class="waiting-icon">⏳</div>
          <h3>{{ t("all-questions-completed") }}</h3>
          <p>{{ t("generating-your-recommendation") }}</p>
          <button @click="getRecommendationById" class="retry-btn">
            {{ t("get-recommendation") }}
          </button>
        </div>
      </div>

      <!-- Recommendation Results -->
      <div
        v-if="isComplete && recommendation && recommendation.budget_status"
        class="recommendation-section"
      >
        <!-- Success Animation Header -->
        <div class="success-animation">
          <div class="success-icon">
            <svg viewBox="0 0 52 52" class="checkmark">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path class="checkmark__check" fill="none" d="m16 26 6 6 12-12" />
            </svg>
          </div>
          <h2 class="success-title">{{ t("recommendation-ready") }}</h2>
          <p class="success-subtitle">{{ t("personalized-plan-created") }}</p>
        </div>

        <!-- Budget Overview Card -->
        <div class="budget-overview-card">
          <div class="budget-header">
            <h3 class="budget-title">
              <svg class="budget-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                />
              </svg>
              {{ t("budget-overview") }}
            </h3>
            <div class="budget-status-badge" :class="recommendation.budget_status">
              <span class="status-icon">{{
                getBudgetStatusIcon(recommendation.budget_status)
              }}</span>
              <span class="status-text">{{
                t(recommendation.budget_status.replace("_", "-"))
              }}</span>
            </div>
          </div>

          <div class="budget-comparison">
            <div class="budget-bar-container">
              <div class="budget-bar">
                <div
                  class="budget-fill"
                  :class="recommendation.budget_status"
                  :style="{
                    width:
                      Math.min(
                        (recommendation.total_estimated_cost / recommendation.budget) *
                          100,
                        100
                      ) + '%',
                  }"
                ></div>
              </div>
              <div class="budget-values">
                <div class="budget-value-item">
                  <span class="value-label">{{ t("your-budget") }}</span>
                  <span class="value-amount"
                    >${{ formatPrice(recommendation.budget) }}</span
                  >
                </div>
                <div class="budget-value-item">
                  <span class="value-label">{{ t("estimated-cost") }}</span>
                  <span class="value-amount estimated"
                    >${{ formatPrice(recommendation.total_estimated_cost) }}</span
                  >
                </div>
                <div
                  class="budget-value-item"
                  v-if="recommendation.total_estimated_cost < recommendation.budget"
                >
                  <span class="value-label">{{ t("savings") }}</span>
                  <span class="value-amount savings"
                    >${{
                      formatPrice(
                        recommendation.budget - recommendation.total_estimated_cost
                      )
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Cost Breakdown -->
        <div class="cost-breakdown-section">
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
            {{ t("cost-breakdown") }}
          </h3>

          <div class="cost-grid">
            <div
              class="cost-card"
              v-for="(cost, key) in recommendation.cost_breakdown || {}"
              :key="key"
              :class="getCostCategoryClass(key)"
            >
              <div class="cost-icon-wrapper">
                <div class="cost-icon" v-html="getCostIcon(key)"></div>
              </div>
              <div class="cost-content">
                <h4 class="cost-category">{{ t(`cost-${key.replace("_", "-")}`) }}</h4>
                <div class="cost-amount">${{ formatPrice(cost) }}</div>
                <div class="cost-percentage">
                  {{ Math.round((cost / recommendation.total_estimated_cost) * 100) }}%
                </div>
              </div>
              <div class="cost-bar">
                <div
                  class="cost-progress"
                  :style="{
                    width: (cost / recommendation.total_estimated_cost) * 100 + '%',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Recommendations -->
        <div class="recommendations-showcase">
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
            {{ t("recommended-for-you") }}
          </h3>

          <div class="recommendations-carousel">
            <div
              v-for="(rec, index) in recommendation.recommendations || []"
              :key="index"
              :class="[
                'recommendation-showcase-card',
                rec.type,
                { featured: index === 0 },
              ]"
            >
              <div class="rec-card-header">
                <div class="rec-badge" :class="rec.type">
                  <span class="badge-icon">{{ getRecommendationIcon(rec.type) }}</span>
                  <span class="badge-text">{{ t(`rec-type-${rec.type}`) }}</span>
                </div>
                <div v-if="rec.cost" class="rec-price-tag">
                  <span class="price-label">{{ t("total-cost") }}</span>
                  <span class="price-value">${{ formatPrice(rec.cost) }}</span>
                </div>
              </div>

              <div class="rec-card-body">
                <h4 class="rec-showcase-title">{{ rec.title }}</h4>
                <p class="rec-showcase-description">{{ rec.description }}</p>

                <!-- Enhanced Includes -->
                <div v-if="rec.includes" class="includes-showcase">
                  <h5 class="includes-title">{{ t("whats-included") }}</h5>
                  <div class="includes-grid">
                    <div
                      v-for="include in rec.includes"
                      :key="include"
                      class="include-item"
                    >
                      <svg class="include-check" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ include }}</span>
                    </div>
                  </div>
                </div>

                <!-- Attractions Preview -->
                <div
                  v-if="rec.attractions && rec.attractions.length"
                  class="attractions-preview"
                >
                  <h5 class="attractions-title">{{ t("featured-attractions") }}</h5>
                  <div class="attractions-mini-grid">
                    <div
                      v-for="attraction in rec.attractions.slice(0, 3)"
                      :key="attraction.name"
                      class="mini-attraction"
                    >
                      <div class="attraction-info">
                        <span class="attraction-mini-name">{{ attraction.name }}</span>
                        <span class="attraction-mini-distance"
                          >{{ attraction.distance_km }}km</span
                        >
                      </div>
                      <span class="attraction-mini-cost"
                        >${{ formatPrice(attraction.cost_per_person) }}</span
                      >
                    </div>
                    <div v-if="rec.attractions.length > 3" class="more-attractions">
                      +{{ rec.attractions.length - 3 }} {{ t("more-places") }}
                    </div>
                  </div>
                </div>

                <!-- Money Saving Tips -->
                <div v-if="rec.suggestions" class="tips-preview">
                  <h5 class="tips-title">
                    <svg class="tips-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                    {{ t("money-saving-tips") }}
                  </h5>
                  <div class="tips-mini-list">
                    <div
                      v-for="(tip, tipIndex) in rec.suggestions.slice(0, 2)"
                      :key="tipIndex"
                      class="tip-mini-item"
                    >
                      {{ tip }}
                    </div>
                    <div v-if="rec.suggestions.length > 2" class="more-tips">
                      +{{ rec.suggestions.length - 2 }} {{ t("more-tips") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Detailed Itinerary -->
        <div class="itinerary-showcase" v-if="recommendation.itinerary">
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
              />
            </svg>
            {{ t("your-detailed-itinerary") }}
          </h3>

          <div class="itinerary-timeline">
            <div
              v-for="(day, dayIndex) in recommendation.itinerary || []"
              :key="day.day"
              class="timeline-day"
            >
              <div class="timeline-marker">
                <div class="timeline-dot" :class="{ active: dayIndex === 0 }">
                  <span class="day-number">{{ day.day }}</span>
                </div>
                <div
                  v-if="dayIndex < recommendation.itinerary.length - 1"
                  class="timeline-line"
                ></div>
              </div>

              <div class="day-content-card">
                <div class="day-card-header">
                  <div class="day-info">
                    <h4 class="day-title">{{ day.title }}</h4>
                    <p class="day-subtitle">{{ getDaySubtitle(dayIndex) }}</p>
                  </div>
                  <div class="day-cost-badge">
                    <span class="cost-icon">💰</span>
                    <span class="cost-text"
                      >${{ formatPrice(day.estimated_daily_cost) }}</span
                    >
                  </div>
                </div>

                <!-- Activities Timeline -->
                <div class="activities-timeline" v-if="day.activities">
                  <h5 class="timeline-section-title">
                    <svg class="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ t("daily-activities") }}
                  </h5>
                  <div class="activities-flow">
                    <div
                      v-for="(activity, actIndex) in day.activities"
                      :key="actIndex"
                      class="activity-timeline-item"
                    >
                      <div class="activity-time-badge">{{ activity.time }}</div>
                      <div class="activity-card">
                        <div class="activity-main">
                          <h6 class="activity-name">{{ activity.activity }}</h6>
                          <div class="activity-meta">
                            <span class="activity-duration"
                              >⏱️ {{ activity.duration }}</span
                            >
                            <span class="activity-transport"
                              >🚗 {{ activity.transport }}</span
                            >
                          </div>
                        </div>
                        <div class="activity-cost-tag">
                          ${{ formatPrice(activity.cost) }}
                        </div>
                      </div>
                      <div
                        v-if="actIndex < day.activities.length - 1"
                        class="activity-connector"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Meals Section -->
                <div
                  class="meals-timeline"
                  v-if="day.meals && Object.keys(day.meals).length"
                >
                  <h5 class="timeline-section-title">
                    <svg class="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 110 2h-1v9a1 1 0 01-1 1H6a1 1 0 01-1-1V6H4a1 1 0 110-2h3z"
                      />
                    </svg>
                    {{ t("meals-plan") }}
                  </h5>
                  <div class="meals-grid">
                    <div
                      v-for="(meal, mealType) in day.meals"
                      :key="mealType"
                      class="meal-card"
                    >
                      <div class="meal-icon">{{ getMealIcon(mealType) }}</div>
                      <div class="meal-details">
                        <span class="meal-type-label">{{ t(mealType) }}</span>
                        <span class="meal-name">{{ meal.name || meal }}</span>
                      </div>
                      <span v-if="meal.price_per_person" class="meal-price"
                        >${{ formatPrice(meal.price_per_person) }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Transportation -->
                <div class="transport-info-card" v-if="day.transportation">
                  <h5 class="timeline-section-title">
                    <svg class="timeline-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                      <path
                        d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"
                      />
                    </svg>
                    {{ t("transport-today") }}
                  </h5>
                  <div class="transport-card">
                    <div class="transport-details">
                      <span class="transport-name">{{
                        day.transportation.name || day.transportation.type
                      }}</span>
                      <span class="transport-description">{{
                        t("daily-transport-service")
                      }}</span>
                    </div>
                    <div class="transport-cost">
                      ${{ formatPrice(day.transportation.daily_cost) }}/{{ t("day") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Action Buttons -->
        <div class="action-section">
          <div class="action-cards">
            <button @click="shareRecommendation" class="action-card share-card">
              <div class="action-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47A3 3 0 1015 8z"
                  />
                </svg>
              </div>
              <div class="action-content">
                <h4>{{ t("share-your-plan") }}</h4>
                <p>{{ t("share-description") }}</p>
              </div>
            </button>

            <button @click="downloadPlan" class="action-card download-card">
              <div class="action-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="action-content">
                <h4>{{ t("download-plan") }}</h4>
                <p>{{ t("download-description") }}</p>
              </div>
            </button>

            <button @click="startNewRecommendation" class="action-card new-plan-card">
              <div class="action-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="action-content">
                <h4>{{ t("plan-new-trip") }}</h4>
                <p>{{ t("new-plan-description") }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-section">
        <div class="loader"></div>
        <p>{{ loadingMessage }}</p>
        <div class="loading-details">
          <small>{{ t("please-wait") }} - {{ t("this-may-take-a-minute") }}</small>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-section">
        <div class="error-icon">⚠️</div>
        <h3>{{ t("something-went-wrong") }}</h3>
        <p>{{ error }}</p>
        <button @click="retry" class="retry-btn">{{ t("try-again") }}</button>
        <button
          v-if="sessionId"
          @click="forceGetRecommendation"
          class="retry-btn force-retry"
        >
          {{ t("force-get-recommendation") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from "@/components/useTranslation";
import { useGlobalStore } from "@/stores/global";
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
const { currentLanguage, t } = useTranslation();
const globalStore = useGlobalStore();
const budget = ref(500);
const sessionId = ref(null);
const sessionStarted = ref(false);
const isComplete = ref(false);
const isLoading = ref(false);
const error = ref(null);
const loadingMessage = ref("");
const questions = ref([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const answers = ref([]);
const recommendation = ref(null);
const EXPECTED_QUESTIONS = [
  "transportation",
  "departure",
  "duration",
  "party_size",
  "age_range",
  "destination",
  "local_transportation",
  "meal_preference",
  "hotel",
];
const totalQuestions = computed(() =>
  Math.max(questions.value.length, EXPECTED_QUESTIONS.length)
);
const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value] || null
);
const isLastQuestion = computed(() => {
  const hasAllAnswers = answers.value.length >= EXPECTED_QUESTIONS.length;
  const reachedEnd = currentQuestionIndex.value >= totalQuestions.value - 1;
  const noNextQuestion = !currentQuestion.value && sessionStarted.value;

  return hasAllAnswers || reachedEnd || noNextQuestion;
});

watch(currentQuestionIndex, (newIndex) => {
  if (newIndex >= questions.value.length && sessionStarted.value && !isComplete.value) {
    const missingQuestions = getMissingQuestions();
    if (missingQuestions.length > 0) {
      setTimeout(() => {
        if (!isComplete.value && !isLoading.value && missingQuestions.length > 0) {
          autoFillMissing();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        if (!isComplete.value && !isLoading.value) {
          getRecommendationById();
        }
      }, 1000);
    }
  }
});

watch(
  answers,
  (newAnswers) => {
    const answeredQuestions = newAnswers.map((a) => a.question_type);
    const missingQuestions = EXPECTED_QUESTIONS.filter(
      (q) => !answeredQuestions.includes(q)
    );
    if (
      newAnswers.length >= EXPECTED_QUESTIONS.length &&
      missingQuestions.length === 0 &&
      sessionStarted.value &&
      !isComplete.value &&
      !isLoading.value
    ) {
      setTimeout(() => {
        if (!isComplete.value && !isLoading.value) {
          getRecommendationById();
        }
      }, 1000);
    }
  },
  { deep: true }
);

// Translation helpers
const getTranslatedText = (item, field) => {
  if (!item) return "";
  if (currentLanguage.value === "km" && item[`${field}_km`]) {
    return item[`${field}_km`];
  }
  return item[field] || "";
};

// Helper functions for UI
const getBudgetStatusIcon = (status) => {
  switch (status) {
    case "within_budget":
      return "✅";
    case "over_budget":
      return "⚠️";
    case "under_budget":
      return "💰";
    default:
      return "💵";
  }
};

const getCostCategoryClass = (category) => {
  return `cost-${category.replace("_", "-")}`;
};

const getCostIcon = (category) => {
  const icons = {
    accommodation:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
    food:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>',
    transportation:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>',
    activities:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    entertainment:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>',
    destinations:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
    hotels:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>',
    meals:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>',
    local_transport:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>',
  };
  return icons[category] || icons.activities;
};

const getRecommendationIcon = (type) => {
  const icons = {
    budget: "💰",
    mid_range: "🏨",
    luxury: "⭐",
    cultural: "🏛️",
    adventure: "🏔️",
    relaxation: "🧘",
    recommended: "⭐",
    bonus: "🎁",
    budget_alternative: "💡",
  };
  return icons[type] || "📍";
};

const getMealIcon = (mealType) => {
  const icons = {
    breakfast: "🥐",
    lunch: "🍽️",
    dinner: "🍷",
    snack: "🥨",
  };
  return icons[mealType] || "🍴";
};

const getDaySubtitle = (dayIndex) => {
  const subtitles = [
    t("arrival-exploration"),
    t("cultural-immersion"),
    t("adventure-day"),
    t("relaxation-day"),
    t("local-experience"),
    t("final-discoveries"),
    t("departure-day"),
  ];
  return subtitles[dayIndex] || t("travel-day");
};

const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2);
};

// Lifecycle
onMounted(async () => {
  document.title = `${t("camtour-brand")} - ${t("travel-planner")}`;
  await loadQuestions();
});

watch(currentLanguage, () => {
  document.title = `${t("camtour-brand")} - ${t("travel-planner")}`;
});

// Enhanced session validation
async function validateSession() {
  if (!sessionId.value) {
    console.error("No session ID available");
    error.value = t("session-expired");
    return false;
  }
  return true;
}

// Methods
async function loadQuestions() {
  try {
    isLoading.value = true;
    loadingMessage.value = t("loading-questions");
    error.value = null;

    const response = await axios.get("/api/web/view/travel-questions", {
      ...globalStore.getAxiosHeader(),
    });
    if (response.data.result) {
      questions.value = response.data.data || [];
      if (questions.value.length === 0) {
        throw new Error(t("no-questions-available"));
      }
    } else {
      throw new Error(response.data.message || t("failed-to-load-questions"));
    }
  } catch (err) {
    console.error("Error loading questions:", err);
    error.value = t("error-loading-questions");
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
}

async function startRecommendation() {
  if (!budget.value || budget.value < 50) {
    error.value = t("invalid-budget");
    return;
  }

  try {
    isLoading.value = true;
    loadingMessage.value = t("starting-recommendation");
    error.value = null;

    const response = await axios.post(
      "/api/web/view/travel-start",
      {
        budget: budget.value,
      },
      {
        ...globalStore.getAxiosHeader(),
      }
    );
    if (response.data.result) {
      sessionId.value = response.data.data.session_id;
      sessionStarted.value = true;
      currentQuestionIndex.value = 0;
      answers.value = [];
      selectedAnswer.value = null;
      isComplete.value = false;
      recommendation.value = null;
    } else {
      throw new Error(response.data.message || t("failed-to-start-session"));
    }
  } catch (err) {
    console.error("Error starting recommendation:", err);
    error.value = t("error-starting-session");
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
}

function selectAnswer(option) {
  selectedAnswer.value = option;
}
async function submitAnswer() {
  if (!selectedAnswer.value) {
    return;
  }
  if (!(await validateSession())) return;
  const questionType = currentQuestion.value.type;
  const answer = selectedAnswer.value.value;
  try {
    isLoading.value = true;
    loadingMessage.value = t("processing-answer");
    error.value = null;
    const response = await axios.post(
      "/api/web/view/travel-answer",
      {
        session_id: sessionId.value,
        question_type: questionType,
        answer: answer,
      },
      {
        ...globalStore.getAxiosHeader(),
      }
    );
    if (response.data.result) {
      const responseData = response.data.data;
      answers.value.push({
        question_type: questionType,
        answer: answer,
        selected_option: selectedAnswer.value,
      });
      if (
        responseData?.recommendations ||
        responseData?.itinerary ||
        responseData?.budget_status ||
        responseData?.total_estimated_cost !== undefined
      ) {
        const transformedData = {
          session_id: responseData.session_id,
          budget: responseData.budget,
          total_estimated_cost: responseData.total_estimated_cost,
          budget_status: responseData.budget_status,
          cost_breakdown: responseData.cost_breakdown || {},
          recommendations: responseData.recommendations || [],
          itinerary: responseData.itinerary || responseData.recommended_itinerary || [],
        };
        recommendation.value = transformedData;
        isComplete.value = true;
        return;
      }
      const answeredQuestions = answers.value.map((a) => a.question_type);
      const missingQuestions = EXPECTED_QUESTIONS.filter(
        (q) => !answeredQuestions.includes(q)
      );
      if (missingQuestions.length === 0) {
        loadingMessage.value = t("generating-recommendation");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await getRecommendationById();
        return;
      }
      currentQuestionIndex.value++;
      selectedAnswer.value = null;
      if (
        currentQuestionIndex.value >= questions.value.length &&
        missingQuestions.length > 0
      ) {
        console.warn(
          "⚠️ No more frontend questions but backend still needs:",
          missingQuestions
        );
        error.value = `Still need answers for: ${missingQuestions.join(
          ", "
        )}. Please contact support or use debug panel.`;
        return;
      }
    } else {
      throw new Error(response.data.message || t("failed-to-submit-answer"));
    }
  } catch (err) {
    console.error("Error submitting answer:", err);
    error.value = t("error-submitting-answer") + ": " + err.message;
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    answers.value.pop();
    currentQuestionIndex.value--;
    const previousAnswer = answers.value[currentQuestionIndex.value];
    if (previousAnswer) {
      selectedAnswer.value = previousAnswer.selected_option;
    } else {
      selectedAnswer.value = null;
    }
  }
}

async function getRecommendationById() {
  if (!sessionId.value) {
    error.value = t("no-session-id");
    return;
  }

  try {
    isLoading.value = true;
    loadingMessage.value = t("generating-recommendation");
    error.value = null;
    const url = `/api/web/view/travel-recommendation/${sessionId.value}`;
    const maxAttempts = 15;
    const pollInterval = 3000;
    let attempts = 0;
    while (attempts < maxAttempts) {
      attempts++;
      const progressPercent = Math.round((attempts / maxAttempts) * 100);
      loadingMessage.value = `${t("generating-recommendation")} (${progressPercent}%)`;
      try {
        const response = await axios.get(url, {
          ...globalStore.getAxiosHeader(),
          timeout: 15000,
        });
        if (response.data.result && response.data.data) {
          const data = response.data.data;
          if (
            data.budget_status &&
            data.total_estimated_cost !== undefined &&
            data.budget !== undefined
          ) {
            const transformedData = {
              session_id: data.session_id,
              budget: data.budget,
              total_estimated_cost: data.total_estimated_cost,
              budget_status: data.budget_status,
              cost_breakdown: data.cost_breakdown || {},
              recommendations: data.recommendation || data.recommendations || [],
              itinerary: data.itinerary || data.recommended_itinerary || [],
            };
            recommendation.value = transformedData;
            isComplete.value = true;
            return;
          }
        }
        const message = response.data.message || "";
        if (
          message.includes("not yet generated") ||
          message.includes("not found") ||
          message.includes("session not found") ||
          !response.data.result
        ) {
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            continue;
          }
        } else {
          throw new Error(message || t("failed-to-get-recommendation"));
        }
      } catch (requestError) {
        console.error(`❌ Request error on attempt ${attempts}:`, requestError);
        if (requestError.response?.status === 404) {
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            continue;
          }
        }
        if (
          attempts < maxAttempts &&
          (requestError.code === "NETWORK_ERROR" ||
            requestError.message.includes("timeout") ||
            requestError.message.includes("Network Error") ||
            requestError.response?.status >= 500)
        ) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          continue;
        } else if (attempts >= maxAttempts) {
          break; // Exit the loop
        } else {
          throw requestError;
        }
      }
    }
    if (answers.value.length < EXPECTED_QUESTIONS.length) {
      const missingCount = EXPECTED_QUESTIONS.length - answers.value.length;
      throw new Error(
        `Missing ${missingCount} answers. Please complete all questions before generating recommendation.`
      );
    }
    throw new Error(
      t("recommendation-timeout") ||
        "Recommendation generation timed out. The system may still be processing your request. Please try the 'Force Get Recommendation' button in a moment."
    );
  } catch (err) {
    console.error("💥 Error getting recommendation:", err);
    error.value = err.message || t("error-getting-recommendation");
    await globalStore.onCheckError(err);
  } finally {
    isLoading.value = false;
  }
}

// Helper function to get missing questions
function getMissingQuestions() {
  const answeredQuestions = answers.value.map((a) => a.question_type);
  return EXPECTED_QUESTIONS.filter((q) => !answeredQuestions.includes(q));
}

function forceGetRecommendation() {
  if (!sessionId.value) {
    error.value = t("no-session-id");
    return;
  }
  const missingQuestions = getMissingQuestions();
  if (missingQuestions.length > 0) {
    console.warn("⚠️ Cannot get recommendation, missing:", missingQuestions);
    error.value = `Missing required answers: ${missingQuestions.join(
      ", "
    )}. Use "Auto-Fill Missing" button to complete.`;
    return;
  }
  error.value = null;
  getRecommendationById();
}

function autoFillMissing() {
  const missingQuestions = getMissingQuestions();

  if (missingQuestions.length === 0) {
    return;
  }
  fillMissingAnswers(missingQuestions);
}

async function fillMissingAnswers(missingQuestions) {
  try {
    isLoading.value = true;
    loadingMessage.value = `Auto-filling ${missingQuestions.length} missing answers...`;
    error.value = null;
    const defaultAnswers = {
      transportation: "bus",
      departure: "phnom_penh",
      duration: "1",
      party_size: "2",
      age_range: "adult",
      destination: "angkor_wat",
      local_transportation: "tuk_tuk",
      meal_preference: "mixed_dining",
      hotel: "star3",
    };

    for (let i = 0; i < missingQuestions.length; i++) {
      const questionType = missingQuestions[i];
      const defaultAnswer = defaultAnswers[questionType] || "default";
      loadingMessage.value = `Auto-filling ${questionType} (${i + 1}/${
        missingQuestions.length
      })...`;
      try {
        const response = await axios.post(
          "/api/web/view/travel-answer",
          {
            session_id: sessionId.value,
            question_type: questionType,
            answer: defaultAnswer,
          },
          {
            ...globalStore.getAxiosHeader(),
          }
        );
        if (response.data.result) {
          // Add to local answers
          answers.value.push({
            question_type: questionType,
            answer: defaultAnswer,
            selected_option: {
              id: "auto",
              value: defaultAnswer,
              label: `Auto: ${defaultAnswer}`,
            },
          });
          const responseData = response.data.data;
          if (
            responseData?.recommendations ||
            responseData?.budget_status ||
            responseData?.total_estimated_cost !== undefined
          ) {
            const transformedData = {
              session_id: responseData.session_id,
              budget: responseData.budget,
              total_estimated_cost: responseData.total_estimated_cost,
              budget_status: responseData.budget_status,
              cost_breakdown: responseData.cost_breakdown || {},
              recommendations: responseData.recommendations || [],
              itinerary:
                responseData.itinerary || responseData.recommended_itinerary || [],
            };

            recommendation.value = transformedData;
            isComplete.value = true;
            loadingMessage.value = "Recommendation generated successfully!";
            return;
          }
        } else {
          console.warn(`Failed to submit ${questionType}:`, response.data.message);
        }
      } catch (err) {
        console.error(`Error submitting ${questionType}:`, err);
        // Continue with other questions
      }

      // Small delay between submissions
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    loadingMessage.value = t("generating-recommendation");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await getRecommendationById();
  } catch (err) {
    console.error("Error filling missing answers:", err);
    error.value = "Failed to auto-fill missing answers: " + err.message;
  } finally {
    if (!isComplete.value) {
      isLoading.value = false;
    }
  }
}

// function skipToRecommendation() {
//   const answeredQuestions = answers.value.map((a) => a.question_type);
//   const missingQuestions = EXPECTED_QUESTIONS.filter(
//     (q) => !answeredQuestions.includes(q)
//   );

//   if (missingQuestions.length > 0) {
//     fillMissingAnswers(missingQuestions);
//   } else {
//     getRecommendationById();
//   }
// }

function resetSession() {
  startNewRecommendation();
}

function startNewRecommendation() {
  sessionId.value = null;
  sessionStarted.value = false;
  isComplete.value = false;
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answers.value = [];
  recommendation.value = null;
  error.value = null;
  budget.value = 500;
  isLoading.value = false;
  loadingMessage.value = "";
}

function shareRecommendation() {
  if (navigator.share) {
    navigator.share({
      title: t("my-siem-reap-travel-plan"),
      text: t("check-out-travel-plan"),
      url: window.location.href,
    });
  } else {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert(t("link-copied-to-clipboard"));
    });
  }
}

function downloadPlan() {
  if (!recommendation.value) return;

  try {
    let planText = `${t("my-siem-reap-travel-plan")}\n`;
    planText += `${"=".repeat(50)}\n\n`;
    planText += `${t("budget")}: ${formatPrice(recommendation.value.budget)}\n`;
    planText += `${t("estimated-cost")}: ${formatPrice(
      recommendation.value.total_estimated_cost
    )}\n`;
    planText += `${t("status")}: ${t(
      recommendation.value.budget_status?.replace("_", "-") || "unknown"
    )}\n\n`;

    if (recommendation.value.cost_breakdown) {
      planText += `${t("cost-breakdown")}:\n`;
      Object.entries(recommendation.value.cost_breakdown).forEach(([category, cost]) => {
        planText += `- ${t(`cost-${category.replace("_", "-")}`)}: ${formatPrice(
          cost
        )}\n`;
      });
      planText += "\n";
    }

    // Add itinerary details
    if (recommendation.value.itinerary) {
      planText += `${t("itinerary")}:\n`;
      planText += `${"=".repeat(30)}\n\n`;

      recommendation.value.itinerary.forEach((day) => {
        planText += `${t("day")} ${day.day}: ${day.title}\n`;
        planText += `${t("daily-cost")}: ${formatPrice(day.estimated_daily_cost)}\n\n`;

        if (day.activities) {
          planText += `${t("activities")}:\n`;
          day.activities.forEach((activity) => {
            planText += `- ${activity.time}: ${activity.activity} (${formatPrice(
              activity.cost
            )})\n`;
            if (activity.duration)
              planText += `  ${t("duration")}: ${activity.duration}\n`;
            if (activity.transport)
              planText += `  ${t("transport")}: ${activity.transport}\n`;
          });
          planText += "\n";
        }

        planText += `${"-".repeat(30)}\n\n`;
      });
    }

    planText += `\n${t("generated-by")} ${t("camtour-brand")}\n`;
    planText += `${t("date")}: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `siem-reap-travel-plan-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading plan:", err);
    alert(t("download-error") || "Error downloading plan");
  }
}

function retry() {
  error.value = null;
  if (!sessionStarted.value) {
    loadQuestions();
  } else if (sessionId.value) {
    getRecommendationById();
  } else {
    startNewRecommendation();
  }
}
</script>

<style scoped>
/* Enhanced Travel Recommendation Styles */
.travel-recommendation {
/* padding-top: 50px; */
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Debug Panel */
.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
  max-height: 80vh;
  overflow-y: auto;
}

.debug-panel h4 {
  margin: 0 0 10px;
  color: #4caf50;
}

.debug-panel > div {
  margin: 5px 0;
}

.debug-answers {
  margin: 10px 0;
  border-top: 1px solid #444;
  padding-top: 10px;
}

.debug-answer {
  margin: 2px 0;
  font-size: 11px;
  color: #ccc;
}

.debug-actions {
  margin-top: 10px;
  border-top: 1px solid #444;
  padding-top: 10px;
}

.debug-btn {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 5px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.debug-btn.force {
  background: #ff9800;
  color: white;
}

.debug-btn.reset {
  background: #f44336;
  color: white;
}

.debug-missing {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #444;
}

.debug-missing-item {
  margin: 2px 0;
  font-size: 11px;
  color: #ff5722;
}

.debug-btn.auto-fill {
  background: #4caf50;
  color: white;
}

/* Header Section */
.recommendation-header {
  background: linear-gradient(135deg, #1a7e8c 0%, #156570 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.recommendation-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../../assets/product/banner.png");
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 1;
}

.header-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.header-content {
  text-align: center;
  color: white;
  padding-top: 40px;
}

.header-title {
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 40px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* Budget Input */
.budget-input-section {
  max-width: 500px;
  margin: 0 auto;
}

.budget-wrapper {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.budget-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1a7e8c;
  margin-bottom: 12px;
}

.budget-input-container {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.currency-symbol {
  padding: 0 15px;
  font-size: 20px;
  font-weight: 600;
  color: #1a7e8c;
  background: #f8f9fa;
  height: 60px;
  display: flex;
  align-items: center;
}

.budget-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 24px;
  font-weight: 600;
  padding: 15px 20px;
  color: #333;
  height: 60px;
}

.start-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #1a7e8c 0%, #156570 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 126, 140, 0.4);
}

.start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Progress Section */
.progress-section {
  max-width: 600px;
  margin: 0 auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.9;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Main Container */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Questions Section */
.questions-section {
  max-width: 800px;
  margin: 0 auto;
}

.question-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-top: 6px solid #1a7e8c;
}

.question-header {
  text-align: center;
  margin-bottom: 40px;
}

.question-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a7e8c;
  margin: 0 0 12px;
}

.question-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.question-options {
  display: grid;
  gap: 15px;
  margin-bottom: 40px;
}

.option-btn {
  display: block;
  width: 100%;
  padding: 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.option-btn:hover {
  border-color: #1a7e8c;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.1);
  transform: translateY(-2px);
}

.option-btn.selected {
  border-color: #1a7e8c;
  background: linear-gradient(135deg, #f8fdfe 0%, #e8f4f5 100%);
  box-shadow: 0 6px 20px rgba(26, 126, 140, 0.15);
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.option-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a7e8c;
}

.option-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Question Actions */
.question-actions {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.nav-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prev-btn {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #dee2e6;
}

.prev-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.next-btn {
  background: linear-gradient(135deg, #1a7e8c 0%, #156570 100%);
  color: white;
  flex: 1;
  max-width: 300px;
  margin-left: auto;
  box-shadow: 0 4px 15px rgba(26, 126, 140, 0.3);
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(26, 126, 140, 0.4);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Waiting Section */
.waiting-section {
  text-align: center;
  padding: 60px 20px;
}

.waiting-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.waiting-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.waiting-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1a7e8c;
  margin: 0 0 15px;
}

.waiting-card p {
  font-size: 16px;
  color: #666;
  margin: 0 0 25px;
}

/* Recommendation Section */
.recommendation-section {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success Animation */
.success-animation {
  text-align: center;
  padding: 40px;
  margin-bottom: 30px;
}

.success-icon {
  margin-bottom: 20px;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4caf50;
  stroke-miterlimit: 10;
  margin: 10px auto;
  box-shadow: inset 0px 0px 0px #4caf50;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4caf50;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #4caf50;
  }
}

.success-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a7e8c;
  margin: 0 0 10px;
}

.success-subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* Budget Overview Card */
.budget-overview-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-top: 6px solid #1a7e8c;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.budget-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1a7e8c;
  margin: 0;
}

.budget-icon {
  width: 28px;
  height: 28px;
}

.budget-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
}

.budget-status-badge.within_budget {
  background: #e8f5e8;
  color: #2e7d32;
}

.budget-status-badge.over_budget {
  background: #ffebee;
  color: #c62828;
}

.budget-status-badge.under_budget {
  background: #e3f2fd;
  color: #1565c0;
}

.budget-comparison {
  margin-top: 20px;
}

.budget-bar-container {
  margin-bottom: 20px;
}

.budget-bar {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 15px;
}

.budget-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.8s ease;
}

.budget-fill.within_budget {
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.budget-fill.over_budget {
  background: linear-gradient(90deg, #f44336, #ef5350);
}

.budget-fill.under_budget {
  background: linear-gradient(90deg, #2196f3, #42a5f5);
}

.budget-values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.budget-value-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.value-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.value-amount {
  font-size: 20px;
  font-weight: 700;
  color: #1a7e8c;
}

.value-amount.estimated {
  color: #ff9800;
}

.value-amount.savings {
  color: #4caf50;
}

/* Cost Breakdown Section */
.cost-breakdown-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1a7e8c;
  margin: 0 0 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #1a7e8c;
}

.section-icon {
  width: 28px;
  height: 28px;
}

.cost-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.cost-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1a7e8c;
  transition: all 0.3s;
}

.cost-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.cost-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.cost-icon {
  width: 40px;
  height: 40px;
  color: #1a7e8c;
}

.cost-content {
  text-align: center;
}

.cost-category {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
  text-transform: capitalize;
}

.cost-amount {
  font-size: 24px;
  font-weight: 700;
  color: #1a7e8c;
  margin-bottom: 5px;
}

.cost-percentage {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.cost-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}

.cost-progress {
  height: 100%;
  background: #1a7e8c;
  border-radius: 2px;
  transition: width 0.8s ease;
}

/* Recommendations Showcase */
.recommendations-showcase {
  margin-bottom: 40px;
}

.recommendations-carousel {
  display: grid;
  gap: 25px;
}

.recommendation-showcase-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-left: 6px solid #1a7e8c;
}

.recommendation-showcase-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.recommendation-showcase-card.featured {
  border-left-color: #4caf50;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
}

.recommendation-showcase-card.recommended {
  border-left-color: #4caf50;
}

.recommendation-showcase-card.bonus {
  border-left-color: #ff9800;
}

.recommendation-showcase-card.budget_alternative {
  border-left-color: #f44336;
}

.rec-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.rec-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rec-badge.recommended {
  background: #e8f5e8;
  color: #2e7d32;
}

.rec-badge.bonus {
  background: #fff3e0;
  color: #ef6c00;
}

.rec-badge.budget_alternative {
  background: #ffebee;
  color: #c62828;
}

.rec-price-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a7e8c;
}

.rec-card-body {
  margin-top: 20px;
}

.rec-showcase-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px;
}

.rec-showcase-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px;
}

/* Includes Showcase */
.includes-showcase {
  margin-bottom: 20px;
}

.includes-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a7e8c;
  margin: 0 0 12px;
}

.includes-grid {
  display: grid;
  gap: 8px;
}

.include-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
}

.include-check {
  width: 16px;
  height: 16px;
  color: #4caf50;
  flex-shrink: 0;
}

/* Loading State */
.loading-section {
  text-align: center;
  padding: 80px 20px;
}

.loader {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 4px solid rgba(26, 126, 140, 0.1);
  border-radius: 50%;
  border-top-color: #1a7e8c;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-section p {
  font-size: 18px;
  color: #666;
  margin: 0 0 10px;
}

.loading-details {
  font-size: 14px;
  color: #999;
}

/* Error State */
.error-section {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  margin: 20px auto;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-section h3 {
  font-size: 24px;
  font-weight: 700;
  color: #f44336;
  margin: 0 0 15px;
}

.error-section p {
  font-size: 16px;
  color: #666;
  margin: 0 0 25px;
}

.retry-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 5px;
}

.retry-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.force-retry {
  background: #ff9800;
}

/* Missing Questions Styles */
.missing-questions-list {
  margin: 20px 0;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
}

.missing-question-item {
  margin: 5px 0;
  padding: 5px 0;
  color: #856404;
  font-weight: 600;
}

.auto-complete-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.auto-fill-btn {
  background: #28a745 !important;
  color: white;
}

.auto-fill-btn:hover {
  background: #218838 !important;
}

.retry-btn.secondary {
  background: #6c757d;
  color: white;
}

.retry-btn.secondary:hover {
  background: #545b62;
}

/* Action Section */
.action-section {
  margin-top: 40px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.action-card:hover {
  border-color: #1a7e8c;
  box-shadow: 0 4px 20px rgba(26, 126, 140, 0.1);
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: #1a7e8c;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.action-icon svg {
  width: 24px;
  height: 24px;
}

.action-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px;
}

.action-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-title {
    font-size: 32px;
  }

  .header-subtitle {
    font-size: 16px;
  }

  .main-container {
    padding: 20px 15px;
  }

  .question-card {
    padding: 25px 20px;
  }

  .question-title {
    font-size: 24px;
  }

  .question-actions {
    flex-direction: column;
  }

  .nav-btn {
    width: 100%;
  }

  .budget-values {
    grid-template-columns: 1fr;
  }

  .rec-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .cost-grid {
    grid-template-columns: 1fr;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }

  .debug-panel {
    position: relative;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .budget-wrapper {
    padding: 20px;
  }

  .budget-input {
    font-size: 20px;
  }

  .question-options {
    gap: 12px;
  }

  .option-btn {
    padding: 15px;
  }

  .option-label {
    font-size: 16px;
  }

  .recommendation-showcase-card {
    padding: 20px;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
  }
}
/* Itinerary Showcase - Enhanced Timeline */
.itinerary-showcase {
  margin-bottom: 40px;
}

.itinerary-timeline {
  position: relative;
  padding: 20px 0;
}

.timeline-day {
  display: flex;
  gap: 25px;
  margin-bottom: 40px;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.timeline-dot {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a7e8c 0%, #156570 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(26, 126, 140, 0.3);
  transition: all 0.3s ease;
  border: 4px solid white;
}

.timeline-dot.active {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(76, 175, 80, 0.4);
}

.timeline-line {
  width: 3px;
  min-height: 80px;
  background: linear-gradient(180deg, #1a7e8c 0%, #156570 100%);
  margin-top: 10px;
  border-radius: 2px;
  opacity: 0.3;
}

.day-content-card {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1a7e8c;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.day-content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1a7e8c, #4caf50, #ff9800);
  opacity: 0.1;
}

.day-content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-left-color: #4caf50;
}

.day-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f8f9fa;
}

.day-info {
  flex: 1;
}

.day-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a7e8c;
  margin: 0 0 8px;
  text-transform: capitalize;
}

.day-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-style: italic;
  font-weight: 500;
}

.day-cost-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffebcf 100%);
  padding: 12px 18px;
  border-radius: 25px;
  border: 2px solid #ffcc80;
  box-shadow: 0 3px 10px rgba(255, 152, 0, 0.2);
}

.cost-icon {
  font-size: 18px;
}

.cost-text {
  font-size: 16px;
  font-weight: 700;
  color: #ef6c00;
}

/* Timeline Section Titles */
.timeline-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px;
  padding: 10px 0;
  border-bottom: 2px solid #f0f0f0;
}

.timeline-icon {
  width: 20px;
  height: 20px;
  color: #1a7e8c;
}

/* Activities Timeline */
.activities-timeline {
  margin-bottom: 25px;
}

.activities-flow {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-timeline-item {
  position: relative;
  padding-left: 80px;
}

.activity-time-badge {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid #90caf9;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.activity-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid #1a7e8c;
  transition: all 0.3s ease;
}

.activity-card:hover {
  background: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.activity-main {
  flex: 1;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.activity-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.activity-duration,
.activity-transport {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.activity-cost-tag {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.3);
}

.activity-connector {
  width: 2px;
  height: 15px;
  background: #ddd;
  margin: 5px 0 5px 40px;
}

/* Meals Timeline */
.meals-timeline {
  margin-bottom: 25px;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.meal-card {
  background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%);
  border: 2px solid #ffcc80;
  border-radius: 15px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.meal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

.meal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.2);
}

.meal-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.meal-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meal-type-label {
  font-size: 12px;
  font-weight: 600;
  color: #ef6c00;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meal-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.meal-price {
  font-size: 14px;
  font-weight: 700;
  color: #ff9800;
  background: white;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #ffcc80;
}

/* Transportation Info */
.transport-info-card {
  margin-bottom: 20px;
}

.transport-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%);
  border: 2px solid #81c784;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.transport-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.transport-details {
  flex: 1;
}

.transport-name {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 4px;
  display: block;
}

.transport-description {
  font-size: 14px;
  color: #666;
}

.transport-cost {
  background: white;
  color: #2e7d32;
  padding: 10px 15px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid #81c784;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

/* Attractions Preview */
.attractions-preview {
  margin-bottom: 20px;
}

.attractions-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a7e8c;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.attractions-title::before {
  content: '📍';
  font-size: 16px;
}

.attractions-mini-grid {
  display: grid;
  gap: 10px;
}

.mini-attraction {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.mini-attraction:hover {
  background: white;
  border-color: #1a7e8c;
  box-shadow: 0 3px 10px rgba(26, 126, 140, 0.1);
}

.attraction-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attraction-mini-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.attraction-mini-distance {
  font-size: 12px;
  color: #666;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.attraction-mini-cost {
  font-size: 14px;
  font-weight: 700;
  color: #1a7e8c;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #1a7e8c;
}

.more-attractions {
  text-align: center;
  padding: 10px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px dashed #90caf9;
  border-radius: 10px;
  color: #1565c0;
  font-weight: 600;
  font-size: 14px;
}

/* Tips Preview */
.tips-preview {
  margin-bottom: 15px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #ff9800;
  margin: 0 0 12px;
}

.tips-icon {
  width: 18px;
  height: 18px;
}

.tips-mini-list {
  display: grid;
  gap: 8px;
}

.tip-mini-item {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 3px solid #ff9800;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  position: relative;
}

.tip-mini-item::before {
  content: '💡';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 2px;
  border-radius: 50%;
  border: 2px solid #ff9800;
  font-size: 12px;
}

.more-tips {
  text-align: center;
  padding: 10px;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px dashed #ffcc80;
  border-radius: 8px;
  color: #ef6c00;
  font-weight: 600;
  font-size: 14px;
}

/* Enhanced Action Cards */
.share-card:hover .action-icon {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  transform: rotate(15deg);
}

.download-card:hover .action-icon {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  transform: scale(1.1);
}

.new-plan-card:hover .action-icon {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  transform: rotate(-15deg);
}

/* Responsive Design for New Styles */
@media (max-width: 768px) {
  .timeline-day {
    flex-direction: column;
    gap: 15px;
  }
  
  .timeline-marker {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .timeline-dot {
    width: 50px;
    height: 50px;
    font-size: 14px;
  }
  
  .timeline-line {
    width: 60px;
    height: 3px;
    margin-top: 0;
    margin-left: 10px;
  }
  
  .day-content-card {
    padding: 20px;
  }
  
  .day-card-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .activity-timeline-item {
    padding-left: 0;
    padding-top: 40px;
    position: relative;
  }
  
  .activity-time-badge {
    position: absolute;
    top: 0;
    left: 0;
    transform: none;
  }
  
  .meals-grid {
    grid-template-columns: 1fr;
  }
  
  .attractions-mini-grid {
    gap: 8px;
  }
  
  .mini-attraction {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .day-title {
    font-size: 20px;
  }
  
  .activity-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .activity-meta {
    gap: 8px;
  }
  
  .meal-card {
    padding: 15px;
  }
  
  .transport-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .tip-mini-item {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* Animation Enhancements */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-day {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.timeline-day:nth-child(1) { animation-delay: 0.1s; }
.timeline-day:nth-child(2) { animation-delay: 0.2s; }
.timeline-day:nth-child(3) { animation-delay: 0.3s; }
.timeline-day:nth-child(4) { animation-delay: 0.4s; }
.timeline-day:nth-child(5) { animation-delay: 0.5s; }

.activity-timeline-item {
  animation: slideInLeft 0.4s ease-out;
  animation-fill-mode: both;
}

.activity-timeline-item:nth-child(1) { animation-delay: 0.1s; }
.activity-timeline-item:nth-child(2) { animation-delay: 0.2s; }
.activity-timeline-item:nth-child(3) { animation-delay: 0.3s; }
.activity-timeline-item:nth-child(4) { animation-delay: 0.4s; }

/* Scroll Behavior */
.itinerary-showcase {
  scroll-behavior: smooth;
}

/* Print Styles */
@media print {
  .timeline-dot {
    background: #1a7e8c !important;
    color: white !important;
  }
  
  .day-content-card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
  
  .activity-card,
  .meal-card,
  .transport-card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}
</style>
