# ZEVANY Luxury Jewelry Store

A modern, responsive e-commerce website for luxury jewelry built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog**: Browse rings, necklaces, bracelets, and earrings
- 🛒 **Shopping Cart**: Add items to cart with persistent storage
- ❤️ **Wishlist**: Save favorite items for later
- 👤 **User Authentication**: Login/register functionality
- 📱 **Responsive Design**: Optimized for all devices
- 🎨 **Modern UI**: Clean, luxury-focused design
- 🔍 **Product Search**: Find products easily
- 📦 **Order Management**: Track orders and view history
- 💳 **PayPal Integration**: Secure payment processing
- 🔐 **Admin Panel**: Manage products, orders, and users

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Click the deploy button:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/zevany-store)

2. Set up environment variables in Vercel dashboard (see Environment Variables section below)

3. Deploy and enjoy!

### Option 2: Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd zevany-store
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables (see section below).

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Environment Variables

### Required for Full Functionality

Create a `.env.local` file with these variables:

```env
# Supabase Configuration (Required for database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration (Required for admin access)
ADMIN_EMAIL=admin@zevany.com
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (Optional - for contact forms)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@zevany.com

# PayPal Configuration (Optional - for payments)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Fallback Mode

The application will run in **fallback mode** if Supabase is not configured:
- Uses static product data from `/src/data/products.ts`
- Admin features will be limited
- No user authentication or order management

## Database Setup (Supabase)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your credentials** from Project Settings > API

3. **Set up the database schema** by running the SQL commands in `/supabase/migrations/`

4. **Add environment variables** to your deployment platform

## Admin Access

### Development
- Visit `/admin/direct-access` for instant admin access during development

### Production
- Visit `/admin/login`
- Use the credentials set in your environment variables

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── (routes)/          # Page routes
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # Reusable components
│   ├── utils/             # Utility functions
│   └── data/              # Static data files
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── styles/                # Additional stylesheets
```

## Key Features

### 🛍️ E-commerce Functionality
- Product browsing and filtering
- Shopping cart with persistence
- Wishlist functionality
- Order management
- PayPal payment integration

### 👤 User Management
- User registration and login
- Profile management
- Order history
- Authentication protection

### 🔧 Admin Panel
- Product management (CRUD operations)
- Order tracking and management
- User management
- PayPal transaction monitoring

### 📱 Modern Design
- Responsive design for all devices
- Luxury-focused UI/UX
- Smooth animations and transitions
- Optimized performance

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions:
- Create an issue in the repository
- Contact: support@zevany.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.