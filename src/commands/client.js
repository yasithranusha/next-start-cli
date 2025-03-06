import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { copyTemplateFiles } from "../utils/templateCopier.js";
import { deleteFiles } from "../utils/deleteFile.js";

export const clientSetup = async (projectPath) => {
  console.log(chalk.gray("─".repeat(50)));
  const loginSpinner = createSpinner("Installing Client component...");
  loginSpinner.start();

  try {
    loginSpinner.stop();
    await execa(
      "npx",
      ["shadcn@latest", "add", "accordion", "navigation-menu"],
      {
        stdio: "inherit",
      }
    );
    loginSpinner.success({ text: "Client component installed" });
  } catch (error) {
    loginSpinner.error({ text: `Failed to install Client: ${error.message}` });
    process.exit(1);
  }

  try {
    const templateSpinner = createSpinner("Copying template files").start();
    await copyTemplateFiles("client", process.cwd());
    templateSpinner.success({
      text: "Client Template files copied successfully",
    });
  } catch (error) {
    console.error(chalk.red(`Failed to copy template files: ${error.message}`));
    process.exit(1);
  }

  try {
    await deleteFiles(process.cwd(), ["src/app/page.tsx"]);
  } catch (error) {
    console.error(chalk.red(`Failed to delete files: ${error.message}`));
    process.exit(1);
  }
};