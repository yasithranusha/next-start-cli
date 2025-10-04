# Next Start CLI

A CLI tool to quickly create and set up Next.js projects with shadcn/ui components.

## Features

- Creates a new Next.js project with TypeScript, Tailwind CSS, and ESLint
- Initializes and configures shadcn/ui
- Option to add common shadcn/ui components
- Optional admin dashboard setup with pre-configured components:
  - Sidebar navigation
  - Login page

## Installation

```sh
npm install -g next-start-cli
```

## Usage

### Quick Start

Run the CLI:

```sh
next-start-cli
```

### Get Help

Display comprehensive help information:

```sh
next-start-cli --help
# or
next-start-cli -h
```

Check version:

```sh
next-start-cli --version
# or
next-start-cli -v
```

### Options

**Admin Dashboard:**

```sh
next-start-cli --admin
# or
next-start-cli -a
```

Includes admin dashboard with sidebar, user management, and authentication structure.

**Testing Frameworks:**

```sh
next-start-cli --tests
# or
next-start-cli -t
```

Adds Vitest/Jest for unit testing and Playwright/Cypress for e2e testing.

**Skip Git Commits:**

```sh
next-start-cli --no-git
```

Skips automatic git commits made by the CLI tool.
Note: Use `--no-git` when testing locally for development.

### Combining Options

You can combine multiple options:

```sh
# Admin dashboard + testing frameworks
next-start-cli --admin --tests

# Admin + tests without git commits
next-start-cli -a -t --no-git

# Full setup with all features
next-start-cli --admin --tests
```

<br>
The CLI will guide you through:

- Project name selection
- Next.js version selection
- shadcn/ui theme configuration
- Component installation

After creating the project, use `src/data/routes` file and modify the routes as the project requires. All the routes related to the admin dashboard, navbar, and footer routes can be found there.

Then use `src/data/brand.ts` file to modify project details such as project name, logo, and other related data.

## Project Structure

The generated project includes:

```
my-app/
├── src/
│   ├── app/
│   │   ├── (client)/        # Client-facing pages
│   │   ├── (server)/        # Mock API routes (--admin)
│   │   └── admin/           # Admin dashboard (--admin)
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (navbar, footer)
│   │   └── sidebar/         # Sidebar components (--admin)
│   ├── lib/
│   │   └── auth/            # Auth utilities (--admin)
│   ├── data/                # Configuration & routes
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   └── __tests__/           # Unit tests (--tests)
├── tests/                   # E2E tests (--tests)
├── docker-compose.yml       # Docker configuration
├── scripts/                 # Helper scripts
└── AUTH_SETUP.md            # Auth guide (--admin)
```

## Features

### Base Project

- ✅ Next.js with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ ESLint for code quality
- ✅ shadcn/ui component library
- ✅ Custom theme configuration
- ✅ Responsive navbar and footer
- ✅ Docker infrastructure (dev & prod)

### Admin Dashboard (`--admin`)

- ✅ Professional sidebar navigation
- ✅ Role-based access control
- ✅ User management with CRUD operations
- ✅ Form-table components
- ✅ Login page with authentication structure
- ✅ Mock API for development
- ✅ Session management utilities
- ✅ Comprehensive AUTH_SETUP.md guide

### Testing Setup (`--tests`)

- ✅ Unit testing framework (Vitest or Jest)
- ✅ E2E testing framework (Playwright or Cypress)
- ✅ Pre-configured test setup
- ✅ Example test cases
- ✅ React Testing Library

### Docker Support

- ✅ Development Dockerfile
- ✅ Production Dockerfile
- ✅ Docker Compose configuration
- ✅ Auto-detected Node & Yarn versions
- ✅ Helper scripts for easy deployment

## What's New in v2.0.0

### 🎉 New Features

- **Input Validation**: Project names and versions are now validated with helpful error messages
- **Comprehensive Help**: New `--help` command with detailed guides and examples
- **Version Command**: Quick version check with `--version` flag
- **Enhanced Security**: Removed hardcoded passwords, added secure password generation
- **Session Management**: Complete authentication utilities with multiple implementation options

### 🔒 Security Improvements

- Secure random password generation for new users
- Session management structure with NextAuth.js, Iron Session, and Clerk examples
- Resolved all authentication TODOs with clear implementation paths
- AUTH_SETUP.md guide included with admin dashboard

### ✨ Quality Improvements

- Validates project names (no spaces, special characters, reserved names)
- Checks for existing directories before creation
- Better error messages with helpful tips
- Prevents common setup errors early

## Quick Start Guide

### 1. Installation

```sh
npm install -g next-start-cli
```

### 2. Create a Project

```sh
next-start-cli
```

### 3. Follow the Prompts

- **Project Name**: Enter a valid name (lowercase, hyphens, no spaces)
- **Next.js Version**: Choose 'latest' or specify a version
- **Theme**: Select a shadcn/ui theme
- **Components**: Choose components to install

### 4. Start Development

```sh
cd my-app
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Post-Setup Configuration

### Update Brand Information

Edit `src/data/brand.ts` to configure:

- Project name and tagline
- Logo and favicon
- Contact information
- Social media links

### Customize Routes

Edit `src/data/routes/client-menu.ts` to add/remove:

- Navbar links
- Footer links
- Custom pages

### Setup Authentication (if using `--admin`)

1. Read `AUTH_SETUP.md` in your project root
2. Choose an auth solution (NextAuth.js, Clerk, Iron Session)
3. Implement `getSession()` in `src/lib/auth/session.ts`
4. Remove development fallbacks
5. Test authentication flow

### Docker Deployment

Run the helper script:

```sh
./scripts/start-docker.sh
```

Choose development or production mode.

## Tips & Best Practices

### Project Naming

- ✅ Use lowercase: `my-app`
- ✅ Use hyphens: `my-awesome-app`
- ❌ Avoid spaces: `my app`
- ❌ Avoid uppercase: `MyApp`
- ❌ Avoid reserved names: `react`, `node`, `test`

### Version Selection

- Use `latest` for stable releases (recommended)
- Use `canary` for bleeding-edge features
- Or specify exact version: `14.0.0`, `15.0.0`

### Admin Dashboard

- Review AUTH_SETUP.md before deployment
- Implement proper session management
- Remove development fallbacks in production
- Setup email service for password delivery

### Testing

- Run unit tests: `yarn test`
- Run e2e tests: `yarn test:e2e`
- Add tests as you build features

## Troubleshooting

### Yarn Not Found

```sh
npm install -g yarn
```

The CLI will offer to install it automatically.

### Directory Already Exists

Choose a different project name or remove the existing directory:

```sh
rm -rf my-app
```

### Invalid Project Name

Use lowercase letters, numbers, and hyphens only.

### Port 3000 Already in Use

```sh
yarn dev -p 3001
```

Or kill the process using port 3000.

### shadcn/ui Component Issues

You can always add more components later:

```sh
npx shadcn@latest add <component-name>
```

## Removing Mock API (Admin Dashboard)

If you don't need the mock API in your admin project:

```sh
rm -rf "src/app/(server)" "data.db"
yarn remove bcrypt nedb @types/bcrypt @types/nedb
```

## Resources & Documentation

### Official Documentation

- [Next.js](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Testing Frameworks

- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [Jest](https://jestjs.io)
- [Cypress](https://www.cypress.io)

### Authentication

- [NextAuth.js](https://next-auth.js.org)
- [Clerk](https://clerk.com)
- [Iron Session](https://github.com/vvo/iron-session)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

- Report issues: [GitHub Issues](https://github.com/yasithranusha/next-start-cli/issues)
- Repository: [GitHub](https://github.com/yasithranusha/next-start-cli)

## License

ISC

## Author

Yasith Silva

---

**✨ Happy coding! Build something amazing! ✨**
