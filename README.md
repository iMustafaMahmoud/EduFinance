# EduFinance - Buy Now, Pay Later for Education

A comprehensive BNPL (Buy Now, Pay Later) application for education financing, built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

### End User (Student/Parent)
- **Authentication**: Sign up, sign in, and sign out with secure password storage
- **Browse Schools**: Search and filter schools/universities by name, gender, and area with animated cards
- **Apply for Installments**: Submit applications for payment plans
- **Track Applications**: View application status (pending, approved, rejected)
- **Checkout**: Complete down payment (20% of total) after approval
- **Manage Plans**: View and pay monthly installments
- **Payment Progress**: Track payment history and remaining balance with visual progress bars
- **Animations**: Smooth page transitions and interactive UI elements with Framer Motion

### Admin
- **Dashboard**: Overview of platform statistics with real-time data
- **School Management**: Add, edit, and manage schools/universities visibility
- **Application Review**: Approve or reject student applications with reasons
- **Plan Monitoring**: View all installment plans and their statuses
- **Detailed Reports**: Access comprehensive payment and user information
- **Filters & Search**: Advanced filtering across all management pages

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router with Server Components)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components inspired by shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Testing**: Jest + React Testing Library
- **Backend**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd end-user
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Or run all setup steps at once
npm run db:setup
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

### End User
- Email: `john@example.com`
- Password: `password123`

### Admin
- Email: `admin@example.com`
- Password: `password123`

## Project Structure

```
/app
  /api                      # API routes with Prisma integration
    /auth                   # Authentication endpoints
      /signin               # Sign in endpoint
      /signup               # Sign up endpoint
    /schools                # School management endpoints
    /applications           # Application management endpoints
    /plans                  # Installment plan endpoints
  /auth                     # Authentication pages
    /signin                 # Sign in page
    /signup                 # Sign up page
  /dashboard                # End user dashboard and features
    /schools                # Browse schools
    /applications           # View applications
    /plans                  # Manage installment plans
    /checkout               # Payment checkout
  /admin                    # Admin dashboard and features
    /schools                # School management
    /applications           # Application review
    /plans                  # Plan monitoring
/components
  /ui                       # Reusable UI components (Button, Card, Badge, etc.)
  /animations.tsx           # Framer Motion animation utilities
  /__tests__                # Component unit tests
/lib
  auth-context.tsx          # Authentication context provider
  prisma.ts                 # Prisma client instance
  types.ts                  # Centralized TypeScript type definitions
  utils.ts                  # Utility functions
/prisma
  schema.prisma             # Database schema
  seed.ts                   # Database seeding script
```

## Key Features Implementation

### Architecture
- **Server Components**: Data fetching happens on the server for optimal performance
- **Client Components**: Interactive UI elements with client-side state management
- **Type Safety**: Centralized type definitions with Prisma-generated types
- **Code Organization**: Clear separation between server and client logic

### Authentication
- Secure authentication using Prisma and bcrypt (mocked for demo)
- Role-based routing (end_user vs admin)
- Protected routes with auth context
- Persistent sessions using localStorage

### Payment Flow
1. User browses schools and selects one
2. Submits application with desired amount and installment count
3. Admin reviews and approves/rejects
4. Upon approval, installment plan is created (status: "submitted")
5. User completes 20% down payment
6. Plan becomes "active"
7. User pays monthly installments
8. Plan becomes "completed" when all payments are made

### Database Management
- Prisma ORM with SQLite for development
- Type-safe database queries
- Seed data for schools, users, and sample applications
- Database migrations for schema changes
- All CRUD operations through API routes

### Animations
- Page transitions with fade-in effects
- Staggered list animations
- Hover effects on cards and buttons
- Progress bar animations
- Interactive button feedback

### Testing
- Unit tests for components with Jest and React Testing Library
- API route testing
- Utility function testing
- Mocked dependencies for isolated testing

## Application Lifecycle

### Applications
- **Pending**: Awaiting admin review
- **Approved**: Ready for checkout
- **Rejected**: Declined with reason

### Installment Plans
- **Submitted**: Approved but awaiting down payment
- **Active**: Down payment completed, monthly payments in progress
- **Completed**: All installments paid

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### Schools
- `GET /api/schools` - List all schools (with filters)
- `GET /api/schools/[id]` - Get school details
- `POST /api/schools` - Create new school (admin)
- `PUT /api/schools/[id]` - Update school (admin)

### Applications
- `GET /api/applications` - List applications (filtered by user/status)
- `GET /api/applications/[id]` - Get application details
- `POST /api/applications` - Submit new application
- `PUT /api/applications/[id]` - Approve/reject application (admin)

### Installment Plans
- `GET /api/plans` - List installment plans
- `GET /api/plans/[id]` - Get plan details
- `POST /api/plans/[id]/pay` - Make payment (down payment or installment)

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:setup     # Run all database setup steps
npm run db:studio    # Open Prisma Studio (database GUI)
```

### Testing
```bash
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Development Notes

### Mock Payment System
- Payment forms are non-functional (mock only)
- Payments are processed immediately when submitted
- No actual payment gateway integration

### Database
- Development uses SQLite for simplicity
- Production should use PostgreSQL or another production-ready database
- Update `DATABASE_URL` in `.env` file to change database

### Server Components
- Most pages use Server Components for data fetching
- Client Components handle interactivity (forms, filters, animations)
- Data is passed from Server to Client Components via props

### Type Safety
- All types centralized in `lib/types.ts`
- Prisma-generated types extended for relations
- Strict TypeScript configuration

### Testing Best Practices
- Mock external dependencies (Prisma, Next.js router)
- Test user interactions and component rendering
- Isolate unit tests from integration tests
- Use descriptive test names

## Future Enhancements

- Real payment gateway integration (Stripe, PayPal)
- Email notifications for application status changes
- SMS reminders for upcoming payments
- Dashboard analytics and charts with visualizations
- Export reports to PDF/Excel
- Dark mode support
- Enhanced accessibility features
- Real-time notifications with WebSockets
- Mobile app with React Native
- Multi-currency support
- Integration with school management systems

## Troubleshooting

### Prisma Issues
If you encounter Prisma-related errors:
```bash
# Reset the database
npm run db:migrate -- --name init

# Regenerate Prisma Client
npm run db:generate

# Restart TypeScript server in your IDE
```

### Test Issues
If tests fail to run:
```bash
# Install missing dependencies
pnpm add -D @jest/test-sequencer

# Clear Jest cache
npx jest --clearCache

# Run tests again
npm run test
```

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

## Deployment

### Deploy to Vercel

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/edufinance)

#### Manual Deployment

1. **Set Environment Variable**:
   - Go to your Vercel project settings
   - Add `DATABASE_URL` environment variable
   - For development: `file:./dev.db`
   - For production: Use Vercel Postgres or another database service

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Run Migrations** (if using a production database):
   ```bash
   npx prisma migrate deploy
   ```

**Important**: See `VERCEL_ENV_SETUP.md` for detailed deployment instructions and database configuration.

### Production Database

⚠️ **SQLite is not recommended for production!**

For production deployments, use:
- **Vercel Postgres** (recommended) - Native integration
- **Supabase** - PostgreSQL with generous free tier
- **PlanetScale** - MySQL with serverless driver
- **Railway** - PostgreSQL hosting

See `VERCEL_DEPLOYMENT.md` for complete setup instructions.

## License

This is a demo application for educational purposes.

## Contributing

This is a demonstration project. For educational use and portfolio purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Database management with [Prisma](https://www.prisma.io/)
