<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const currentSlide = ref(0);
const slideInterval = ref(null);

const props = defineProps({
  solutions: {
    type: Array,
    default: () => []
  }
});

const getLocalizedField = (item, field) => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[field] || '';
};

const displayBanners = computed(() => {
  return props.solutions.slice(0, 5);
});

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % displayBanners.value.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? displayBanners.value.length - 1 
    : currentSlide.value - 1;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  if (displayBanners.value.length > 1) {
    slideInterval.value = setInterval(nextSlide, 5000);
  }
});

onBeforeUnmount(() => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value);
  }
});
</script>

<template>
  <section class="banner-section">
    <div class="banner-container">
      <div 
        v-for="(banner, index) in displayBanners" 
        :key="banner.id || index"
        :class="['banner-slide', { active: currentSlide === index }]"
      >
        <div class="banner-content">
          <div class="banner-text">
            <h2>{{ getLocalizedField(banner, 'title') }}</h2>
            <p>{{ getLocalizedField(banner, 'description') }}</p>
            <router-link 
              v-if="banner.id" 
              :to="{ name: 'SolutionDetailView', params: { id: banner.id } }"
              class="banner-link"
            >
              {{ t('common.learn_more') }}
            </router-link>
          </div>
          <div class="banner-image" v-if="banner.imageUrl">
            <img :src="banner.imageUrl" :alt="getLocalizedField(banner, 'title')" />
          </div>
        </div>
      </div>

      <button class="banner-nav prev" @click="prevSlide">
        <span>&lt;</span>
      </button>
      <button class="banner-nav next" @click="nextSlide">
        <span>&gt;</span>
      </button>

      <div class="banner-dots">
        <span 
          v-for="(banner, index) in displayBanners" 
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.banner-section {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.banner-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  display: flex;
  align-items: center;
}

.banner-slide.active {
  opacity: 1;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 5%;
}

.banner-text {
  flex: 1;
  max-width: 600px;
  padding-right: 40px;
}

.banner-text h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.banner-text p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.banner-link {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(45deg, #00c3ff, #9cffff);
  color: #001529;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.banner-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 195, 255, 0.4);
}

.banner-image {
  flex: 1;
  max-width: 500px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 195, 255, 0.2);
  border: 1px solid rgba(0, 195, 255, 0.5);
  color: #00c3ff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 10;
}

.banner-nav.prev {
  left: 20px;
}

.banner-nav.next {
  right: 20px;
}

.banner-nav:hover {
  background: rgba(0, 195, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
}

.banner-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 195, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active,
.dot:hover {
  background: #00c3ff;
  transform: scale(1.2);
}

@media (max-width: 992px) {
  .banner-section {
    height: auto;
    min-height: 600px;
  }

  .banner-content {
    flex-direction: column;
    padding: 60px 5%;
    text-align: center;
  }

  .banner-text {
    padding-right: 0;
    max-width: 100%;
  }

  .banner-text h2 {
    font-size: 2rem;
  }

  .banner-image {
    max-width: 100%;
    height: 300px;
    margin-top: 30px;
  }

  .banner-nav {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .banner-section {
    min-height: 500px;
  }

  .banner-text h2 {
    font-size: 1.6rem;
  }

  .banner-text p {
    font-size: 1rem;
  }

  .banner-image {
    height: 200px;
  }

  .banner-nav {
    width: 35px;
    height: 35px;
  }

  .banner-nav.prev {
    left: 10px;
  }

  .banner-nav.next {
    right: 10px;
  }
}
</style>
