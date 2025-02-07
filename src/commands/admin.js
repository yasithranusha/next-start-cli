import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import { copyTemplateFiles } from "../utils/templateCopier.js";
import { deleteFiles } from "../utils/deleteFile.js";
import { setupLogin } from "./login.js";

export const admindashboard = async () => {
  console.log(chalk.green("Adding admin dashboard components"));
  console.log(chalk.gray("─".repeat(50)));

  // Sidebar installation
  const sidebarSpinner = createSpinner("Installing sidebar component...");
  sidebarSpinner.start();
  try {
    sidebarSpinner.stop();
    await execa("npx", ["shadcn@latest", "add", "sidebar-07", "--overwrite"], {
      stdio: "inherit",
    });
    sidebarSpinner.success({ text: "Sidebar component installed" });
  } catch (error) {
    sidebarSpinner.error({
      text: `Failed to install sidebar: ${error.message}`,
    });
    process.exit(1);
  }

  try {
    await deleteFiles(process.cwd(), [
      "src/app/dashboard/page.tsx",
      "src/components/app-sidebar.tsx",
      "src/components/nav-main.tsx",
      "src/components/nav-projects.tsx",
      "src/components/nav-user.tsx",
      "src/hooks/use-mobile.tsx",
    ]);
  } catch (error) {
    console.error(chalk.red(`Failed to delete files: ${error.message}`));
    process.exit(1);
  }

  await setupLogin(process.cwd());

  try {
    const templateSpinner = createSpinner("Copying template files").start();
    await copyTemplateFiles("admin", process.cwd());
    templateSpinner.success({ text: "Sidebar Template files copied successfully" });
  } catch (error) {
    console.error(chalk.red(`Failed to copy template files: ${error.message}`));
    process.exit(1);
  }

  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green("\n✔ Admin dashboard setup completed successfully"));
  console.log(chalk.blue("\nComponents can be found in:"));
  console.log(chalk.yellow("- src/app/dashboard"));
  console.log(chalk.yellow("- src/app/login"));
};
