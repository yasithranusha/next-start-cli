import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import { projectName } from "../utils/config.js";

export const shadcnui = async () => {
    const spinner = createSpinner("Adding shadcn-ui to the project");
    spinner.start();

    try {
      process.chdir(projectName);
      spinner.stop();

      console.log(chalk.gray("─".repeat(50)));

      console.log(chalk.bold.green("Initializing Shadcn-ui"));
      console.log(
        chalk.gray(
          "Visit https://ui.shadcn.com/themes/ for more information about themes"
        )
      );
      console.log(
        chalk.blue(
          "Note: Theme is just a tailwindcss configuration it can also be changed later in global.css file"
        )
      );

      await execa("npx", ["shadcn@latest", "init"], {
        stdio: "inherit",
      });

      spinner.success({ text: "Shadcn-ui initialized successfully!" });
    } catch (error) {
      spinner.error(`Failed to initialize shadcn-ui: ${error.message}`);
      process.exit(1);
    }
};