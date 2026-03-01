import { ref, onMounted } from 'vue';
import { getCertificates } from '../services/certificateService';

export function useCertifications() {
  const certifications = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCertifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      // The service returns the `data` property of the API response.
      // For certificates, this is an object like { data: [...] }.
      const response = await getCertificates();
      
      // We need to access the nested `data` property which contains the array.
      if (response && Array.isArray(response.data)) {
        certifications.value = response.data;
      } else {
        console.warn('Certifications data is not in the expected format:', response);
        certifications.value = []; // Default to empty array if format is wrong
      }
    } catch (err) {
      error.value = 'certifications.error';
      console.error('Failed to fetch certifications:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchCertifications);

  return {
    certifications,
    loading,
    error,
    fetchCertifications,
  };
}
