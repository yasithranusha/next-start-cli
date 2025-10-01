import inquirer from "inquirer";
import {
  validateProjectName,
  validateNextJsVersion,
  checkDirectoryExists,
  displayValidationError,
} from "./validation.js";
import chalk from "chalk";
import path from "path";

export let projectName;
export let nextJsVersion;

export const getProjectDetails = async () => {
  // Project name validation loop
  let validProjectName = false;
  while (!validProjectName) {
    const { projectName: inputName } = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter the project name:",
        default: "my-app",
      },
    ]);

    // Validate project name
    const nameValidation = validateProjectName(inputName);
    if (!nameValidation.isValid) {
      displayValidationError(nameValidation.error);
      console.log(chalk.blue("Tips:"));
      console.log(chalk.gray("  • Use lowercase letters, numbers, and hyphens"));
      console.log(chalk.gray("  • Example: my-awesome-app, project-2024"));
      continue;
    }

    // Check if directory already exists
    const dirPath = path.join(process.cwd(), inputName);
    const dirCheck = await checkDirectoryExists(dirPath);
    if (dirCheck.exists) {
      displayValidationError(dirCheck.error);
      console.log(chalk.yellow("  Please choose a different name or remove the existing directory.\n"));
      continue;
    }

    projectName = inputName;
    validProjectName = true;
  }

  // Next.js version validation loop
  let validVersion = false;
  while (!validVersion) {
    const { nextJsVersion: inputVersion } = await inquirer.prompt([
      {
        type: "input",
        name: "nextJsVersion",
        message: "Enter the Next.js version:",
        default: "latest",
      },
    ]);

    // Validate Next.js version
    const versionValidation = validateNextJsVersion(inputVersion);
    if (!versionValidation.isValid) {
      displayValidationError(versionValidation.error);
      console.log(chalk.blue("Tips:"));
      console.log(chalk.gray('  • Use "latest" for the most recent stable version'));
      console.log(chalk.gray('  • Use "canary" for the latest canary release'));
      console.log(chalk.gray("  • Or specify a version like: 14.0.0, 14.2, 15\n"));
      continue;
    }

    nextJsVersion = inputVersion;
    validVersion = true;
  }

  console.log(chalk.green("\n✓ Configuration validated successfully!\n"));
  return projectName;
};