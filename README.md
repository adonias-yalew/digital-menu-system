# SMASH&CO Restaurant Management System

A modern, multilingual restaurant management system built with React, TypeScript, and Supabase.

## Features

### Public Features
- 🍔 **Multilingual Menu**: English, Amharic, and Oromo language support
- 🔍 **Advanced Filtering**: Filter by category, price range, popularity, spice level, dietary preferences
- 📱 **Mobile-First Design**: Responsive UI optimized for all devices
- ⭐ **Customer Feedback**: Submit ratings and feedback directly to the database
- 💳 **Payment Integration**: Ready for payment processing

### Admin Features
- 🔐 **Secure Authentication**: Admin-only access with Supabase Auth
- 📊 **Dashboard Analytics**: Real-time stats for menu items and feedback
- 🍽 **Menu Management**: Full CRUD operations for menu items
- 💬 **Feedback Management**: View, analyze, and manage customer feedback
- 🎨 **Modern Admin UI**: Clean, professional dashboard interface

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: TailwindCSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and Supabase client
├── pages/              # Page components
│   ├── public/         # Public-facing pages
│   └── admin/          # Admin-only pages
├── routes/             # Route protection components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── assets/             # Static assets (images, etc.)
```

## Setup Instructions

### 1. Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin@yourdomain.com
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor
3. Set up Authentication:
   - Enable email/password authentication
   - Create your admin user account
4. Configure Row Level Security (RLS) policies are included in the schema

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Schema

### menu_items Table
- `id`: UUID primary key
- `name_en`, `name_am`, `name_om`: Multilingual names
- `description_en`, `description_am`, `description_om`: Multilingual descriptions
- `price`: Price in ETB
- `category`: Item category (burgers, sides, drinks, etc.)
- `is_spicy`, `is_popular`, `is_vegetarian`, `is_new`: Boolean flags
- `image_url`: URL to item image
- `weight`: Item weight (optional)
- `created_at`, `updated_at`: Timestamps

### feedbacks Table
- `id`: UUID primary key
- `customer_name`: Customer's name
- `message`: Feedback message
- `rating`: 1-5 star rating
- `created_at`: Submission timestamp

## Security Features

### Authentication
- Supabase Auth for secure user management
- Admin role verification
- Session persistence
- Automatic redirects for protected routes

### Row Level Security (RLS)
- Public read access to menu items
- Authenticated write access for admin operations
- Public feedback submission
- Admin-only feedback management

## API Routes

### Public Routes
- `/` - Main menu page
- `/about` - Restaurant information
- `/feedback` - Customer feedback form
- `/payment` - Payment page

### Admin Routes
- `/admin` - Redirects to dashboard
- `/admin/login` - Admin login
- `/admin/dashboard` - Main admin dashboard
- `/admin/menu` - Menu management
- `/admin/feedback` - Feedback management

## Development Notes

### Multilingual Support
The system supports three languages:
- **English** (en): Default language
- **Amharic** (am): Ethiopian script
- **Oromo** (om): Ethiopian script

All text content is stored in the database with separate columns for each language.

### Admin Access
Only users with the email specified in `VITE_ADMIN_EMAIL` can access admin features. This is implemented through the `isAdmin()` function in the auth service.

### Performance Optimizations
- Database indexes on frequently queried columns
- Lazy loading for menu items
- Optimized filtering with useMemo
- Image lazy loading

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports static sites with environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:
- Check the documentation in this README
- Review the SQL schema for database questions
- Ensure all environment variables are properly set
