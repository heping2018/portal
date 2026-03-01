import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/authStore';

/**
 * Composable for handling user authentication logic.
 * It provides a clean, reactive interface to interact with the auth store.
 */
export function useAuth() {
  const authStore = useAuthStore();

  // Use storeToRefs to create reactive refs for the state properties.
  const { isAuthenticated, user, isLoading, error } = storeToRefs(authStore);

  // Actions can be destructured directly.
  const { login, logout, tryToResumeSession, resetLoginState } = authStore;

  return {
    // State (as reactive refs)
    isAuthenticated,
    currentUser: user,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    tryToResumeSession,
    resetLoginState, // Expose the reset action
  };
}
