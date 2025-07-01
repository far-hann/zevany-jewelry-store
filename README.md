# ZEVANY Jewelry Store

A premium online jewelry store built with Next.js, featuring an admin CMS for easy content management.

## Features

- **Modern E-commerce Platform**: Built with Next.js for fast performance and SEO optimization
- **Admin CMS**: Built-in content management system for products, orders, and customers
- **Supabase Integration**: Cloud database for product storage and user management
- **Automated Dependency Updates**: Using GitHub Dependabot to keep dependencies secure and up-to-date

## Maintenance Guide

### Using the Admin CMS

1. Access the admin panel at `/admin`
2. Login with your admin credentials
3. From the dashboard, you can:
   - Manage products (add, edit, delete)
   - Process orders
   - View customer information
   - Update site content

### Automated Updates

This project uses GitHub Dependabot for automated dependency updates:

- Dependabot will create pull requests for outdated dependencies weekly
- Pull requests for minor and patch updates will be automatically approved and merged
- Major version updates require manual review to prevent breaking changes

### Deployment

The site is automatically deployed when changes are pushed to the main branch or when dependency updates are approved and merged.

## Development Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Seed the database
npm run db:seed
```

## Keeping Content Updated

1. **Products**: Use the Admin CMS to add new products or update existing ones
2. **Images**: Upload product images through the Admin CMS
3. **Collections**: Create and manage product collections through the Admin CMS
4. **Content Pages**: Update static content through the Admin CMS

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: [Your deployment platform]
- **CI/CD**: GitHub Actions
- **Dependencies**: Automatically updated with Dependabot
