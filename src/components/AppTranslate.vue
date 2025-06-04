<template>
  <select
    v-model="selectedLanguage"
    class="language-selector"
    @change="changeLanguage"
  >
    <option value="en">EN</option>
    <option value="km">KH</option>
  </select>
</template>

<script>
export default {
  name: 'AppTranslate',
  data() {
    return {
      selectedLanguage: 'en',
    };
  },
  methods: {
    changeLanguage() {
      this.$emit('language-changed', this.selectedLanguage);
      localStorage.setItem('selectedLanguage', this.selectedLanguage);
    },
  },
  mounted() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.selectedLanguage = savedLanguage;
    this.$emit('language-changed', savedLanguage);
  },
};
</script>

<style scoped>
.language-selector {
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 17px;
  padding: 5px 10px;
  background-color: white;
  color: black;
  font-size: 15px;
  cursor: pointer;
  height: 35px;
  width: 65px;
}

.khmer-font .language-selector {
  font-size: 14px;
}
</style>
