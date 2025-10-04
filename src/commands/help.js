import chalk from "chalk";
import gradient from "gradient-string";

export const showHelp = () => {
  console.clear();
  
  // Header with gradient
  const title = gradient.pastel.multiline(`
╔═══════════════════════════════════════════════════════════╗
║                   NEXT START CLI v2.0.0                    ║
║        🚀 Quick Setup for Next.js Projects with           ║
║          TypeScript, Tailwind CSS & shadcn/ui             ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log(title);

  // Usage
  console.log(chalk.bold.blue("\n📖 USAGE:"));
  console.log(chalk.yellow("  next-start-cli [options]"));
  console.log(chalk.gray("  or simply:"));
  console.log(chalk.yellow("  next-start-cli\n"));

  // Options
  console.log(chalk.bold.blue("⚙️  OPTIONS:"));
  
  console.log(chalk.green("  --admin, -a"));
  console.log(chalk.gray("    Includes admin dashboard with sidebar navigation, user management,"));
  console.log(chalk.gray("    form-table components, and authentication structure."));
  console.log(chalk.gray("    Example: ") + chalk.yellow("next-start-cli --admin\n"));

  console.log(chalk.green("  --tests, -t"));
  console.log(chalk.gray("    Adds testing frameworks setup (unit and e2e testing)."));
  console.log(chalk.gray("    Includes: Vitest/Jest for unit tests, Playwright/Cypress for e2e."));
  console.log(chalk.gray("    Example: ") + chalk.yellow("next-start-cli --tests\n"));

  console.log(chalk.green("  --no-git"));
  console.log(chalk.gray("    Skip git commits made by the CLI during setup."));
  console.log(chalk.gray("    Useful for development or when managing git manually."));
  console.log(chalk.gray("    Example: ") + chalk.yellow("next-start-cli --no-git\n"));

  console.log(chalk.green("  --help, -h"));
  console.log(chalk.gray("    Display this help message."));
  console.log(chalk.gray("    Example: ") + chalk.yellow("next-start-cli --help\n"));

  console.log(chalk.green("  --version, -v"));
  console.log(chalk.gray("    Display the CLI version."));
  console.log(chalk.gray("    Example: ") + chalk.yellow("next-start-cli --version\n"));

  // Combined Options
  console.log(chalk.bold.blue("🔗 COMBINING OPTIONS:"));
  console.log(chalk.gray("  You can combine multiple options:"));
  console.log(chalk.yellow("  next-start-cli --admin --tests"));
  console.log(chalk.gray("    Creates a project with admin dashboard and testing setup\n"));
  console.log(chalk.yellow("  next-start-cli -a -t --no-git"));
  console.log(chalk.gray("    Admin + tests without git commits\n"));

  // Features
  console.log(chalk.bold.blue("✨ FEATURES:"));
  
  console.log(chalk.cyan("\n  📦 Base Project:"));
  console.log(chalk.gray("    • Next.js with App Router"));
  console.log(chalk.gray("    • TypeScript for type safety"));
  console.log(chalk.gray("    • Tailwind CSS for styling"));
  console.log(chalk.gray("    • ESLint for code quality"));
  console.log(chalk.gray("    • shadcn/ui component library"));
  console.log(chalk.gray("    • Custom theme configuration"));
  console.log(chalk.gray("    • Responsive navbar and footer"));
  console.log(chalk.gray("    • Docker infrastructure (dev & prod)"));

  console.log(chalk.cyan("\n  👨‍💼 Admin Dashboard (--admin):"));
  console.log(chalk.gray("    • Professional sidebar navigation"));
  console.log(chalk.gray("    • Role-based access control"));
  console.log(chalk.gray("    • User management with CRUD operations"));
  console.log(chalk.gray("    • Form-table components"));
  console.log(chalk.gray("    • Login page with authentication structure"));
  console.log(chalk.gray("    • Mock API for development"));
  console.log(chalk.gray("    • Session management utilities"));
  console.log(chalk.gray("    • AUTH_SETUP.md guide included"));

  console.log(chalk.cyan("\n  🧪 Testing Setup (--tests):"));
  console.log(chalk.gray("    • Unit testing framework (Vitest or Jest)"));
  console.log(chalk.gray("    • E2E testing framework (Playwright or Cypress)"));
  console.log(chalk.gray("    • Pre-configured test setup"));
  console.log(chalk.gray("    • Example test cases"));
  console.log(chalk.gray("    • React Testing Library"));

  console.log(chalk.cyan("\n  🐳 Docker Support:"));
  console.log(chalk.gray("    • Development Dockerfile"));
  console.log(chalk.gray("    • Production Dockerfile"));
  console.log(chalk.gray("    • Docker Compose configuration"));
  console.log(chalk.gray("    • Auto-detected Node & Yarn versions"));
  console.log(chalk.gray("    • Helper scripts for easy deployment"));

  // Project Structure
  console.log(chalk.bold.blue("\n📁 PROJECT STRUCTURE:"));
  console.log(chalk.gray(`
  my-app/
  ├── src/
  │   ├── app/
  │   │   ├── (client)/        # Client-facing pages
  │   │   ├── (server)/        # Mock API routes (--admin)
  │   │   └── admin/           # Admin dashboard (--admin)
  │   ├── components/
  │   │   ├── ui/              # shadcn/ui components
  │   │   ├── layout/          # Layout components
  │   │   └── sidebar/         # Sidebar (--admin)
  │   ├── lib/
  │   │   └── auth/            # Auth utilities (--admin)
  │   ├── data/                # Configuration & routes
  │   ├── hooks/               # Custom React hooks
  │   └── types/               # TypeScript definitions
  ├── tests/                   # E2E tests (--tests)
  ├── __tests__/               # Unit tests (--tests)
  ├── docker-compose.yml       # Docker configuration
  └── scripts/                 # Helper scripts
  `));

  // Quick Start Guide
  console.log(chalk.bold.blue("🚀 QUICK START GUIDE:"));
  console.log(chalk.gray("\n  1. Create a new project:"));
  console.log(chalk.yellow("     next-start-cli"));
  
  console.log(chalk.gray("\n  2. Follow the interactive prompts:"));
  console.log(chalk.gray("     • Enter project name (lowercase, no spaces)"));
  console.log(chalk.gray("     • Select Next.js version (or use 'latest')"));
  console.log(chalk.gray("     • Choose shadcn/ui theme"));
  console.log(chalk.gray("     • Select components to install"));

  console.log(chalk.gray("\n  3. Navigate to your project:"));
  console.log(chalk.yellow("     cd my-app"));

  console.log(chalk.gray("\n  4. Start development server:"));
  console.log(chalk.yellow("     yarn dev"));

  console.log(chalk.gray("\n  5. Open in browser:"));
  console.log(chalk.yellow("     http://localhost:3000"));

  // Configuration
  console.log(chalk.bold.blue("\n⚡ POST-SETUP CONFIGURATION:"));
  
  console.log(chalk.gray("\n  📝 Update brand information:"));
  console.log(chalk.yellow("     Edit: src/data/brand.ts"));
  console.log(chalk.gray("     Configure: project name, logo, contact info, social links"));

  console.log(chalk.gray("\n  🧭 Customize routes:"));
  console.log(chalk.yellow("     Edit: src/data/routes/client-menu.ts"));
  console.log(chalk.gray("     Add/remove navbar and footer links"));

  console.log(chalk.gray("\n  🔐 Setup authentication (--admin):"));
  console.log(chalk.yellow("     Read: AUTH_SETUP.md"));
  console.log(chalk.gray("     Implement session management with NextAuth/Clerk/Iron Session"));

  console.log(chalk.gray("\n  🐳 Run with Docker:"));
  console.log(chalk.yellow("     ./scripts/start-docker.sh"));
  console.log(chalk.gray("     Choose development or production mode"));

  // Examples
  console.log(chalk.bold.blue("\n💡 USAGE EXAMPLES:"));
  
  console.log(chalk.gray("\n  Basic project:"));
  console.log(chalk.yellow("  $ next-start-cli"));
  console.log(chalk.gray("  Creates a standard Next.js project with shadcn/ui\n"));

  console.log(chalk.gray("  Full-featured admin:"));
  console.log(chalk.yellow("  $ next-start-cli --admin --tests"));
  console.log(chalk.gray("  Complete admin dashboard with testing frameworks\n"));

  console.log(chalk.gray("  Development mode (no git commits):"));
  console.log(chalk.yellow("  $ next-start-cli --admin --no-git"));
  console.log(chalk.gray("  Perfect for local testing and development\n"));

  // Tips & Best Practices
  console.log(chalk.bold.blue("💎 TIPS & BEST PRACTICES:"));
  
  console.log(chalk.cyan("\n  ✓ Project Naming:"));
  console.log(chalk.gray("    • Use lowercase letters"));
  console.log(chalk.gray("    • Separate words with hyphens (my-awesome-app)"));
  console.log(chalk.gray("    • Avoid spaces and special characters"));
  console.log(chalk.gray("    • Don't use reserved names (react, node, etc.)"));

  console.log(chalk.cyan("\n  ✓ Version Selection:"));
  console.log(chalk.gray("    • Use 'latest' for stable releases (recommended)"));
  console.log(chalk.gray("    • Use 'canary' for bleeding-edge features"));
  console.log(chalk.gray("    • Or specify exact version: 14.0.0, 15.0.0"));

  console.log(chalk.cyan("\n  ✓ Admin Dashboard:"));
  console.log(chalk.gray("    • Review AUTH_SETUP.md before deployment"));
  console.log(chalk.gray("    • Implement proper session management"));
  console.log(chalk.gray("    • Remove development fallbacks in production"));
  console.log(chalk.gray("    • Setup email service for password delivery"));

  console.log(chalk.cyan("\n  ✓ Docker Deployment:"));
  console.log(chalk.gray("    • Use development mode for local work"));
  console.log(chalk.gray("    • Use production mode for deployments"));
  console.log(chalk.gray("    • Environment variables are auto-configured"));

  console.log(chalk.cyan("\n  ✓ Testing:"));
  console.log(chalk.gray("    • Run unit tests: yarn test"));
  console.log(chalk.gray("    • Run e2e tests: yarn test:e2e"));
  console.log(chalk.gray("    • Add tests as you build features"));

  // Troubleshooting
  console.log(chalk.bold.blue("\n🔧 TROUBLESHOOTING:"));
  
  console.log(chalk.gray("\n  ❌ 'Yarn not found' error:"));
  console.log(chalk.yellow("     npm install -g yarn"));
  console.log(chalk.gray("     The CLI will offer to install it automatically\n"));

  console.log(chalk.gray("  ❌ 'Directory already exists' error:"));
  console.log(chalk.gray("     Choose a different project name or remove the existing directory\n"));

  console.log(chalk.gray("  ❌ 'Invalid project name' error:"));
  console.log(chalk.gray("     Use lowercase letters, numbers, and hyphens only\n"));

  console.log(chalk.gray("  ❌ Port 3000 already in use:"));
  console.log(chalk.yellow("     yarn dev -p 3001"));
  console.log(chalk.gray("     Or kill the process using port 3000\n"));

  console.log(chalk.gray("  ❌ shadcn/ui component issues:"));
  console.log(chalk.yellow("     npx shadcn@latest add <component-name>"));
  console.log(chalk.gray("     You can always add more components later\n"));

  // Resources
  console.log(chalk.bold.blue("📚 RESOURCES & DOCUMENTATION:"));
  console.log(chalk.gray("\n  Official Documentation:"));
  console.log(chalk.cyan("    • Next.js:     ") + chalk.gray("https://nextjs.org/docs"));
  console.log(chalk.cyan("    • shadcn/ui:   ") + chalk.gray("https://ui.shadcn.com"));
  console.log(chalk.cyan("    • Tailwind:    ") + chalk.gray("https://tailwindcss.com/docs"));
  console.log(chalk.cyan("    • TypeScript:  ") + chalk.gray("https://www.typescriptlang.org/docs"));

  console.log(chalk.gray("\n  Testing Frameworks:"));
  console.log(chalk.cyan("    • Vitest:      ") + chalk.gray("https://vitest.dev"));
  console.log(chalk.cyan("    • Playwright:  ") + chalk.gray("https://playwright.dev"));

  console.log(chalk.gray("\n  Authentication:"));
  console.log(chalk.cyan("    • NextAuth:    ") + chalk.gray("https://next-auth.js.org"));
  console.log(chalk.cyan("    • Clerk:       ") + chalk.gray("https://clerk.com"));
  console.log(chalk.cyan("    • Iron Session:") + chalk.gray("https://github.com/vvo/iron-session"));

  // Support
  console.log(chalk.bold.blue("\n🤝 SUPPORT & CONTRIBUTION:"));
  console.log(chalk.gray("  • Report issues: https://github.com/yasithranusha/next-start-cli/issues"));
  console.log(chalk.gray("  • Contribute:    https://github.com/yasithranusha/next-start-cli"));
  console.log(chalk.gray("  • Author:        Yasith Silva"));

  // Footer
  console.log(chalk.bold.blue("\n📝 NOTES:"));
  console.log(chalk.gray("  • All generated projects use yarn as package manager"));
  console.log(chalk.gray("  • Input validation prevents common naming errors"));
  console.log(chalk.gray("  • Mock API included with --admin for rapid development"));
  console.log(chalk.gray("  • Docker support works with auto-detected Node/Yarn versions"));

  console.log(chalk.bold.green("\n✨ Happy coding! Build something amazing! ✨\n"));
};

export const showVersion = () => {
  console.log(chalk.bold.cyan("\n🚀 Next Start CLI"));
  console.log(chalk.yellow("Version: ") + chalk.green("2.0.0"));
  console.log(chalk.yellow("Author:  ") + chalk.green("Yasith Silva"));
  console.log(chalk.yellow("License: ") + chalk.green("ISC\n"));
};
