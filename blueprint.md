# Blueprint - Interactive Product Catalog

## 1. Overview

This project is a modern, responsive product catalog application built with Vue.js, TypeScript, and Vite. It provides a seamless user experience for browsing, searching, and filtering products. The application is designed with a clean, visually appealing interface and is optimized for performance.

## 2. Core Features & Design

### 2.1. Overall Design Philosophy

*   **Modern & Clean:** The UI is designed to be aesthetically pleasing, using a dark theme with vibrant blue accents, creating a high-tech feel.
*   **Responsive:** The layout adapts to various screen sizes, ensuring a consistent experience on desktops, tablets, and mobile devices.
*   **Interactive:** Elements like the product grid feature subtle animations and hover effects to enhance user engagement.
*   **Internationalization (i18n):** The app supports multiple languages (English and Chinese) to cater to a global audience.

### 2.2. Key Implemented Features

*   **Main Navigation (`NavBar.vue`):**
    *   A persistent, translucent navigation bar that becomes opaque on scroll.
    *   Provides access to all core modules: Home, Products, News, Case Studies, Solutions, Recruitment, Certifications, R&D Center, and About Us.
    *   Includes a language switcher and user authentication links.

*   **Product Catalog (`ProductView.vue`):**
    *   Displays products in a visually appealing grid.
    *   Features robust filtering by category and keyword search.

*   **R&D Center (`RdCenterView.vue`, `InnovationDetailView.vue`):**
    *   Displays a list of innovation achievements in a modern card-based grid.
    *   Provides a detailed view for each innovation.

*   **Business Solutions (`SolutionView.vue`, `SolutionDetailView.vue`):**
    *   Displays a list of business solutions, categorized by industry.
    *   Provides a detail page for each solution.

*   **Case Studies (`CaseStudiesView.vue`, `CaseStudyDetailView.vue`):**
    *   Displays a browsable list of all case studies, filterable by industry.
    *   Provides a detailed view for each case study.

*   **Recruitment Portal (`RecruitmentView.vue`, `JobDetailView.vue`):**
    *   Lists all open job positions.
    *   Provides a detailed view for each job with an application form.

## 3. Current Change: Add Core Modules to Navigation

This section outlines the plan for making the Case Studies, Solutions, and Recruitment modules accessible from the main navigation bar.

### 3.1. Plan & Steps

1.  **Update Navigation Component (`src/components/NavBar.vue`):**
    *   Added `<router-link>` elements pointing to the routes for `/case-studies`, `/solutions`, and `/recruitment`.

2.  **Update Internationalization (i18n) Files (`en.json`, `zh.json`):**
    *   Added translation keys (`nav.case_studies`, `nav.solutions`, `nav.recruitment`) to both language files to ensure the navigation links are displayed correctly in both English and Chinese.
