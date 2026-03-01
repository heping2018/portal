import { reactive, ref, watch } from 'vue';
import { getProductsPage } from '../services/productService';
import { debounce } from 'lodash-es';

export function useProducts() {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = reactive({
    pageNo: 1,
    pageSize: 9,
    total: 0,
  });

  const filters = reactive({
    keyword: '',
  });

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const params = {
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
        ...(filters.keyword && { keyword: filters.keyword }),
      };
      const data = await getProductsPage(params);
      products.value = data.list || [];
      pagination.total = data.total || 0;
    } catch (err) {
      error.value = 'product.fetch_error';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = debounce(() => {
    pagination.pageNo = 1;
    fetchProducts();
  }, 500);

  watch(() => pagination.pageNo, fetchProducts);
  watch(() => filters.keyword, debouncedFetch);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    fetchProducts,
  };
}
