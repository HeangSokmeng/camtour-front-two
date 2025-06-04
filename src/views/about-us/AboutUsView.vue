<template>
  <div class="about-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ t("discover-hidden-trails") }}</h1>
        <p>
          {{ t("hero-description") }}
        </p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">{{ t("hiking-trails") }}</span>
          </div>
          <div class="stat">
            <span class="stat-number">25</span>
            <span class="stat-label">{{ t("provinces") }}</span>
          </div>
          <div class="stat">
            <span class="stat-number">1000+</span>
            <span class="stat-label">{{ t("happy-hikers") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Story Section -->
    <div class="our-story">
      <div class="content-container">
        <h2>{{ t("our-story") }}</h2>
        <div class="story-content">
          <div class="story-text">
            <p>
              {{ t("story-paragraph-1") }}
            </p>
            <p>
              {{ t("story-paragraph-2") }}
            </p>
          </div>
          <div class="story-image">
            <img
              src="https://scontent.fpnh5-4.fna.fbcdn.net/v/t39.30808-6/500409730_1009917414585355_1742149793144846234_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHbuTmYEzeKqeUS5aujTkGVwP5e-FwscKDA_l74XCxwoC4bfT_M36mkBp5Q-7hqbWYeVylF6S2qMJDTbnwwN_Lx&_nc_ohc=nF6c-BsB7aMQ7kNvwFHuP9l&_nc_oc=AdlgCLrpcqUf-zLI7A094rpJZjj6tSocKKWGrUq9rF1yN-2i0iiK54hyBQpl7yaU6_U&_nc_zt=23&_nc_ht=scontent.fpnh5-4.fna&_nc_gid=Kl-b1a3QxDhZdTyiA2Ww3Q&oh=00_AfKBKPta5xOYqCCKz9pCOB2jBhuRLKs2jNeY3FTY_fbQvQ&oe=683BC1D4"
              alt="Cambodia hiking"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Destinations -->
    <div class="featured-destinations">
      <div class="content-container">
        <h2>{{ t("explore-premier-destinations") }}</h2>
        <p class="section-subtitle">{{ t("destinations-subtitle") }}</p>

        <div class="destination-grid">
          <div class="destination-card featured">
            <div class="destination-image cardamom"></div>
            <div class="destination-content">
              <h3>{{ t("cardamom-mountains") }}</h3>
              <div class="destination-meta">
                <span class="difficulty hard">{{ t("difficulty-expert") }}</span>
                <span class="location">{{ t("koh-kong-province") }}</span>
              </div>
              <p>
                {{ t("cardamom-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🐘 {{ t("wildlife-viewing") }}</span>
                <span class="highlight">💧 {{ t("waterfalls") }}</span>
                <span class="highlight">🏕️ {{ t("multi-day-treks") }}</span>
              </div>
            </div>
          </div>

          <div class="destination-card">
            <div class="destination-image angkor"></div>
            <div class="destination-content">
              <h3>{{ t("angkor-archaeological-park") }}</h3>
              <div class="destination-meta">
                <span class="difficulty easy">{{ t("difficulty-beginner") }}</span>
                <span class="location">{{ t("siem-reap-province") }}</span>
              </div>
              <p>
                {{ t("angkor-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🏛️ {{ t("ancient-temples") }}</span>
                <span class="highlight">🌿 {{ t("jungle-trails") }}</span>
                <span class="highlight">📸 {{ t("photography") }}</span>
              </div>
            </div>
          </div>

          <div class="destination-card">
            <div class="destination-image preah-vihear"></div>
            <div class="destination-content">
              <h3>{{ t("preah-vihear-temple") }}</h3>
              <div class="destination-meta">
                <span class="difficulty moderate">{{
                  t("difficulty-intermediate")
                }}</span>
                <span class="location">{{ t("preah-vihear-province") }}</span>
              </div>
              <p>
                {{ t("preah-vihear-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🏔️ {{ t("mountain-views") }}</span>
                <span class="highlight">🏛️ {{ t("unesco-site") }}</span>
                <span class="highlight">🌅 {{ t("sunrise-hikes") }}</span>
              </div>
            </div>
          </div>

          <div class="destination-card">
            <div class="destination-image kep"></div>
            <div class="destination-content">
              <h3>{{ t("kep-national-park") }}</h3>
              <div class="destination-meta">
                <span class="difficulty easy">{{ t("difficulty-beginner") }}</span>
                <span class="location">{{ t("kep-province") }}</span>
              </div>
              <p>
                {{ t("kep-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🌊 {{ t("ocean-views") }}</span>
                <span class="highlight">🦋 {{ t("butterflies") }}</span>
                <span class="highlight">🐒 {{ t("wildlife") }}</span>
              </div>
            </div>
          </div>

          <div class="destination-card">
            <div class="destination-image mondulkiri"></div>
            <div class="destination-content">
              <h3>{{ t("mondulkiri-hills") }}</h3>
              <div class="destination-meta">
                <span class="difficulty moderate">{{
                  t("difficulty-intermediate")
                }}</span>
                <span class="location">{{ t("mondulkiri-province") }}</span>
              </div>
              <p>
                {{ t("mondulkiri-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🐘 {{ t("elephant-sanctuary") }}</span>
                <span class="highlight">☕ {{ t("coffee-trails") }}</span>
                <span class="highlight">🏞️ {{ t("hill-tribes") }}</span>
              </div>
            </div>
          </div>

          <div class="destination-card">
            <div class="destination-image bokor"></div>
            <div class="destination-content">
              <h3>{{ t("bokor-national-park") }}</h3>
              <div class="destination-meta">
                <span class="difficulty moderate">{{
                  t("difficulty-intermediate")
                }}</span>
                <span class="location">{{ t("kampot-province") }}</span>
              </div>
              <p>
                {{ t("bokor-description") }}
              </p>
              <div class="destination-highlights">
                <span class="highlight">🏚️ {{ t("ghost-town") }}</span>
                <span class="highlight">🌫️ {{ t("cloud-forest") }}</span>
                <span class="highlight">🌊 {{ t("coastal-views") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cambodia Facts -->
    <div class="cambodia-facts">
      <div class="content-container">
        <h2>{{ t("why-hike-cambodia") }}</h2>
        <div class="facts-grid">
          <div class="fact-card">
            <div class="fact-icon">🌿</div>
            <h3>{{ t("biodiversity-hotspot") }}</h3>
            <p>{{ t("biodiversity-description") }}</p>
          </div>

          <div class="fact-card">
            <div class="fact-icon">🏛️</div>
            <h3>{{ t("years-of-history") }}</h3>
            <p>{{ t("history-description") }}</p>
          </div>

          <div class="fact-card">
            <div class="fact-icon">🌡️</div>
            <h3>{{ t("tropical-climate") }}</h3>
            <p>{{ t("climate-description") }}</p>
          </div>

          <div class="fact-card">
            <div class="fact-icon">💰</div>
            <h3>{{ t("affordable-adventure") }}</h3>
            <p>{{ t("affordable-description") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission & Values -->
    <div class="mission-values">
      <div class="content-container">
        <h2>{{ t("mission-values") }}</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="icon">🌱</div>
            <h3>{{ t("sustainable-tourism") }}</h3>
            <p>
              {{ t("sustainable-description") }}
            </p>
          </div>

          <div class="value-card">
            <div class="icon">🗺️</div>
            <h3>{{ t("trail-accessibility") }}</h3>
            <p>
              {{ t("accessibility-description") }}
            </p>
          </div>

          <div class="value-card">
            <div class="icon">🤝</div>
            <h3>{{ t("community-support") }}</h3>
            <p>
              {{ t("community-description") }}
            </p>
          </div>

          <div class="value-card">
            <div class="icon">🛡️</div>
            <h3>{{ t("safety-first") }}</h3>
            <p>
              {{ t("safety-description") }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Team -->
    <div class="our-team">
      <div class="content-container">
        <h2>{{ t("meet-adventure-team") }}</h2>
        <p class="team-intro">{{ t("team-intro") }}</p>

        <div class="team-grid">
          <div class="team-member">
            <div class="member-image team1"></div>
            <h3>Heang Sokmeng</h3>
            <p class="role">{{ t("founder-chief-guide") }}</p>
            <p class="description">
              {{ t("sokmeng-description") }}
            </p>
            <div class="member-stats">
              <span>500+ {{ t("trails-explored") }}</span>
              <span>1000+ {{ t("hikers-guided") }}</span>
            </div>
          </div>

          <div class="team-member">
            <div class="member-image team2"></div>
            <h3>Raksa Pich</h3>
            <p class="role">{{ t("ux-designer-cartographer") }}</p>
            <p class="description">
              {{ t("raksa-description") }}
            </p>
            <div class="member-stats">
              <span>50+ {{ t("digital-maps-created") }}</span>
              <span>{{ t("award-winning-design") }}</span>
            </div>
          </div>

          <div class="team-member">
            <div class="member-image team3"></div>
            <h3>Chhayya Lim</h3>
            <p class="role">{{ t("content-creator-cultural") }}</p>
            <p class="description">
              {{ t("chhayya-description") }}
            </p>
            <div class="member-stats">
              <span>200+ {{ t("trail-articles") }}</span>
              <span>{{ t("cultural-ambassador") }}</span>
            </div>
          </div>

          <div class="team-member">
            <div class="member-image team4"></div>
            <h3>Rachana Vong</h3>
            <p class="role">{{ t("backend-developer-architect") }}</p>
            <p class="description">
              {{ t("rachana-description") }}
            </p>
            <div class="member-stats">
              <span>99.9% {{ t("uptime") }}</span>
              <span>{{ t("tech-innovation-leader") }}</span>
            </div>
          </div>

          <div class="team-member mentor-card">
            <div class="member-image mentor"></div>
            <h3>Sek Socheat</h3>
            <p class="role">{{ t("technical-advisor-conservation") }}</p>
            <p class="description">
              {{ t("socheat-description") }}
            </p>
            <div class="member-stats">
              <span>{{ t("conservation-champion") }}</span>
              <span>20+ {{ t("years-experience") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="cta-section">
      <div class="content-container">
        <h2>{{ t("ready-start-adventure") }}</h2>
        <p>{{ t("cta-description-about") }}</p>
        <div class="cta-buttons">
          <button class="cta-primary">{{ t("explore-trails") }}</button>
          <button class="cta-secondary">{{ t("contact-guides") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTranslation } from "@/components/useTranslation";
import { onMounted, watch } from "vue";

const { currentLanguage, t } = useTranslation();
onMounted(() => {
  const savedLanguage = localStorage.getItem("preferred-language");
  if (savedLanguage && ["en", "km"].includes(savedLanguage)) {
    currentLanguage.value = savedLanguage;
  }
  document.title = `${t("camtour-brand")} - ${t("about-page-title")}`;
});

watch(currentLanguage, (newLanguage) => {
  document.title = `${t("camtour-brand")} - ${t("about-page-title")}`;
  console.log("Language changed to:", newLanguage);
});
</script>
<style scoped>
.about-container {
  color: var(--text-primary);
  line-height: 1.7;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Typography */
h1,
h2,
h3 {
  font-weight: 700;
  color: var(--text-primary);
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

h2:after {
  content: "";
  position: absolute;
  width: 80px;
  height: 4px;
  background: var(--gradient-secondary);
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

/* Hero Section */
.hero-section {
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(rgba(45, 85, 48, 0.4), rgba(45, 85, 48, 0.6)),
    url("https://scontent.fpnh5-3.fna.fbcdn.net/v/t39.30808-6/475839332_929971895913241_5075284319079452731_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFuaAAba-b8PxatZRqA3SilGNw6gPk3ApYY3DqA-TcCliK9jH6zHZk5udHBQfbwbwrYo6nQIi56hcJKcbwIfGsn&_nc_ohc=UXBLpxCN-fcQ7kNvwHRUnR6&_nc_oc=AdnXFxGbrGg7ODglibO6i79kjeFa-79Qcu5pmhn6W7jsc2VrwkYhi8Ys5aOidAkCYYY&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=XPBpHIflP0KmLqfwcXzysQ&oh=00_AfJBx5tebh36gLnCvrT5fty3vSAYk0JAtJzqBTGDtlQEaw&oe=683BD6FC")
      center/cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  padding: 0 1rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 3rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  color: var(--accent-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  opacity: 0.9;
}

/* Our Story Section */
.our-story {
  padding: 8rem 0;
  background: var(--light-bg);
}

.story-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: center;
  margin-top: 3rem;
}

.story-text p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.story-image {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  /* box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); */
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.story-image:hover img {
  transform: scale(1.05);
}

/* Featured Destinations */
.featured-destinations {
  padding: 8rem 0;
  background: var(--card-bg);
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.destination-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  /* box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); */
  transition: all 0.4s ease;
  border: 1px solid #f0f0f0;
  width: 350px;
}
@media (max-width: 576px) {
  .hero-section[data-v-1c3bd819][data-v-1c3bd819] {
    height: 100vh;
    min-height: 400px;
    /* width: 435px; */
  }
  .content-container[data-v-1c3bd819] {
    /* padding: 0 1rem; */
    width: 380px;
  }
  /* .hero-section[data-v-1c3bd819] {
    height: 70vh;
    min-height: 400px;
    width: 380px;
  } */
  .destination-card[data-v-1c3bd819],
  .fact-card[data-v-1c3bd819],
  .value-card[data-v-1c3bd819] {
    padding: 0.4rem;
  }
}
.destination-card:hover {
  transform: translateY(-10px);
  /* box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15); */
}

.destination-card.featured {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.destination-image {
  height: 250px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.destination-card.featured .destination-image {
  height: 100%;
  min-height: 300px;
}

.destination-content {
  padding: 2rem;
}

.destination-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.difficulty {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.difficulty.easy {
  background: #e8f5e9;
  color: var(--success-color);
}

.difficulty.moderate {
  background: #fff3e0;
  color: var(--warning-color);
}

.difficulty.hard {
  background: #ffebee;
  color: var(--danger-color);
}

.location {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.destination-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.highlight {
  background: var(--light-bg);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Background Images */
.cardamom {
  background-image: url("https://asset.cambodia.gov.kh/tourism/2024/04/photo_2024-04-10_22-43-54-1024x576.jpg");
}

.angkor {
  background-image: url("https://scontent.fpnh5-3.fna.fbcdn.net/v/t39.30808-6/494266220_707560924960354_6276499458737379265_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH9_aTgewPEf1brB7g8vHMonMPMV-Gztaecw8xX4bO1p4xP6-u6De1WsklzPzbG3NRhJNoZouJP4DWLyF1nR6tV&_nc_ohc=zFvvYLoX6cQQ7kNvwGZsVlB&_nc_oc=AdmpuG2W7hx2n8hus1To7CBqChCED4aJsNALhOw1si28qvBce1LYgq1zBCkkng347uQ&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=OZ8b4F9g9eEWCF37ojC-Eg&oh=00_AfLdwP0H1NmvQ_2_EpL1NyEFs81rFRioJx1-bqLJvFpzzw&oe=683BE358");
}

.preah-vihear {
  background-image: url("../../assets/locations/472494347_1109770813854129_16491445197147145_n.jpg");
}

.kep {
  background-image: url("https://scontent.fpnh5-4.fna.fbcdn.net/v/t39.30808-6/485364775_2895665947277513_5874689214910935172_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=3a1ebe&_nc_eui2=AeH6WRZlQeVliK2ykBBp_SEDpdXBYLjJ-r-l1cFguMn6v0g_VYQM44LgnLkH2oKNYNKfVsrfl1uTKcpn2ba-Gky_&_nc_ohc=oe9-G4wbT3gQ7kNvwGyUbiF&_nc_oc=AdlJXY7JDrwfqSpBRvZBSz-hWpwhPx6mgNliqFmvlkRXxWRgbx7aP7yoZ4gq3nWi1K8&_nc_zt=23&_nc_ht=scontent.fpnh5-4.fna&_nc_gid=LZ5UUR8wDASDiUY0vqJ64w&oh=00_AfIsIgAhMsyMPPSzRMJEy9GckwrNNgnOR2S0mw82qOfAEQ&oe=683BE441");
}

.mondulkiri {
  background-image: url("https://scontent.fpnh5-2.fna.fbcdn.net/v/t39.30808-6/474482418_3844931409085904_1229716563051648739_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGmsGvYEOT1yep8ijESyDBUFjv5Oc_By7gWO_k5z8HLuD0wMvJFvNPZcvgDzMuhkJCQGbB20Ql5rLKOjooITvus&_nc_ohc=_q6llb0H9E0Q7kNvwF94Gjd&_nc_oc=AdkB86L6Uh-O0Q6y90G0fMM0a5otFrp4NTGlZRJrXs5mG1ykej_GN0LkAsCTr4Afsj4&_nc_zt=23&_nc_ht=scontent.fpnh5-2.fna&_nc_gid=qfJgJaO_DfQ8HKCLrGHT6g&oh=00_AfJ3hQQbMD_4Agu7tVdLdIa5lVzEUx_NuGj77YeBo54YpQ&oe=683BBBCF");
}

.bokor {
  background-image: url("https://videoarchive.moelibrary.com/public/images/article_main/66e16f22663db.png");
}

/* Cambodia Facts */
.cambodia-facts {
  padding: 8rem 0;
  background: var(--light-bg);
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.fact-card {
  background: var(--card-bg);
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); */
  transition: transform 0.3s ease;
}

.fact-card:hover {
  transform: translateY(-5px);
}

.fact-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.fact-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.fact-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Mission & Values */
.mission-values {
  padding: 8rem 0;
  background: var(--card-bg);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.value-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  border-left: 6px solid var(--primary-color);
  /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); */
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  /* box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12); */
}

.icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.value-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.value-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Our Team */
.our-team {
  padding: 8rem 0;
  background: var(--light-bg);
}

.team-intro {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.team-member {
  background: var(--card-bg);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  /* box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1); */
  transition: all 0.4s ease;
  position: relative;
}

.team-member:hover {
  transform: translateY(-10px);
  /* box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15); */
}

.member-image {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  background-size: cover;
  background-position: center;
  border: 5px solid var(--primary-color);
  /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); */
}

.team-member h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.role {
  color: var(--accent-color);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.member-stats span {
  background: var(--light-bg);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--primary-color);
}

/* Team Images */
.team1 {
  background-image: url("../../assets/teams/meng.jpg");
}

.team2 {
  background-image: url("https://images.unsplash.com/photo-1494790108755-2616b612b567?w=300&h=300&fit=crop&crop=face");
}

.team3 {
  background-image: url("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face");
}

.team4 {
  background-image: url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face");
}

.mentor {
  background-image: url("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face");
}

/* Call to Action */
.cta-section {
  padding: 8rem 0;
  background: #1a7f8c55;
  color: white;
  text-align: center;
}

.cta-section h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.cta-section p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.cta-primary,
.cta-secondary {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid transparent;
}

.cta-primary {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.cta-primary:hover {
  background: transparent;
  color: var(--accent-color);
  border-color: var(--accent-color);
  transform: translateY(-3px);
  /* box-shadow: 0 10px 25px rgba(255, 140, 0, 0.3); */
}

.cta-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.cta-secondary:hover {
  background: white;
  color: var(--primary-color);
  transform: translateY(-3px);
  /* box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3); */
}

/* Responsive Design */
@media (max-width: 1200px) {
  .destination-card.featured {
    grid-column: span 1;
    display: block;
  }

  .story-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .story-image {
    order: -1;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 992px) {
  h1 {
    font-size: 2.8rem;
  }

  h2 {
    font-size: 2.2rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .destination-grid {
    grid-template-columns: 1fr;
  }

  .content-container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 80vh;
    min-height: 500px;
  }

  h1 {
    font-size: 2.2rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-stats .stat {
    flex-direction: row;
    gap: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .values-grid,
  .facts-grid,
  .team-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .destination-card,
  .fact-card,
  .value-card,
  .team-member {
    padding: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 576px) {
  .hero-section {
    height: 70vh;
    min-height: 400px;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .content-container {
    padding: 0 1rem;
  }

  .our-story,
  .featured-destinations,
  .cambodia-facts,
  .mission-values,
  .our-team,
  .cta-section {
    padding: 4rem 0;
  }

  .destination-image {
    height: 200px;
  }

  .member-image {
    height: 120px;
    width: 120px;
  }

  .team-member,
  .destination-card,
  .fact-card,
  .value-card {
    padding: 1.5rem;
  }

  .story-text p {
    font-size: 1rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  h1 {
    font-size: 1.6rem;
  }

  .hero-stats .stat {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .destination-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Animation and Interaction Enhancements */
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

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.destination-card {
  animation: fadeInUp 0.6s ease-out;
}

.fact-card {
  animation: slideInLeft 0.6s ease-out;
}

.value-card {
  animation: slideInRight 0.6s ease-out;
}

.team-member {
  animation: fadeInUp 0.6s ease-out;
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .destination-card,
  .fact-card,
  .value-card,
  .team-member {
    border: 2px solid var(--text-primary);
  }

  .cta-primary,
  .cta-secondary {
    border-width: 3px;
  }
}

/* Focus styles for accessibility */
.cta-primary:focus,
.cta-secondary:focus {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .hero-section,
  .cta-section {
    background: none !important;
    color: black !important;
  }

  .destination-card,
  .fact-card,
  .value-card,
  .team-member {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ccc;
  }

  .member-image {
    display: none;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1a4d1f;
}

/* Selection styles */
::selection {
  background-color: var(--primary-color);
  color: white;
}

::-moz-selection {
  background-color: var(--primary-color);
  color: white;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Utility classes */
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}

.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 1rem;
}
.mt-4 {
  margin-top: 1.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}

.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}
.font-medium {
  font-weight: 500;
}

.hidden {
  display: none;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.grid {
  display: grid;
}
@media (max-width: 992px) {
  .hero-content {
    top: 130px;
    order: 2;
  }
}

</style>
