<template>
  <footer class="camtour-footer">
    <div class="footer-top-border"></div>
    <div class="container">
      <div class="footer-logo">
        <h3>{{ t("camtour-recommender") }}</h3>
        <p>{{ t("discover-cambodia") }}</p>
      </div>
      <div class="footer-grid">
        <div class="footer-column">
          <h4>{{ t("siem-reap") }}</h4>
          <ul>
            <li v-for="location in siemReapLocations" :key="location.key">
              <RouterLink :to="location.route">
                {{ t(location.translationKey) }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>{{ t("adventure") }}</h4>
          <ul>
            <li v-for="adventure in adventureLocations" :key="adventure.key">
              <RouterLink :to="adventure.route">
                {{ t(adventure.translationKey) }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>{{ t("shopping") }}</h4>
          <ul>
            <li v-for="product in shoppingCategories" :key="product.key">
              <RouterLink :to="product.route">
                {{ t(product.translationKey) }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>{{ t("contact-us") }}</h4>
          <div class="contact-details">
            <div class="contact-item" v-for="contact in contactInfo" :key="contact.type">
              <component :is="contact.icon" class="contact-icon" />
              <component
                :is="contact.href ? 'a' : 'span'"
                :href="contact.href"
                :class="{ 'contact-link': contact.href }"
              >
                {{ contact.value }}
              </component>
            </div>
          </div>
          <div class="social-icons">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              :class="['social-icon', social.name]"
              :aria-label="t(social.translationKey)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <component :is="social.icon" />
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="copyright">
          {{ t("copyright", { year: currentYear }) }}
        </div>
        <nav class="footer-links">
          <RouterLink v-for="link in legalLinks" :key="link.route" :to="link.route">
            {{ t(link.translationKey) }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useTranslation } from "@/components/useTranslation";
import { computed, h, onMounted, onUnmounted } from "vue";
const {  t } = useTranslation();
const currentYear = computed(() => new Date().getFullYear());
const PhoneIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
]);

const EmailIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'm4 4 7.07 17 2.51-7.39L21 11.07z' })
]);

const LocationIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
  h('circle', { cx: '12', cy: '10', r: '3' })
]);

const FacebookIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' })
]);

const TwitterIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' })
]);

const InstagramIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' })
]);

const YoutubeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  width: '16',
  height: '16'
}, [
  h('path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' })
]);

const siemReapLocations = [
  { key: "angkor-thom", translationKey: "angkor-thom", route: "/location/angkor-thom" },
  { key: "banteay-srei", translationKey: "banteay-srei", route: "/location/banteay-srei" },
  { key: "kralanh", translationKey: "kralanh", route: "/location/kralanh" },
  { key: "puok", translationKey: "puok", route: "/location/puok" },
  { key: "prasat-bakong", translationKey: "prasat-bakong", route: "/location/prasat-bakong" },
  { key: "soutr-nikom", translationKey: "soutr-nikom", route: "/location/soutr-nikom" },
  { key: "srei-snam", translationKey: "srei-snam", route: "/location/srei-snam" },
  { key: "svay-leu", translationKey: "svay-leu", route: "/location/svay-leu" },
  { key: "varin", translationKey: "varin", route: "/location/varin" },
];

const adventureLocations = [
  { key: "banteay-meanchey", translationKey: "banteay-meanchey", route: "/adventure/banteay-meanchey" },
  { key: "battambang", translationKey: "battambang", route: "/adventure/battambang" },
  { key: "kampong-cham", translationKey: "kampong-cham", route: "/adventure/kampong-cham" },
  { key: "kep", translationKey: "kep", route: "/adventure/kep" },
  { key: "koh-kong", translationKey: "koh-kong", route: "/adventure/koh-kong" },
  { key: "kampong-chhnang", translationKey: "kampong-chhnang", route: "/adventure/kampong-chhnang" },
  { key: "kratie", translationKey: "kratie", route: "/adventure/kratie" },
  { key: "mondulkiri", translationKey: "mondulkiri", route: "/adventure/mondulkiri" },
  { key: "ratanakiri", translationKey: "ratanakiri", route: "/adventure/ratanakiri" },
  { key: "siem-reap-adventure", translationKey: "siem-reap-adventure", route: "/adventure/siem-reap" },
  { key: "takeo", translationKey: "takeo", route: "/adventure/takeo" },
];

const shoppingCategories = [
  { key: "camping-equipment", translationKey: "camping-equipment", route: "/product/category/camping-equipment" },
  { key: "camping-tents", translationKey: "camping-tents", route: "/product/category/camping-tents" },
  { key: "bottles", translationKey: "bottles", route: "/product/category/bottles" },
  { key: "camping-pump", translationKey: "camping-pump", route: "/product/category/camping-pump" },
  { key: "mattress", translationKey: "mattress", route: "/product/category/mattress" },
  { key: "pillow-hammock", translationKey: "pillow-hammock", route: "/product/category/pillow-hammock" },
  { key: "chair-table", translationKey: "chair-table", route: "/product/category/chair-table" },
  { key: "sleeping-bag", translationKey: "sleeping-bag", route: "/product/category/sleeping-bag" },
  { key: "camping-shelters", translationKey: "camping-shelters", route: "/product/category/camping-shelters" },
  { key: "camping-accessories", translationKey: "camping-accessories", route: "/product/category/camping-accessories" },
  { key: "camping-trekking", translationKey: "camping-trekking", route: "/product/category/camping-trekking" },
];

const contactInfo = [
  { type: "phone1", icon: PhoneIcon, href: "tel:+85511595794", value: "+855 11 595 794" },
  { type: "phone2", icon: PhoneIcon, href: "tel:+85511595794", value: "+855 11 595 794" },
  { type: "email", icon: EmailIcon, href: "mailto:chhayyaneom00@gmail.com", value: "chhayyaneom00@gmail.com" },
  { type: "address", icon: LocationIcon, href: null, value: computed(() => t("footer-address")) },
];

const socialLinks = [
  { name: "facebook", translationKey: "facebook-page", url: "https://facebook.com/camtour", icon: FacebookIcon },
  { name: "twitter", translationKey: "twitter-page", url: "https://twitter.com/camtour", icon: TwitterIcon },
  { name: "instagram", translationKey: "instagram-page", url: "https://instagram.com/camtour", icon: InstagramIcon },
  { name: "youtube", translationKey: "youtube-channel", url: "https://youtube.com/camtour", icon: YoutubeIcon },
];

const legalLinks = [
  { route: "/privacy", translationKey: "privacy-policy" },
  { route: "/terms", translationKey: "terms-of-service" },
  { route: "/faq", translationKey: "faq" },
];

const handleLanguageChange = () => {
};

onMounted(() => {
  window.addEventListener("language-changed", handleLanguageChange);
});

onUnmounted(() => {
  window.removeEventListener("language-changed", handleLanguageChange);
});
</script>

<style scoped>
.camtour-footer {
  color: #fff;
  padding: 60px 0 20px;
  position: relative;
  background: url("@/assets/image/Background.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;

}

.camtour-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.7) 100%);
  z-index: 1;
}

.footer-top-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, #19adcf, #8a4fff);
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  position: relative;
  z-index: 2;
}

.footer-logo {
  text-align: center;
  margin-bottom: 40px;
}

.footer-logo h3 {
  color: #19adcf;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.footer-logo p {
  color: #f8f9fa;
  font-size: 16px;
  font-weight: 400;
  opacity: 0.9;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.footer-column {
  backdrop-filter: blur(5px);
  background-color: rgba(25, 173, 207, 0.05);
  border-radius: 12px;
  padding: 20px;
  border-left: 3px solid rgba(25, 173, 207, 0.5);
  transition: all 0.3s ease;
}

.footer-column:hover {
  background-color: rgba(25, 173, 207, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.footer-column h4 {
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  padding-bottom: 10px;
}

.footer-column h4::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #19adcf;
  border-radius: 2px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 8px;
}

.footer-column a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.footer-column li a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #19adcf;
  transition: width 0.3s ease;
}

.footer-column li a:hover {
  color: #19adcf;
}

.footer-column li a:hover::after {
  width: 100%;
}

.contact-details {
  margin-bottom: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.contact-icon {
  color: #19adcf;
  flex-shrink: 0;
}

.contact-link,
.contact-item span {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  transition: color 0.3s ease;
  text-decoration: none;
}

.contact-link:hover {
  color: #19adcf;
}

.social-icons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  text-decoration: none;
}

.social-icon:hover {
  background: #19adcf;
  color: white;
  transform: translateY(-3px) rotate(8deg);
  box-shadow: 0 5px 15px rgba(25, 173, 207, 0.3);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  transition: color 0.3s ease;
  text-decoration: none;
}

.footer-links a:hover {
  color: #19adcf;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-column h4 {
    text-align: center;
  }

  .footer-column h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-column ul {
    text-align: center;
  }

  .contact-item {
    justify-content: center;
  }

  .social-icons {
    justify-content: center;
  }
}
</style>