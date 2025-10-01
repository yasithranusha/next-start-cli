import { createSpinner } from "nanospinner";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { execa } from "execa";
import inquirer from "inquirer";

export const setupUnitTestFramework = async (project, noGit = false) => {
  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green(`Setting up unit test framework for ${project}`));

  // Add test framework selection with skip option
  const { setupTests } = await inquirer.prompt({
    type: "list",
    name: "setupTests",
    message: "Select a unit testing framework",
    choices: [
      { name: "Vitest", value: "vitest" },
      { name: "Jest", value: "jest" },
      { name: "Skip unit testing", value: "skip" },
    ],
    default: "vitest",
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
    if (testFramework === "vitest") {
      await execa("yarn", [
        "add",
        "--dev",
        "vitest",
        "@vitejs/plugin-react",
        "jsdom",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "@testing-library/dom",
        "vite-tsconfig-paths",
      ], { stdio: "inherit" });

      // Create vitest config
      const vitestConfig = `
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
});`;

      await fs.writeFile(
        path.join(process.cwd(), "vitest.config.mts"),
        vitestConfig,
        "utf8"
      );

      // Create test setup file
      const setupDir = path.join(process.cwd(), "src", "__test__");
      await fs.mkdir(setupDir, { recursive: true });

      const setupContent = `import '@testing-library/jest-dom';`;
      await fs.writeFile(path.join(setupDir, "setup.ts"), setupContent, "utf8");

      // Update package.json scripts
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );
      packageJson.scripts = {
        ...packageJson.scripts,
        test: "vitest run",
        "test:watch": "vitest",
        "test:ui": "vitest --ui",
        coverage: "vitest run --coverage",
      };

      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8"
      );

      // Create page test file for Vitest
      const pageTestDir = path.join(process.cwd(), "src", "__tests__");
      await fs.mkdir(pageTestDir, { recursive: true });

      const pageTestContent = `import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../app/(client)/page'
 
test('Home', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})`;

      await fs.writeFile(
        path.join(pageTestDir, "page.test.tsx"),
        pageTestContent,
        "utf8"
      );
      console.log(chalk.green("✓ Created page test file"));
    } else if (testFramework === "jest") {
      // Install Jest
      await execa("yarn", [
        "add",
        "--dev",
        "jest",
        "jest-environment-jsdom",
        "@testing-library/react",
        "@testing-library/dom",
        "@testing-library/jest-dom",
        "ts-node",
      ], { stdio: "inherit" });

      // Create Jest config
      const jestConfig = `
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)`;

      await fs.writeFile(
        path.join(process.cwd(), "jest.config.ts"),
        jestConfig,
        "utf8"
      );

      // Create Jest setup file
      const jestSetup = `import "@testing-library/jest-dom";`;

      await fs.writeFile(
        path.join(process.cwd(), "jest.setup.ts"),
        jestSetup,
        "utf8"
      );

      // Update package.json scripts
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8")
      );
      packageJson.scripts = {
        ...packageJson.scripts,
        test: "jest",
        "test:watch": "jest --watch",
        coverage: "jest --coverage",
      };

      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8"
      );

      // Create page test file for Jest
      const pageTestDir = path.join(process.cwd(), "src", "__tests__");
      await fs.mkdir(pageTestDir, { recursive: true });

      const pageTestContent = `import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../app/(client)/page";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});`;

      await fs.writeFile(
        path.join(pageTestDir, "page.test.tsx"),
        pageTestContent,
        "utf8"
      );
      console.log(chalk.green("✓ Created page test file"));
    }

    console.log(chalk.green(`✓ ${testFramework} testing framework installed successfully`));
  } catch (error) {
    console.error(chalk.red(`Failed to set up ${testFramework}: ${error.message}`));
    console.error(chalk.red(`Error details: ${error.stack}`));
  }

  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green(`\n✅ Testing framework setup completed`));
  console.log(chalk.yellow(`Run tests with: yarn test`));
};