<template>
  <div class="profile-section">
    <div v-if="loading" class="loading-state">
      <p>{{ t('state.loading') }}</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ t('state.data_loading_failed') }}</p>
    </div>
    <div v-if="profile" class="profile-content">
      <el-card shadow="never" class="profile-card">
        <el-row :gutter="40" align="middle">
          <el-col :lg="10" :md="24" :xs="24">
            <img :src="profile.imageUrl" :alt="getLocalizedField(profile, 'title')" class="profile-image" />
          </el-col>
          <el-col :lg="14" :md="24" :xs="24" class="profile-text-col">
            <div class="profile-text">
              <h2 class="section-title">{{ getLocalizedField(profile, 'title') }}</h2>
              <div v-html="getLocalizedField(profile, 'content')" class="content-body"></div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCompanyProfile } from '../../services/companyService';

interface ProfileData {
  title: string;
  content: string;
  imageUrl: string;
  titleEn: string;
  contentEn: string;
  titleZh: string;
  contentZh: string;

}

const { t, locale } = useI18n();
const profile = ref<ProfileData | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);

const getLocalizedField = (item: ProfileData, field: 'title' | 'content') => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

const fetchProfile = async () => {
  try {
    loading.value = true;
    const response = await getCompanyProfile(); 
    profile.value = response.data;
  } catch (err) {
    error.value = err as Error;
    console.error('Failed to fetch company profile:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
.profile-section {
  width: 100%;
}

.profile-card {
  border: none;
  background-color: transparent;
}

.profile-image {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}

.profile-text-col {
  display: flex;
  align-items: center;
}

.profile-text {
  padding-left: 20px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--el-text-color-primary);
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--el-color-primary-light-3);
}

.content-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--el-text-color-secondary);
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}

@media (max-width: 991px) {
  .profile-text {
    padding-left: 0;
    margin-top: 2rem;
  }
  .profile-image {
    height: 300px;
  }
}

@media (max-width: 767px) {
  .section-title {
    font-size: 1.8rem;
  }
  .content-body {
    font-size: 1rem;
  }
}
</style>
