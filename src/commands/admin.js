import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";

export const admindashboard = async () => {
  console.log(chalk.green("Adding admin dashboard components"));
  console.log(chalk.gray("─".repeat(50)));

  // Sidebar installation
  const sidebarSpinner = createSpinner("Installing sidebar component...");
  sidebarSpinner.start();
  try {
    sidebarSpinner.stop();
    await execa("npx", ["shadcn@latest", "add", "sidebar-07"], {
      stdio: "inherit",
    });
    sidebarSpinner.success({ text: "Sidebar component installed" });
  } catch (error) {
    sidebarSpinner.error({
      text: `Failed to install sidebar: ${error.message}`,
    });
    process.exit(1);
  }

  // Login installation
  console.log(chalk.gray("─".repeat(50)));
  const loginSpinner = createSpinner("Installing login component...");
  loginSpinner.start();
  try {
    loginSpinner.stop();
    await execa("npx", ["shadcn@latest", "add", "login-02"], {
      stdio: "inherit",
    });
    loginSpinner.success({ text: "Login component installed" });
  } catch (error) {
    loginSpinner.error({ text: `Failed to install login: ${error.message}` });
    process.exit(1);
  }

  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green("\n✔ Admin dashboard setup completed successfully"));
  console.log(chalk.blue("\nComponents can be found in:"));
  console.log(chalk.yellow("- src/app/dashboard"));
  console.log(chalk.yellow("- src/app/login"));
};
