<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap';

const { t } = useI18n();
const heroSectionRef = ref(null);
const heroTitleRef = ref(null);
const heroSubtitleRef = ref(null);
const ctaButtonRef = ref(null);
let magneticButtonCleanup = null;
let parallaxCleanup = null;

// GSAP Animations & Interactions
onMounted(() => {
  // Ensure all refs are available
  if (!heroSectionRef.value || !heroTitleRef.value || !heroSubtitleRef.value || !ctaButtonRef.value) {
    console.error("Hero section refs not found, aborting animations.");
    return;
  }

  const tl = gsap.timeline();
  const heroSection = heroSectionRef.value;
  const title = heroTitleRef.value;
  const subtitle = heroSubtitleRef.value;
  const button = ctaButtonRef.value;

  // --- Character-by-Character 3D Flip Animation for Title ---
  const text = title.textContent;
  title.innerHTML = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  const chars = title.querySelectorAll('.char');

  tl.from(chars, {
    opacity: 0,
    y: 60,
    rotateX: -180,
    stagger: 0.05,
    ease: "power3.out",
    duration: 1.2
  });

  // --- Fade-in for Subtitle and Button ---
  tl.from(subtitle, { y: 40, opacity: 0, ease: "power3.out", duration: 0.8 }, "-=0.8");
  tl.from(button, { y: 20, opacity: 0, ease: "power3.out", duration: 0.6 }, "-=0.6");

  // --- Magnetic Button Effect ---
  const span = button.querySelector('span');

  const activateMagnetism = (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, { x: x * 0.2, y: y * 0.2, duration: 0.5, ease: 'power3.out' });
    gsap.to(span, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: 'power3.out' });
  };

  const resetMagnetism = () => {
    gsap.to([button, span], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  };

  button.addEventListener('mousemove', activateMagnetism);
  button.addEventListener('mouseleave', resetMagnetism);
  
  magneticButtonCleanup = () => {
      button.removeEventListener('mousemove', activateMagnetism);
      button.removeEventListener('mouseleave', resetMagnetism);
  };

  // --- 3D Parallax Effect on Mouse Move ---
  const parallaxHandler = (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = heroSection;
    const xPercent = (clientX / offsetWidth - 0.5) * 2;
    const yPercent = (clientY / offsetHeight - 0.5) * 2;

    // Animate elements with different strengths for a 3D effect
    gsap.to(title, { x: -xPercent * 25, y: -yPercent * 25, duration: 0.8, ease: 'power2.out' });
    gsap.to(subtitle, { x: -xPercent * 15, y: -yPercent * 15, duration: 0.8, ease: 'power2.out' });
    gsap.to(button, { x: -xPercent * 20, y: -yPercent * 20, duration: 0.8, ease: 'power2.out' });
  };

  heroSection.addEventListener('mousemove', parallaxHandler);

  parallaxCleanup = () => {
    heroSection.removeEventListener('mousemove', parallaxHandler);
  };
});

onBeforeUnmount(() => {
  if (magneticButtonCleanup) magneticButtonCleanup();
  if (parallaxCleanup) parallaxCleanup();
});

</script>

<template>
  <section class="hero-section" ref="heroSectionRef">
    <div class="glassmorphism-container">
      <h1 class="hero-title" ref="heroTitleRef">{{ t('hero.title') }}</h1>
      <p class="hero-subtitle" ref="heroSubtitleRef">{{ t('hero.subtitle') }}</p>
      <button class="cta-button magnetic-button" ref="ctaButtonRef">
        <span>{{ t('hero.cta') }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  min-height: 600px;
  padding: 0 2rem;
  text-align: center;
  perspective: 1000px; /* Crucial for 3D animations */
  position: relative;
  overflow: hidden; /* Hide elements during animation */
}

.glassmorphism-container {
  width: 100%;
  max-width: 950px;
  padding: 4rem 3rem;
  background: rgba(0, 20, 40, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d; /* Enable 3D transformations for children */
}

.hero-title {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00c3ff, #e1ffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  will-change: transform;
}

.hero-title .char {
  display: inline-block;
  will-change: transform, opacity;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-weight: 300;
  color: #a0c3e6;
  margin-bottom: 3rem;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  will-change: transform;
}

.cta-button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #001529;
  background: linear-gradient(45deg, #00c3ff, #9cffff);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform, box-shadow;
  position: relative; /* For the span inside */
}

.cta-button span {
  display: inline-block; /* Required for transform */
  will-change: transform;
}

.cta-button:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 195, 255, 0.5);
}
</style>
