<template>
  <div class="dynamic-grid-background"></div>
</template>

<style scoped>
.dynamic-grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* Behind all content */
  background-color: #000B18; /* Deep space blue */
  overflow: hidden; /* Hide overflow from animations */

  /* Animated Grid Lines */
  background-image:
    linear-gradient(to right, rgba(0, 195, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 195, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: grid-pan 120s linear infinite;
}

@keyframes grid-pan {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -800px -800px;
  }
}

/* Top Flowing Light Border */
.dynamic-grid-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px; /* Border height */
  background: linear-gradient(to right, transparent, #00c3ff, transparent);
  animation: flow-right 10s ease-in-out infinite;
}

@keyframes flow-right {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Right Flowing Light Border */
.dynamic-grid-background::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 2px; /* Border width */
  height: 100%;
  background: linear-gradient(to bottom, transparent, #00c3ff, transparent);
  animation: flow-down 10s ease-in-out infinite 2.5s; /* Staggered animation */
}

@keyframes flow-down {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* You could add more pseudo-elements for bottom and left borders */
/* This would require another wrapping div as one element can only have two pseudo-elements */

</style>
