import chalk from "chalk";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";

export const showEndInstructions = (projectName) => {
  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green.bold(`\n🎉 Project ${projectName} is ready!`));

  // Standard development instructions
  console.log(chalk.blue("\n🚀 To run your project:"));
  console.log(
    chalk.magenta("Option 1: Using Yarn (recommended for development)")
  );
  console.log(chalk.yellow(`  cd ${projectName}`));
  console.log(chalk.yellow("  yarn dev"));

  // Docker instructions
  console.log(chalk.blue("\n🐳 To run your app in Docker:"));
  console.log(chalk.magenta("Option 1: Use the helper script:"));
  console.log(chalk.yellow("  ./scripts/start-docker.sh"));
  console.log(chalk.magenta("\nOption 2: Use docker-compose directly:"));
  console.log(chalk.yellow("  Development: docker-compose --profile dev up"));
  console.log(chalk.yellow("  Production:  docker-compose --profile prod up"));

  // Customization instructions
  console.log(chalk.blue("\n⚙️  To customize your project:"));
  console.log(
    chalk.magenta("  1. Edit src/data/routes to modify navigation routes")
  );
  console.log(
    chalk.gray("     - Modify admin dashboard, navbar, and footer routes here")
  );
  console.log(
    chalk.magenta("  2. Edit src/data/brand.ts to update project details")
  );
  console.log(
    chalk.gray("     - Change project name, logo, and other branding elements")
  );

  // Mock backend removal instructions
  console.log(chalk.blue("\n🗑️  To remove the mock backend:"));
  console.log(
    chalk.yellow(
      '  rm -rf "src/app/(server)" "data.db" && yarn remove bcrypt nedb @types/bcrypt @types/nedb'
    )
  );
  console.log(
    chalk.gray(
      "  This will remove the local NeDB database and related dependencies."
    )
  );

  // Additional information
  console.log(chalk.blue("\n📁 Project structure:"));
  console.log(chalk.cyan("  /src             - Source code"));
  console.log(chalk.cyan("  /src/app         - Next.js app directory"));
  console.log(chalk.cyan("  /src/app/(server) - Mock backend API routes"));
  console.log(chalk.cyan("  /src/actions     - Next.js server actions"));
  console.log(chalk.cyan("  /src/components  - UI components"));
  console.log(chalk.cyan("  /src/data        - Project configuration"));
  console.log(chalk.cyan("  /src/enum        - Enumeration types"));
  console.log(chalk.cyan("  /src/hooks       - Custom React hooks"));
  console.log(chalk.cyan("  /src/lib         - Reusable utility functions"));
  console.log(chalk.cyan("  /src/middleware  - Next.js middleware"));
  console.log(chalk.cyan("  /src/schema      - Zod validation schemas"));
  console.log(chalk.cyan("  /src/types       - TypeScript type definitions"));
  console.log(chalk.cyan("  /scripts         - Bash helper scripts"));
  console.log(chalk.cyan("  /public          - Static assets"));

  console.log("\n");
  console.log(chalk.gray("─".repeat(50)));

  // Gradient message for happy coding
  const happyCoding = gradient.passion.multiline(`
✨ Happy coding! 🚀`);
  console.log(happyCoding);

  // Pulsing animation for completion message
  const pulse = chalkAnimation.pulse("\nNext.js Project Setup Complete!");

  // Stop the animation after 3 seconds
  setTimeout(() => {
    pulse.stop();
  }, 3000);

  console.log(endingMessage);
};
