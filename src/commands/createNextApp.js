import { createSpinner } from "nanospinner";
import { execa } from "execa";
import { projectName, nextJsVersion } from "../utils/config.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

export const createNextJsApp = async (noGit = false) => {
  // Check if yarn is installed
  const yarnCheckSpinner = createSpinner(
    "Checking for yarn installation"
  ).start();
  try {
    await execa("yarn", ["--version"], { stdio: "ignore" });
    yarnCheckSpinner.success({
      text: "Yarn is installed. Proceeding project with yarn",
    });
  } catch (error) {
    yarnCheckSpinner.error({ text: "Yarn is not installed" });
    console.log(
      chalk.yellow(
        "This CLI uses yarn to set up projects. Please install yarn first."
      )
    );
    console.log(chalk.blue("You can install yarn using:"));
    console.log(chalk.green("npm install -g yarn"));

    const { installYarn } = await inquirer.prompt({
      // Use inquirer.prompt instead
      type: "confirm",
      name: "installYarn",
      message: "Would you like to install yarn now?",
      default: true,
    });

    if (installYarn) {
      const installSpinner = createSpinner("Installing yarn...").start();
      try {
        await execa("npm", ["install", "-g", "yarn"], { stdio: "inherit" });
        installSpinner.success({ text: "Yarn installed successfully" });
      } catch (error) {
        installSpinner.error({
          text: `Failed to install yarn: ${error.message}`,
        });
        console.log(chalk.red("Please install yarn manually and try again."));
        process.exit(1);
      }
    } else {
      console.log(
        chalk.red(
          "Yarn is required to continue. Please install yarn and try again."
        )
      );
      process.exit(1);
    }
  }

  const spinner = createSpinner("Initializing Next.js app creation");
  spinner.start();

  try {
    spinner.stop();
    const commandArgs = [
      `create-next-app${
        nextJsVersion !== "latest" ? `@${nextJsVersion}` : "@latest"
      }`,
      projectName,
      "--use-yarn",
      "--tailwind",
      "--ts",
      "--eslint",
      "--app",
      "--src-dir",
      "--import-alias",
      "@/*",
    ];

    // Add the --no-git flag if requested
    if (noGit) {
      commandArgs.push("--no-git");
    }

    await execa("npx", commandArgs, { stdio: "inherit" });

    // Rest of your code remains the same...
    // Update next.config.ts with new configuration
    const nextConfigContent = `import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      images: {
        remotePatterns: [
          { protocol: "https", hostname: "lh3.googleusercontent.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
      },
    };

    export default nextConfig;`;

    const configPath = path.join(process.cwd(), projectName, "next.config.ts");
    await fs.writeFile(configPath, nextConfigContent, "utf8");

    // Create data directory and brand.ts file
    const dataDir = path.join(process.cwd(), projectName, "src", "data");
    await fs.mkdir(dataDir, { recursive: true });

    const brandContent = `export const BRAND = {
    name: "ABC Brand",
    productName: "ABC Template",
    productDescription: "A Next.js template for ABC Company",
    logo: "https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg",
    mobilelogo:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA", //optional
  } as const;`;

    const brandPath = path.join(dataDir, "brand.ts");
    await fs.writeFile(brandPath, brandContent, "utf8");

    spinner.success({
      text: "Next.js app created successfully with updated configuration and brand data",
    });

    // After creating brand.ts file:
    const layoutPath = path.join(
      process.cwd(),
      projectName,
      "src",
      "app",
      "layout.tsx"
    );
    let layoutContent = await fs.readFile(layoutPath, "utf8");

    // Add BRAND import
    layoutContent = layoutContent.replace(
      'import "./globals.css"',
      'import "./globals.css";\nimport { BRAND } from "@/data/brand";'
    );

    // Update metadata
    layoutContent = layoutContent.replace(
      /export const metadata: Metadata = {[\s\S]*?};/m,
      `export const metadata: Metadata = {
  title: \`\${BRAND.productName}\`,
  description: \`\${BRAND.productDescription}\`,
};`
    );

    await fs.writeFile(layoutPath, layoutContent, "utf8");
  } catch (error) {
    spinner.error({ text: `Failed to create Next.js app: ${error.message}` });
    process.exit(1);
  }
};
