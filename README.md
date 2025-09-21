# Blocstage - Event Management Platform

<div align="center">

![Blocstage Logo](public/images/blocsagelogo.png)

**A modern, full-featured event management platform built with Next.js and TypeScript**

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

[Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing) • [License](#-license)

</div>

## 📖 About

Blocstage is a comprehensive event management platform that empowers event organizers to create, manage, and host successful events. Built with modern web technologies, it provides an intuitive interface for event creation, ticket management, attendee engagement, and real-time analytics.

### 🎯 Mission

To democratize event management by providing a powerful, user-friendly platform that scales from small meetups to large conferences, enabling organizers to focus on what matters most - creating memorable experiences.

## ✨ Features

### 🎪 Event Management
- **Event Creation Wizard** - Step-by-step event setup with guided forms
- **Rich Event Details** - Comprehensive event information with images, descriptions, and metadata
- **Event Scheduling** - Flexible date/time management with timezone support
- **Location Management** - Venue details with map integration
- **Event Templates** - Pre-built templates for different event types

### 🎫 Ticket Management
- **Multiple Ticket Types** - Support for paid and free events
- **Dynamic Pricing** - Early bird, group discounts, and tiered pricing
- **Inventory Control** - Real-time ticket availability tracking
- **Currency Support** - Multi-currency pricing (USDC, USD, etc.)
- **Ticket Validation** - Secure ticket verification system

### 📅 Agenda & Sessions
- **Session Management** - Create and manage event sessions
- **Speaker Profiles** - Detailed speaker information with photos
- **Time Management** - Precise scheduling with conflict detection
- **Session Tracks** - Organize sessions by topics or themes
- **Interactive Schedules** - Dynamic agenda with real-time updates

### 👥 User Management
- **Authentication System** - Secure login/signup with email verification
- **User Profiles** - Comprehensive user profile management
- **Role-Based Access** - Organizer, attendee, and admin roles
- **Session Management** - Automatic session timeout and renewal
- **Password Recovery** - Secure password reset functionality

### 📊 Analytics & Reporting
- **Real-time Dashboard** - Live event statistics and metrics
- **Attendee Analytics** - Detailed attendee behavior insights
- **Revenue Tracking** - Comprehensive financial reporting
- **Event Performance** - Success metrics and KPIs
- **Export Capabilities** - Data export in multiple formats

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first, cross-device compatibility
- **Dark/Light Themes** - User preference support
- **Accessibility** - WCAG 2.1 compliant interface
- **Component Library** - Reusable UI components
- **Smooth Animations** - Engaging micro-interactions

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blocstage.git
   cd blocstage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.blocstage.com
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   
   # Database (if using local database)
   DATABASE_URL=your-database-url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
blocstage/
├── app/                    # Next.js 13+ App Router
│   ├── createevent/       # Event creation pages
│   ├── events/            # Event listing and details
│   ├── login/             # Authentication pages
│   ├── signup/            # User registration
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── EventDashboard.tsx # Event management dashboard
│   ├── BuyTicketPage.tsx  # Ticket purchasing interface
│   └── AgendaScheduleForm.tsx # Session management
├── hooks/                 # Custom React hooks
│   └── useSessionManager.ts # Session management logic
├── lib/                   # Utility functions
│   ├── utils.ts          # General utilities
│   ├── dateValidation.ts # Date/time validation
│   └── slugUtils.ts      # URL slug generation
├── public/               # Static assets
│   ├── images/          # Image assets
│   └── font/            # Custom fonts
├── docs/                # Documentation
│   ├── SESSION_MANAGEMENT.md
│   └── SESSIONS_API_INTEGRATION.md
└── README.md            # This file
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 13.5.1** - React framework with App Router
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Backend Integration
- **RESTful API** - Integration with Blocstage API
- **Authentication** - JWT-based auth system
- **File Upload** - Cloudinary integration
- **Session Management** - Custom session handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Next.js DevTools** - Development utilities

## 📚 Documentation


### Development Guides
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project
- [Code Style Guide](./docs/CODE_STYLE.md) - Coding standards and conventions
- [Testing Guide](./docs/TESTING.md) - Testing strategies and best practices
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
- Use the [GitHub Issues](https://github.com/Favour-dgreat/blocstage/issues) to report bugs
- Include detailed steps to reproduce the issue
- Provide system information and browser details
- Attach screenshots or error logs when possible

### 💡 Feature Requests
- Submit feature requests via [GitHub Discussions](https://github.com/Favour-dgreat/blocstage/discussions)
- Describe the use case and expected behavior
- Consider the impact on existing functionality
- Provide mockups or examples when helpful

### 🔧 Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/Favour-dgreat/blocstage.git
   cd blocstage
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the [Code Style Guide](./docs/CODE_STYLE.md)
   - Write tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots for UI changes

### 📋 Contribution Guidelines

#### Code Standards
- **TypeScript** - Use TypeScript for all new code
- **ESLint** - Follow the project's ESLint configuration
- **Prettier** - Use Prettier for code formatting
- **Naming** - Use descriptive variable and function names
- **Comments** - Document complex logic and public APIs

#### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add password reset functionality
fix(ui): resolve mobile layout issues
docs(readme): update installation instructions
test(api): add unit tests for session management
```

#### Pull Request Process
1. **Small, focused changes** - Keep PRs small and focused on a single feature/fix
2. **Clear descriptions** - Explain what the PR does and why
3. **Tests included** - Add tests for new functionality
4. **Documentation updated** - Update docs for new features
5. **Screenshots** - Include screenshots for UI changes

### 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues
- `status: in progress` - Currently being worked on
- `status: needs review` - Ready for review

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Test Structure
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - API integration and data flow testing
- **E2E Tests** - End-to-end user journey testing
- **Visual Regression Tests** - UI consistency testing

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build Docker image
docker build -t blocstage .

# Run container
docker run -p 3000:3000 blocstage
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 Performance

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Features
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic code splitting for optimal loading
- **Static Generation** - Pre-rendered pages for better performance
- **Caching** - Intelligent caching strategies
- **Bundle Analysis** - Regular bundle size monitoring

## 🔒 Security

### Security Features
- **Authentication** - Secure JWT-based authentication
- **Input Validation** - Comprehensive input sanitization
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API rate limiting and abuse prevention
- **Secure Headers** - Security headers implementation

### Reporting Security Issues
Please report security vulnerabilities privately to security@blocstage.com

## 📈 Roadmap

### 🎯 Short Term (Q1 2024)
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Email marketing integration

### 🚀 Long Term (2024)
- [ ] AI-powered event recommendations
- [ ] Live streaming integration
- [ ] Advanced reporting tools
- [ ] White-label solutions
- [ ] Enterprise features

## 🤝 Community

### 💬 Get Help
- [GitHub Discussions](https://github.com/Favour-dgreat/blocstage/discussions) - Community discussions
- [Discord Server](https://discord.gg/blocstage) - Real-time chat support
- [Stack Overflow](https://stackoverflow.com/questions/tagged/blocstage) - Technical questions

### 📢 Stay Updated
- [GitHub Releases](https://github.com/Favour-dgreat/blocstage/releases) - Release notes
- [Newsletter](https://blocstage.com/newsletter) - Monthly updates
- [Twitter](https://twitter.com/blocstage) - Latest news and updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives
- **Contributors** - All the amazing people who contribute to this project



<div align="center">

**Made with ❤️ by the Blocstage Team**

[Website](https://blocstage.com) • [Documentation](https://docs.blocstage.com) • [Community](https://discord.gg/blocstage) • [GitHub](https://github.com/yourusername/blocstage)

</div>
