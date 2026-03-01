<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p>&copy; {{ new Date().getFullYear() }} Maxunitech. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// No script logic is needed for this simplified component.
</script>

<style scoped>
.app-footer {
  background-color: #000B18; /* Deep space blue */
  color: #a0a0a0;
  padding: 1.5rem 2rem; /* Adjusted padding for a cleaner look */
  border-top: 1px solid rgba(0, 195, 255, 0.2); /* Cyan border */
  position: relative;
  z-index: 10;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center; /* Center the content */
  font-size: 0.9rem;
}
</style>
