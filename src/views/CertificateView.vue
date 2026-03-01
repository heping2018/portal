<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCertificates } from '../services/certificateService';

const { t } = useI18n();

const certificates = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchCertificates = async () => {
  loading.value = true;
  error.value = null;
  try {
    // The service returns an object like { code, msg, data: [...] }
    const response = await getCertificates();
    
    // The actual list of certificates is in response.data
    if (response && Array.isArray(response.data)) {
      certificates.value = response.data.map((cert, index) => {
        // This logic is for a bento grid layout
        if (index === 0 || index === 4) cert.class = 'wide';
        if (index === 3) cert.class = 'tall';
        return cert;
      });
    } else {
      console.warn('Certificate data not in expected format or is empty', response);
      certificates.value = []; // Ensure it's an empty array on failure or if empty
    }

  } catch (err) {
    // Use the translated error message string directly
    error.value = t('certifications.error'); 
    console.error('Failed to fetch certificates:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(fetchCertificates);

</script>

<template>
  <div class="certifications-view">
    <header class="view-header">
      <h1>{{ t('certifications.title') }}</h1>
      <p class="subtitle">{{ t('certifications.subtitle') }}</p>
    </header>

    <div v-if="loading" class="state-feedback">
      <p>{{ t('certifications.loading') }}</p>
    </div>

    <div v-else-if="error" class="state-feedback error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="certificates.length > 0" class="certifications-grid">
      <div v-for="cert in certificates" :key="cert.id" class="certification-card" :class="cert.class">
        <h3 class="card-title">{{ cert.nameEn }}</h3>
        <p class="card-issuer">{{ t('certifications.issuer') }}: {{ cert.issuingAuthority }}</p>
        <p class="card-date">{{ t('certifications.issue_date') }}: {{ formatDate(cert.issueDate) }}</p>
      </div>
    </div>

    <div v-else class="state-feedback">
      <p>{{ t('certifications.no_certificates') }}</p>
    </div>
  </div>
</template>

<style scoped>
.certifications-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0;
}

.view-header {
  text-align: center;
  margin-bottom: 4rem;
}

.view-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(45deg, #00c3ff, #9cffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.3rem;
  color: #a0c3e6;
  max-width: 700px;
  margin: 0 auto;
}

.state-feedback {
  text-align: center;
  padding: 5rem 0;
  font-size: 1.2rem;
  color: #a0c3e6;
}

.state-feedback.error {
  color: #ff6b6b;
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 2rem;
}

.certification-card {
  background: rgba(0, 20, 40, 0.6);
  border: 1px solid rgba(0, 195, 255, 0.25);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  grid-column: span 1;
  grid-row: span 1;
}

.certification-card.wide {
  grid-column: span 2;
}

.certification-card.tall {
  grid-row: span 2;
}

.certification-card:hover {
  transform: translateY(-10px);
  border-color: rgba(0, 195, 255, 0.6);
  box-shadow: 0 10px 25px rgba(0, 25, 45, 0.5);
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.card-issuer, .card-date {
  font-size: 1rem;
  color: #a0c3e6;
  margin-bottom: 0.75rem;
}
</style>