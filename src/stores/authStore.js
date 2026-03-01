import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, logout as apiLogout, getPermissionInfo as apiGetPermissionInfo } from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  function setTokens(newAccessToken, newRefreshToken) {
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }

  function resetLoginState() {
    isLoading.value = false;
    error.value = null;
  }

  async function login(username, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await apiLogin(username, password);
      setTokens(data.accessToken, data.refreshToken);
      await fetchPermissionInfo();
      return true;
    } catch (e) {
      error.value = e.message || 'An unknown error occurred';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPermissionInfo() {
    if (!accessToken.value) return;
    try {
      const userInfo = await apiGetPermissionInfo();
      user.value = userInfo?.user || null;
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (e) {
      console.error("Failed to fetch user info:", e);
    }
  }

  async function logout() {
    if (accessToken.value) {
      try {
        await apiLogout();
      } catch (e) {
        console.error("API logout failed, clearing client-side state anyway.", e);
      }
    }
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async function tryToResumeSession() {
    if (accessToken.value) {
      await fetchPermissionInfo();
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    tryToResumeSession,
    resetLoginState,
    setTokens,
  };
});
