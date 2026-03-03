# Project Blueprint

## Overview

This project is a Vue.js application designed for a company's web presence. It includes features for displaying products, news, and company information. The application supports multiple languages and has an admin section for managing content.

## Implemented Features

### Styling and Design

*   **Responsive Layout:** The application is designed to be responsive and work on both mobile and web.
*   **Modern Aesthetics:** The UI incorporates modern design elements, including a blurred background navbar, utility-first CSS, and a clean, spaced-out layout.
*   **Scoped Styles:** Components use scoped styles to prevent CSS conflicts.

### Features

*   **Internationalization (i18n):** The application supports English, Spanish, Portuguese, and Chinese languages.
*   **Product Showcase:** Users can view a list of products and see detailed information for each product.
*   **News Section:** The application displays news articles.
*   **Certifications:** The application has a section to display company certifications.
*   **About Us Page:** The "About Us" page is composed of multiple sections, including company history, culture, and team members.
*   **Admin Dashboard:** A protected admin dashboard exists for managing application content.
*   **Authentication:**
    *   Users can log in to access protected routes.
    *   The authentication state is managed using Pinia.
    *   The UI correctly displays "Login" or "Logout" based on the user's authentication status.
*   **Backend Configuration:** The Vite development server is configured to proxy API requests to the correct backend address.

## Current Task: Fix Certificate Page & Deploy to GitHub

### Plan

1.  **Analyze the Issue:** The "资质证书管理" (Certificate Management) page was not displaying the list of certificates, even though the data was being fetched correctly from the backend. The component was not parsing the API response correctly.
2.  **Investigate the Code:** Examination of `src/views/AdminCertificateView.vue` revealed that the component was assigning the entire API response object to the `certificates` ref, instead of the `response.data.list` array which contains the actual certificate data.
3.  **Implement the Fix:** Modified the `fetchCertificates` function in `src/views/AdminCertificateView.vue` to correctly assign `response.data.list` to the `certificates` ref, resolving the data display issue.
4.  **Push to GitHub:**
    *   Staged all local changes using `git add .`.
    *   Committed the changes with the message: "fix: 修复证书管理页面数据显示问题并更新后端API地址".
    *   Pushed the committed changes to the `main` branch of the remote GitHub repository, using a personal access token for authentication.
5.  **Verification:** The certificate management page now correctly displays the list of certificates, and the latest code is successfully pushed to the GitHub repository.
