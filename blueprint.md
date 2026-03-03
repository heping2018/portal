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

## Current Task: Update Backend Address

### Plan

1.  **Analyze the Request:** The user requested to change the backend API address.
2.  **Locate Configuration:** The backend address is configured in the `vite.config.ts` file within the `server.proxy` settings.
3.  **Update Configuration:** The `target` property of the proxy configuration was updated from `http://localhost:8080` to `https://unstruggling-remona-actionably.ngrok-free.dev`.
4.  **Verify the Change:** The application will now forward API requests to the new backend address.
