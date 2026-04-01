# **App Name**: Jeany's Olshoppe

## Core Features:

- Product Catalog & Details: Guests can browse and view detailed information for Japan surplus items, including square images, prices, conditions, and dynamically generated 'NEW' or 'Sold Out' badges. Products are displayed in a 2-column mobile grid and 4-column desktop grid.
- Product Search & Filtering: Allow guests to efficiently search for products by keywords and filter results based on category and condition, with 'Sold Out' items excluded from filter results.
- Direct Seller Contact: Provide prominent, full-width mobile buttons on product detail pages for guests to easily contact the seller (Jeany) regarding specific items via Messenger or WhatsApp.
- User Authentication & Wishlist: Registered users can securely log in/register via Supabase Auth and save favorite items to a personalized wishlist, which they can view and manage.
- Inventory Management Dashboard: A secure, admin-only dashboard (Jeany) for comprehensive management of product inventory, enabling adding new items, editing details, updating stock quantity, and archiving products.
- Automated Email Notifications: Automated email system for new product arrivals (to active subscribers), restock alerts (to wishlisters), and daily low-stock warnings (to admin) using Resend.com API.
- Server-side Image Optimization: Automatically process uploaded product images using the 'sharp' npm package to resize to a maximum of 800px width, crop to a 1:1 aspect ratio, and compress to JPEG quality 80, storing them in Supabase Storage.

## Style Guidelines:

- Primary color (text and main elements): Dark, earthy brown (#4A403A) to provide a grounded, natural feel and excellent readability.
- Background color: A very light, neutral grey (#E5E7EB) to offer a clean, unobtrusive canvas, as provided by the user.
- Accent color: A vibrant, warm pink-red (#FB7185) for call-to-action buttons, 'NEW' badges, and interactive highlights, as provided by the user, providing a lively contrast.
- Headlines and body text font: 'Alegreya' (serif), chosen for its elegant, intellectual, and contemporary feel that complements the curated nature of surplus items.
- Use clear, simple outline icons for navigation (Home, Shop, Saved, Me) and actions, ensuring easy recognition and tap targets.
- Strict mobile-first design with a base width of 375px; 2-column product grids on mobile scaling to 4 columns on desktop, bottom navigation bar on mobile, and full-width buttons for key actions.
- Subtle, fluid transitions for product filtering and page navigation to enhance the browsing experience without being distracting.