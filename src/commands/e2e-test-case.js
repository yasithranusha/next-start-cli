import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { execa } from "execa";
import inquirer from "inquirer";

export const setupEndToEndTestFramework = async (project, noGit = false) => {
  console.log(chalk.gray("─".repeat(50)));
  console.log(
    chalk.green(`Setting up End to End test framework for ${project}`)
  );

  // Add test framework selection with skip option
  const { setupTests } = await inquirer.prompt({
    type: "list",
    name: "setupTests",
    message: "Select a E2E testing framework",
    choices: [
      { name: "Playwright", value: "playwright" },
      { name: "Cypress", value: "cypress" },
      { name: "Skip unit testing", value: "skip" },
    ],
    default: "playwright",
  });

  // Exit early if user chose to skip
  if (setupTests === "skip") {
    console.log(chalk.yellow("Skipping test framework setup..."));
    return;
  }

  // Install selected testing framework
  const testFramework = setupTests; // Just for clarity
  console.log(chalk.cyan(`Installing ${testFramework} testing framework...`));

  try {
    if (testFramework === "playwright") {
      await execa("yarn", ["create", "playwright"], { stdio: "inherit" });
      console.log(chalk.green("✓ Playwright framework installed"));
    } else if (testFramework === "cypress") {
      await execa("yarn", ["add", "-D", "cypress"], { stdio: "inherit" });
      console.log(chalk.green("✓ Cypress package installed"));

      // Modify package.json scripts
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );

      packageJson.scripts = {
        ...packageJson.scripts,
        "cypress:open": "cypress open",
        "cypress:run": "cypress run",
        e2e: "cypress run",
      };

      // Write the modified package.json back to the file
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8"
      );
      console.log(chalk.green("✓ Added Cypress scripts to package.json"));

      // Create modern cypress.config.js
      const cypressConfig = `import { defineConfig } from 'cypress'
 
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {},
  },
})`;

      await fs.writeFile(
        path.join(process.cwd(), "cypress.config.js"),
        cypressConfig,
        "utf8"
      );
      console.log(chalk.green("✓ Created cypress.config.js"));

      // Initialize Cypress
      console.log(chalk.cyan("Initializing Cypress (this may take a moment)..."));
      await execa("yarn", ["cypress", "install"], { stdio: "inherit" });
      console.log(chalk.green("✓ Cypress initialized"));
    
      // Create cypress/e2e directory
      const e2eDir = path.join(process.cwd(), "cypress", "e2e");
      await fs.mkdir(e2eDir, { recursive: true });

      // Create app.cy.js test file
      const appTestContent = `describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
 
    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="about"]').click()
 
    // The new url should include "/about"
    cy.url().should('include', '/about')
 
    // The new page should contain an h1 with "About"
    cy.get('h1').contains('About')
  })
})`;

      await fs.writeFile(path.join(e2eDir, "app.cy.js"), appTestContent, "utf8");
      console.log(chalk.green("✓ Created sample test file"));
    }

    console.log(chalk.green(`✓ ${testFramework} testing framework installed successfully`));
  } catch (error) {
    console.error(chalk.red(`Failed to set up ${testFramework}: ${error.message}`));
    console.error(chalk.red(`Error details: ${error.stack}`));
  }

  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green(`\n✅ Testing framework setup completed`));
  
  if (testFramework === "playwright") {
    console.log(chalk.yellow(`Run tests with: yarn playwright test`));
    console.log(chalk.yellow(`Show UI: yarn playwright test --ui`));
  } else if (testFramework === "cypress") {
    console.log(chalk.yellow(`Open Cypress UI: yarn cypress:open`));
    console.log(chalk.yellow(`Run tests: yarn cypress:run`));
  }
};