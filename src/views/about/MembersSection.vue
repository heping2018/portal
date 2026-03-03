<template>
  <div class="members-section">
    <h2 class="section-title">{{ t('about.members.title') }}</h2>
    <div v-if="loading" class="loading-state">
      <p>{{ t('state.loading') }}</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ t('state.data_loading_failed') }}</p>
    </div>
    <div v-else class="members-grid">
      <el-row :gutter="30">
        <el-col
          v-for="member in members"
          :key="member.id"
          :lg="8" :md="12" :sm="24"
          class="member-col"
        >
          <el-card shadow="hover" class="member-card">
            <div class="member-logo-wrapper">
              <img :src="member.logoUrl" :alt="getLocalizedField(member, 'memberName') + ' Logo'" class="member-logo" />
            </div>
            <div class="member-info">
              <h3 class="member-name">{{ getLocalizedField(member, 'memberName') }}</h3>
              <p class="member-description">{{ getLocalizedField(member, 'description') }}</p>
            </div>
            <div class="card-footer">
              <el-button 
                type="primary" 
                plain 
                @click="visitWebsite(member.websiteUrl)"
              >
                {{ t('about.members.visit_website') }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCompanyMembers } from '../../services/companyService';

interface CompanyMember {
  id: number;
  memberName: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  memberNameEn: string;
  descriptionEn: string;
  memberNameZh: string;
  descriptionZh: string;
}

const { t, locale } = useI18n();
const members = ref<CompanyMember[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);

const getLocalizedField = (item: CompanyMember, field: 'memberName' | 'description') => {
  if (!item) return '';
  const lang = locale.value.startsWith('zh') ? 'Zh' : 'En';
  return item[`${field}${lang}`] || item[`${field}En`] || '';
};

const fetchMembers = async () => {
  try {
    loading.value = true;
    const response = await getCompanyMembers();
    if (response.data && Array.isArray(response.data)) {
        members.value = response.data;
    }
  } catch (err) {
    error.value = err as Error;
    console.error('Failed to fetch company members:', err);
  } finally {
    loading.value = false;
  }
};

const visitWebsite = (url: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

onMounted(fetchMembers);
</script>

<style scoped>
.members-section {
  width: 100%;
  padding: 2rem 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3.5rem;
  color: var(--el-text-color-primary);
}

.members-grid {
  width: 100%;
}

.member-col {
  margin-bottom: 30px;
}

.member-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.member-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--el-box-shadow-light);
}

.member-logo-wrapper {
  padding: 25px;
  margin: 1px; /* To account for border */
  text-align: center;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.member-logo {
  max-height: 70px;
  max-width: 180px;
  object-fit: contain;
}

.member-info {
  padding: 25px;
  flex-grow: 1;
  text-align: center;
}

.member-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-description {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
  min-height: 80px; /* Give some minimum height */
}

.card-footer {
  padding: 20px 25px;
  text-align: center;
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-lighter);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: var(--el-text-color-secondary);
}
</style>
