# Tea - Admin Dashboard & E-Commerce Platform

A modern, full-stack e-commerce platform for tea products built with Next.js, React, and Supabase. Features an admin dashboard, user authentication, product management, and integrated payment processing with eSewa.

## Features

- 🎨 **Modern UI** - Built with Radix UI components and Tailwind CSS
- 🌓 **Dark/Light Mode** - Theme toggle with localStorage persistence
- 🔐 **Authentication** - Secure user authentication via Supabase
- 👨‍💼 **Admin Dashboard** - Manage products, pricing, and user profiles
- 💳 **Payment Integration** - eSewa payment gateway integration
- 📱 **Responsive Design** - Fully responsive and mobile-friendly
- ⚡ **Type-Safe** - Built with TypeScript for better code quality
- 🎯 **SSR & SSG** - Server-side rendering with Next.js App Router

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org) 16.1.1 with React 19.2.3
- **Database & Auth**: [Supabase](https://supabase.com)
- **UI Components**: [Radix UI](https://radix-ui.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4
- **Icons**: [Lucide React](https://lucide.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Linting**: [ESLint](https://eslint.org)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- eSewa merchant account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_ESEWA_MERCHANT_CODE=your_esewa_merchant_code
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── admin/                # Admin dashboard
│   │   ├── login/            # Admin login page
│   │   └── dashboard/        # Dashboard with profile & pricing management
│   ├── api/                  # API routes
│   │   ├── admin/            # Admin endpoints
│   │   │   ├── update-profile/
│   │   │   └── update-price/
│   │   ├── auth/             # Authentication
│   │   │   └── logout/
│   │   └── esewa-pay/        # Payment processing
│   └── success/              # Payment success page
├── components/
│   └── ui/                   # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   ├── utils.ts              # Utility functions
│   └── supabase/             # Supabase client setup
│       ├── client.ts         # Client-side Supabase
│       └── server.ts         # Server-side Supabase
└── types/                    # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/logout` - User logout

### Admin
- `POST /api/admin/update-profile` - Update admin profile
- `POST /api/admin/update-price` - Update product pricing

### Payment
- `POST /api/esewa-pay` - Process eSewa payment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✓ |
| `NEXT_PUBLIC_ESEWA_MERCHANT_CODE` | eSewa merchant code | ✓ |

## Database Setup

The application uses Supabase for authentication and data storage. Set up the following tables in your Supabase project:

- **users** - User profiles and authentication (Supabase Auth)
- **products** - Tea product catalog
- **pricing** - Product pricing
- **orders** - Customer orders (optional)

Refer to Supabase documentation for setting up tables and RLS policies.

## Development

### Code Style
- TypeScript for type safety
- ESLint configuration included
- Follow component naming conventions

### Adding New Components
Place new UI components in `src/components/ui/` using Radix UI primitives.

### Database Queries
Use Supabase client from `src/lib/supabase/client.ts` for client-side queries and `src/lib/supabase/server.ts` for server-side operations.

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any platform supporting Node.js:
- Railway
- Render
- DigitalOcean
- AWS
- Google Cloud

## Security Considerations

- Always use HTTPS in production
- Store sensitive keys in environment variables
- Enable Row Level Security (RLS) in Supabase
- Validate all API requests server-side
- Keep dependencies updated

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Test your code
4. Submit a pull request

## License

This project is private. All rights reserved.

## Support

For issues and questions, contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js and Supabase
