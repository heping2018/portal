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
    if (newAccessToken) {
      accessToken.value = newAccessToken;
      localStorage.setItem('accessToken', newAccessToken);
    } else {
      accessToken.value = null;
      localStorage.removeItem('accessToken');
    }

    if (newRefreshToken) {
      refreshToken.value = newRefreshToken;
      localStorage.setItem('refreshToken', newRefreshToken);
    } else {
      refreshToken.value = null;
      localStorage.removeItem('refreshToken');
    }
  }

  function resetLoginState() {
    isLoading.value = false;
    error.value = null;
  }

  async function login(username, password) {
    isLoading.value = true;
    error.value = null;
    try {
      // `response` is the object { code, msg, data: { accessToken, ... } }
      const response = await apiLogin(username, password);
      
      // CORRECTLY extract the tokens from the inner `data` object
      if (response && response.code === 0 && response.data && response.data.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        await fetchPermissionInfo();
        return true;
      } else {
        throw new Error(response.msg || 'Login failed: Invalid response from server.');
      }
    } catch (e) {
      error.value = e.message || 'An unknown error occurred';
      setTokens(null, null); // Ensure any partial state is cleared
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
      // If fetching user info fails due to auth error, trigger logout
      if (e.message.includes('401')) {
        logout();
      }
    }
  }

  async function logout() {
    const tokenBeforeLogout = accessToken.value;
    
    // Clear client state immediately for responsive UI
    setTokens(null, null);
    user.value = null;
    localStorage.removeItem('user');

    // Attempt to call backend logout only if a token was present
    if (tokenBeforeLogout) {
      try {
        await apiLogout(); 
      } catch (e) {
        console.error("API logout call failed, but client state is already cleared.", e);
      }
    }
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
