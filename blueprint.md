# Blueprint - Interactive Product Catalog

## 1. Overview

This project is a modern, responsive product catalog application built with Vue.js, TypeScript, and Vite. It provides a seamless user experience for browsing, searching, and filtering products. The application is designed with a clean, visually appealing interface and is optimized for performance.

## 2. Core Features & Design

### 2.1. Overall Design Philosophy

*   **Modern & Clean:** The UI is designed to be aesthetically pleasing, using a dark theme with vibrant blue accents, creating a high-tech feel.
*   **Responsive:** The layout adapts to various screen sizes, ensuring a consistent experience on desktops, tablets, and mobile devices.
*   **Interactive:** Elements like the product grid feature subtle animations and hover effects (using Vanilla-Tilt.js) to enhance user engagement.
*   **Internationalization (i18n):** The app supports multiple languages (English, Chinese, Spanish, Portuguese) to cater to a global audience.

### 2.2. Key Implemented Features

*   **Product Catalog View (`ProductView.vue`):**
    *   Displays products in a visually appealing bento-style grid.
    *   Features robust filtering by category and keyword search.
*   **Product Detail View:**
    *   Shows comprehensive information for a single product.
*   **R&D Center (`RdCenterView.vue`, `InnovationDetailView.vue`):**
    *   Displays a list of innovation achievements in a modern card-based grid.
    *   Each card is interactive, with hover effects and a "Read More" link.
    *   Clicking a card navigates to a detailed view for that innovation.
    *   The detail page shows the full content of the innovation, including title, publication date, and a main image.
    *   Provides a link to navigate back to the main R&D Center page.

## 3. Current Change: Implementation of R&D Center Module

This section outlines the plan and steps taken to implement the R&D Center module.

### 3.1. Plan & Steps

1.  **Create R&D Center Service (`src/services/rdCenterService.js`):**
    *   **Action:** Created a new service file to handle API calls for the R&D module.
    *   **Functions:** `getInnovations()` to fetch a paginated list of innovations, and `getInnovationById(id)` to fetch details for a single innovation.

2.  **Create R&D Center Main Page (`src/views/RdCenterView.vue`):**
    *   **Action:** Built a new Vue component to display the list of innovation achievements.
    *   **Design:** Uses a responsive grid of cards with a modern, dark theme, gradient text for the title, and hover effects.
    *   **Data:** Fetches data using the `getInnovations` service function on mount.

3.  **Create Innovation Detail Page (`src/views/InnovationDetailView.vue`):**
    *   **Action:** Built a new Vue component for displaying the full details of an innovation.
    *   **Functionality:** Fetches data based on the `id` route parameter using the `getInnovationById` service function.
    *   **Layout:** Provides a clean, readable layout for the innovation's content, title, and metadata.

4.  **Update Router (`src/router/index.js`):**
    *   **Action:** Added new routes to integrate the new pages into the application.
    *   **Routes Added:**
        *   `/rd-center/innovations/:id` mapped to `InnovationDetailView`.

5.  **Update Internationalization (i18n) Files:**
    *   **Action:** Added new translation keys for the R&D Center title, subtitle, and other UI elements.
    *   **Files Modified:** `en.json`, `zh.json`, `es.json`, `pt.json`.

6.  **Update API Documentation:**
    *   **Action:** Removed the `GET /app-api/public/rd/innovations/{id}` endpoint from `unimplemented_api_documentation.md` as it is now implemented.

### 3.2. Summary of Changes

A new "R&D Center" section has been successfully added to the application. It allows users to browse a list of the company's innovation achievements and view detailed information for each one. The implementation followed the project's "add-only" principle, ensuring no disruption to existing functionalities. The new module is fully integrated with routing and internationalization.
