
<template>
  <div class="about-us-page">
    <div class="about-us-container">
      <el-row :gutter="40">
        <el-col :lg="6" :md="8" :xs="24" class="nav-col">
          <el-skeleton :rows="4" animated v-if="loading" />
          <el-menu
            v-else-if="navigation.length > 0"
            :default-active="activeMenu"
            class="about-nav-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item v-for="item in navigation" :key="item.key" :index="item.path">
              <el-icon><component :is="iconMap[item.icon] || Grid" /></el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </el-menu>
          <div v-else class="error-placeholder">Failed to load navigation.</div>
        </el-col>
        <el-col :lg="18" :md="16" :xs="24" class="content-col">
          <div class="content-wrapper">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAboutNavigation } from '@/services/companyService';
import { 
  OfficeBuilding, 
  MagicStick, 
  DataLine, 
  Grid 
} from '@element-plus/icons-vue';

interface NavigationItem {
  key: string;
  label: string;
  path: string;
  icon: string;
}

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const navigation = ref<NavigationItem[]>([]);
const activeMenu = ref(route.path);

const iconMap: { [key: string]: any } = {
  company: OfficeBuilding,
  culture: MagicStick,
  history: DataLine,
  members: Grid,
};

const handleMenuSelect = (path: string) => {
  router.push(path);
};

const initializePage = async () => {
  loading.value = true;
  let navItems: NavigationItem[] = [];
  try {
    const response = await getAboutNavigation();
    if (response && response.code === 0 && Array.isArray(response)) {
      navItems = response;
    } else {
      throw new Error('Invalid or failed API response for navigation');
    }
  } catch (error) {
    console.error("Failed to fetch about navigation, using fallback:", error);
    navItems = [
      { key: 'profile', label: 'Company Profile', path: '/about/profile', icon: 'company' },
      { key: 'culture', label: 'Our Culture', path: '/about/culture', icon: 'culture' },
      { key: 'history', label: 'Our History', path: '/about/history', icon: 'history' },
      { key: 'members', label: 'Group Members', path: '/about/members', icon: 'members' },
    ];
  } finally {
    navigation.value = navItems;
    loading.value = false;

    if ((route.path === '/about' || route.path === '/about/') && navItems.length > 0) {
      router.push(navItems[0].path);
      activeMenu.value = navItems[0].path;
    }
  }
};

watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/about/')) {
    activeMenu.value = newPath;
  }
}, { immediate: true });

onMounted(initializePage);

</script>

<style scoped>
.about-us-page {
  padding: 40px 0;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
}

.about-us-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-col {
  background-color: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 20px !important; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  margin-bottom: 20px;
}

.error-placeholder {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.about-nav-menu {
  border-right: none;
  background-color: transparent;
}

.el-menu-item {
  font-size: 1rem;
  color: var(--el-text-color-primary);
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s ease-in-out;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

.el-menu-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.el-menu-item.is-active {
  background-color: var(--el-color-primary);
  color: #fff;
  font-weight: bold;
}

.content-wrapper {
  background-color: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 991px) {
  .nav-col {
    margin-bottom: 30px;
  }
  .about-us-container {
    padding: 0 15px;
  }
}
</style>
