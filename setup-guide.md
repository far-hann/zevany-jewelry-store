# ZEVANY Store Setup Guide

## Environment Configuration

To fix the API issues, you need to set up your environment variables. Follow these steps:

### 1. Create .env.local file
Copy the `.env.local` file that was created and update it with your actual values.

### 2. Supabase Setup (Required for database)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and keys from Settings > API
4. Update these in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Admin Configuration
Update these in `.env.local`:
- `ADMIN_EMAIL=admin@zevany.com`
- `ADMIN_PASSWORD=your-secure-password`

### 4. Email Configuration (for contact form)
1. Use Gmail with App Password
2. Update these in `.env.local`:
   - `EMAIL_USER=your-gmail@gmail.com`
   - `EMAIL_PASSWORD=your-app-password`

### 5. PayPal Configuration (for payments)
1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create an app and get your credentials
3. Update these in `.env.local`:
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`

## Why VS Code Shows No Errors

VS Code and other editors don't show errors because:

1. **Syntax is Valid** - All code is syntactically correct
2. **Runtime Issues** - Problems only occur when APIs are called
3. **Environment Variables** - Missing env vars don't cause syntax errors
4. **Database Connections** - Only fail at runtime when trying to connect

## Testing Your APIs

Run the test script to check which APIs are working:

```bash
node test-apis.js
```

This will show you exactly which APIs are working and which need configuration.

## Common Issues and Solutions

### Database Errors
- **Issue**: Supabase connection fails
- **Solution**: Set up Supabase project and update environment variables

### Authentication Errors
- **Issue**: Admin login fails
- **Solution**: Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local

### Email Errors
- **Issue**: Contact form fails to send emails
- **Solution**: Configure Gmail with App Password

### PayPal Errors
- **Issue**: Payment processing fails
- **Solution**: Set up PayPal developer account and add credentials

## Next Steps

1. Update your `.env.local` file with real values
2. Run `npm run dev` to start the development server
3. Test the APIs using the test script
4. Check the health endpoint at `/api/health` for configuration status