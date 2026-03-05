<script setup>
import { useI18n } from 'vue-i18n';
import { useCertifications } from '../composables/useCertifications.js';

const { t } = useI18n();
const { certifications, loading, error } = useCertifications();

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

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
      <p>{{ t(error) }}</p>
    </div>

    <div v-else-if="certifications.length > 0" class="certifications-grid">
      <div v-for="cert in certifications" :key="cert.id" class="certification-card">
        <h3 class="card-title">{{ cert.nameEn }}</h3>
        <p class="card-issuer">{{ t('certifications.issuer') }}: {{ cert.issuingAuthority }}</p>
        <p class="card-date">{{ t('certifications.issue_date') }}: {{ formatDate(cert.issueDate) }}</p>
        <!-- Verification link can be added later if available in the API -->
        <!-- <a :href="cert.verifyLink" class="card-verify-link">{{ t('certifications.verify') }} &rarr;</a> -->
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
  color: var(--text-primary);
}

.view-header {
  text-align: center;
  margin-bottom: 4rem;
}

.view-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  background: var(--gradient-button);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
}

.state-feedback {
  text-align: center;
  padding: 5rem 0;
  font-size: 1.2rem;
  color: var(--text-secondary);
}
.state-feedback.error {
  color: #ff6b6b;
}

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.certification-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.certification-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.card-issuer, .card-date {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.card-verify-link {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 600;
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-verify-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}
</style>
