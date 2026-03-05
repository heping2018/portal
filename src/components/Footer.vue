<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p>&copy; {{ new Date().getFullYear() }} Company. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// No script logic is needed for this simplified component.
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  position: relative;
  z-index: 10;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 0.9rem;
}
</style>
