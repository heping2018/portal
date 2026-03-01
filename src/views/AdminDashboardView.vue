<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>{{ t('admin.title') }}</h1>
      <p>{{ t('admin.welcome') }}</p>
    </div>
    <div class="module-grid">
      <router-link to="/admin/products" class="module-card">
        <i class="fas fa-cubes"></i>
        <h2>{{ t('admin.product_management') }}</h2>
        <p>{{ t('admin.product_management_desc') }}</p>
      </router-link>
      <router-link to="/admin/news" class="module-card">
        <i class="fas fa-newspaper"></i>
        <h2>{{ t('admin.news_management') }}</h2>
        <p>{{ t('admin.news_management_desc') }}</p>
      </router-link>
      <router-link to="/admin/certificates" class="module-card">
        <i class="fas fa-certificate"></i>
        <h2>{{ t('admin.certificate_management') }}</h2>
        <p>{{ t('admin.certificate_management_desc') }}</p>
      </router-link>
      <router-link to="/admin/users" class="module-card">
        <i class="fas fa-users-cog"></i>
        <h2>{{ t('admin.user_management') }}</h2>
        <p>{{ t('admin.user_management_desc') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
:root {
  --glow-blue: #00BFFF;
  --border-blue: rgba(0, 150, 255, 0.2);
  --text-primary: #E0EFFF;
  --text-secondary: #B0C4DE;
  --bg-dark-transparent: rgba(13, 21, 42, 0.7);
}

.admin-dashboard {
  color: var(--text-primary);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--glow-blue);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.module-card {
  background: var(--bg-dark-transparent);
  border: 1px solid var(--border-blue);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: var(--text-secondary);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.module-card:hover {
  transform: translateY(-10px);
  border-color: var(--glow-blue);
  box-shadow: 0 10px 30px rgba(0, 191, 255, 0.3);
}

.module-card i {
  font-size: 3rem;
  color: var(--glow-blue);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.module-card:hover i {
  transform: scale(1.1);
}

.module-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.module-card p {
  font-size: 0.95rem;
}
</style>
