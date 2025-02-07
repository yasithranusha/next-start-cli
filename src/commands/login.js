import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import { copyTemplateFiles } from "../utils/templateCopier.js";

export const setupLogin = async (projectPath) => {
  console.log(chalk.gray("─".repeat(50)));
  const loginSpinner = createSpinner("Installing login component...");
  loginSpinner.start();
  
  try {
    loginSpinner.stop();
    await execa("npx", ["shadcn@latest", "add", "login-02", "--overwrite"], {
      stdio: "inherit",
    });
    loginSpinner.success({ text: "Login component installed" });
  } catch (error) {
    loginSpinner.error({ text: `Failed to install login: ${error.message}` });
    process.exit(1);
  }

    try {
      const templateSpinner = createSpinner("Copying template files").start();
      await copyTemplateFiles("login", process.cwd());
      templateSpinner.success({ text: "Login Template files copied successfully" });
    } catch (error) {
      console.error(
        chalk.red(`Failed to copy template files: ${error.message}`)
      );
      process.exit(1);
    }
};