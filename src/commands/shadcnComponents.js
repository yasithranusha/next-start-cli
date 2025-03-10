import chalk from "chalk";
import { execa } from "execa";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";

export const shadcnComponents = async () => {
  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green.bold("Adding Shadcn component"));
  console.log(
    chalk.gray(
      "For more information about shadcn components visit: https://ui.shadcn.com/docs/components/\n"
    )
  );

  const { shouldAddComponents } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldAddComponents",
      message: "Would you like to add components now?",
      default() {
        return false;
      },
    },
  ]);

  if (shouldAddComponents) {
    console.log(chalk.yellow("Starting component selection..."));
    try {
      await execa("npx", ["shadcn@latest", "add"], {
        stdio: "inherit",
      });
      console.log(chalk.green("Components installed successfully!"));
    } catch (error) {
      console.error(
        chalk.red(`Failed to install components: ${error.message}`)
      );
      process.exit(1);
    }
  } else {
    console.log(chalk.gray("\nSkipping component addition."));
    console.log(
      chalk.blue("You can add components later using 'npx shadcn@latest add'\n")
    );

    const buttonSpinner = createSpinner(
      "Installing only button component as a reffernce..."
    ).start();
    try {
      await execa("npx", ["shadcn@latest", "add", "button"]);
      buttonSpinner.success({
        text: "Button component installed successfully!",
      });
    } catch (error) {
      buttonSpinner.error({
        text: `Failed to install button: ${error.message}`,
      });
      process.exit(1);
    }
  }
};
