import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import { copyTemplateFiles } from "../utils/templateCopier.js";

export const setupFormTable = async (projectPath, noGit = false) => {
  // Install dependencies
  const depsSpinner = createSpinner(
    "Installing required dependencies..."
  ).start();
  console.log(chalk.gray("─".repeat(50)));

  try {
    await execa(
      "yarn",
      ["add", "use-debounce", "@tanstack/react-table", "nedb", "bcrypt"],
      {
        stdio: "inherit",
      }
    );
    await execa("yarn", ["add", "--dev", "@types/nedb", "@types/bcrypt"], {
      stdio: "inherit",
    });
    depsSpinner.success({ text: "Dependencies installed successfully" });
  } catch (error) {
    depsSpinner.error({
      text: `Failed to install dependencies: ${error.message}`,
    });
    process.exit(1);
  }

  // Install shadcn components
  const componentsSpinner = createSpinner(
    "Installing shadcn components..."
  ).start();

  try {
    await execa(
      "npx",
      [
        "shadcn@latest",
        "add",
        "form",
        "popover",
        "badge",
        "dialog",
        "scroll-area",
        "select",
        "table",
        "checkbox",
        "command",
        "calendar",
        "sonner",
        "--overwrite",
      ],
      { stdio: "inherit" }
    );
    componentsSpinner.success({
      text: "Added form popover scroll-area select table calender sonner from shadcn",
    });
  } catch (error) {
    componentsSpinner.error({
      text: `Failed to install components: ${error.message}`,
    });
    process.exit(1);
  }

  // Update layout.tsx file
  const layoutSpinner = createSpinner("Updating layout.tsx...").start();

  try {
    const envSpinner = createSpinner("Creating .env file...").start();
    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = "BASE_URL=http://localhost:3000/api";

    await fs.writeFile(envPath, envContent, "utf8");
    envSpinner.success({ text: "Created .env file successfully" });

    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    let layoutContent = await fs.readFile(layoutPath, "utf8");

    // Add import if not present
    if (!layoutContent.includes("@/components/ui/sonner")) {
      layoutContent = layoutContent.replace(
        'import "./globals.css";',
        'import "./globals.css";\nimport { Toaster } from "@/components/ui/sonner";'
      );
    }

    // Add Toaster component if not present
    if (!layoutContent.includes("<Toaster")) {
      layoutContent = layoutContent.replace(
        "{children}",
        "{children}\n        <Toaster richColors />"
      );
    }

    await fs.writeFile(layoutPath, layoutContent, "utf8");
    layoutSpinner.success({ text: "Layout.tsx updated successfully" });

    // Copy template files
    const templateSpinner = createSpinner("Copying template files").start();
    await copyTemplateFiles("form-table", process.cwd(), true);
    templateSpinner.success({
      text: "Form and Table template files copied successfully",
    });

    const templateSpinnerApi = createSpinner(
      "Copying mock API template files"
    ).start();
    await copyTemplateFiles("mock-api", process.cwd(), true);
    templateSpinnerApi.success({
      text: "Mock API template files copied successfully",
    });

    // Add git commit only if noGit is false
    if (!noGit) {
      const commitSpinner = createSpinner("Committing changes...").start();
      try {
        await execa("git", ["add", "."]);
        await execa("git", [
          "commit",
          "-m",
          "feat: add form and table components",
        ]);
        commitSpinner.success({
          text: "Form and Table files committed successfully",
        });
      } catch (error) {
        commitSpinner.error({
          text: `Failed to commit files: ${error.message}`,
        });
        console.error(chalk.yellow("Continuing with setup..."));
      }
    } else {
      console.log(
        chalk.yellow("Skipping git commit as --no-git flag was provided")
      );
    }
  } catch (error) {
    layoutSpinner.error({ text: `Failed to update layout: ${error.message}` });
    console.error(
      chalk.red(`Failed to setup form-table components: ${error.message}`)
    );
    process.exit(1);
  }
};
