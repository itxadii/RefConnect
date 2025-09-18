# RefConnect - Job/Internship Referral Portal

A modern, gamified platform connecting job seekers with referral opportunities through a comprehensive reward system and multilingual support.

## 🎯 Features

### Core Features
- **Resume Upload & Management**: Upload and manage resumes with keyword analysis
- **Job Search & Filtering**: Search opportunities by skills, company, and location
- **Referral System**: Apply for referrals and track application status
- **Alumni Network**: Connect with alumni who can provide referrals

### 🏆 Gamification System
- **Achievement Badges**: Profile completion, first application, referral acceptance
- **Points System**: Earn points for actions, redeem for mentorship credits
- **Progress Tracking**: Visual progress bars and milestone celebrations

### 🔐 Authentication
- **Secure Login/Registration**: Email/password with validation
- **Protected Routes**: Dashboard, Rewards, Analytics require authentication
- **Session Management**: Persistent sessions with auto-refresh

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd refconnect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔐 Authentication Testing

### Sign Up
1. Click "Get Started" on the homepage
2. Fill in your full name, email, and password
3. Check your email for verification link
4. Click the verification link

### Sign In
1. Click "Sign In" on the homepage
2. Enter your verified email and password
3. You'll be redirected to the dashboard

### Testing Credentials
For quick testing, you can:
- Create any account with a valid email format
- Use a strong password (6+ chars, uppercase, lowercase, number)
- Email verification is required in production

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase** for authentication and backend

### Authentication
- **Supabase Auth** with email/password
- **Protected routes** for authenticated content
- **JWT token management** with automatic refresh

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Navigation.tsx  # Main navigation with auth state
│   ├── ProtectedRoute.tsx  # Route protection wrapper
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Sign in page ✅
│   ├── Register.tsx    # Sign up page ✅
│   ├── Dashboard.tsx   # Protected user dashboard
│   └── ...
└── integrations/       # External service integrations
    └── supabase/       # Supabase client and types
```

## ✅ Authentication Features

### Login Page (`/login`)
- ✅ **Email validation**: Real-time format checking
- ✅ **Password validation**: Minimum length requirements
- ✅ **Loading states**: Spinner and disabled button during submission
- ✅ **Error handling**: Clear error messages for invalid credentials
- ✅ **Keyboard support**: Submit with Enter key
- ✅ **Password visibility**: Toggle show/hide password
- ✅ **Accessibility**: ARIA labels, error announcements
- ✅ **Mobile responsive**: Touch-friendly on all devices

### Register Page (`/register`)
- ✅ **Full name validation**: Required field with length check
- ✅ **Email validation**: Format and uniqueness checking
- ✅ **Password strength**: Uppercase, lowercase, number requirements
- ✅ **Password confirmation**: Must match original password
- ✅ **Real-time validation**: Instant feedback as you type
- ✅ **Success handling**: Email verification flow

### Security Features
- ✅ **Session persistence**: Stay logged in across browser sessions
- ✅ **Auto token refresh**: Seamless session management
- ✅ **Protected routes**: Automatic redirect to login when needed
- ✅ **Secure logout**: Complete session cleanup

## 🎨 Design System

The application uses a consistent design system with:
- **Professional color palette**: Blue/green gradients for trust & growth
- **Typography**: Modern sans-serif fonts
- **Responsive layout**: Works on all screen sizes
- **Smooth animations**: Micro-interactions and loading states
- **Accessibility**: WCAG compliant with proper contrast

## 🧪 Manual Testing Guide

### Authentication Flow Testing
1. **Registration**:
   - Try invalid email formats → Should show validation error
   - Try weak passwords → Should show strength requirements
   - Use non-matching passwords → Should show mismatch error
   - Submit valid form → Should show success message

2. **Login**:
   - Try invalid credentials → Should show error message
   - Try unverified account → Should prompt for email verification
   - Use valid credentials → Should redirect to dashboard

3. **Protected Routes**:
   - Visit `/dashboard` while logged out → Should redirect to login
   - Log in and visit protected routes → Should allow access
   - Log out → Should redirect to home page

### UI/UX Testing
- **Loading states**: Button shows spinner during API calls
- **Form validation**: Real-time feedback as you type
- **Error messages**: Clear, actionable error descriptions
- **Success feedback**: Toast notifications for successful actions
- **Mobile responsiveness**: Test on different screen sizes
- **Keyboard navigation**: Tab through forms, submit with Enter

## 🚀 Deployment

This project can be deployed to:

### Lovable (Recommended)
1. Open [Lovable](https://lovable.dev/projects/cdbcdb6f-7006-4c4d-af43-11136f573bb0)
2. Click Share → Publish
3. Your app is live with automatic SSL

### Vercel
1. Connect GitHub repository to Vercel
2. Environment variables are pre-configured
3. Deploy with zero configuration

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Automatic deployment on git push

## 🔧 Environment Configuration

The application is pre-configured with Supabase. No additional environment setup is required for development.

For production deployments, ensure your domain is added to:
- Supabase Auth → URL Configuration → Redirect URLs
- Supabase Auth → URL Configuration → Site URL

## 📞 Support

For help with authentication issues:
1. Check the browser console for error messages
2. Verify email format and password requirements
3. Ensure email verification is completed
4. Check Supabase dashboard for user status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase.
