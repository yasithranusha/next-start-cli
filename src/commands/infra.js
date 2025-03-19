import { createSpinner } from "nanospinner";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { execa } from "execa";
import inquirer from "inquirer";
import { copyTemplateFiles } from "../utils/templateCopier.js";

export const setupInfra = async (project, noGit = false) => {
  console.log(chalk.gray("─".repeat(50)));
  console.log(chalk.green(`Setting up Docker infrastructure for ${project}`));

  // Get node and yarn versions
  const nodeVersionSpinner = createSpinner("Detecting Node version").start();
  let nodeVersion;
  try {
    // Use exact version from user's computer
    const { stdout } = await execa("node", ["--version"]);
    nodeVersion = stdout.trim().replace("v", "");
    nodeVersionSpinner.success({
      text: `Detected Node version: ${nodeVersion}`,
    });
  } catch (error) {
    nodeVersionSpinner.error({ text: "Failed to detect Node version" });
    const { version } = await inquirer.prompt({
      type: "input",
      name: "version",
      message: "Enter Node version to use:",
      default: "20.11.0",
    });
    nodeVersion = version;
  }

  const yarnVersionSpinner = createSpinner("Detecting Yarn version").start();
  let yarnVersion;
  try {
    const { stdout } = await execa("yarn", ["--version"]);
    yarnVersion = stdout.trim();
    yarnVersionSpinner.success({
      text: `Detected Yarn version: ${yarnVersion}`,
    });
  } catch (error) {
    yarnVersionSpinner.error({ text: "Failed to detect Yarn version" });
    const { version } = await inquirer.prompt({
      type: "input",
      name: "version",
      message: "Enter Yarn version to use:",
      default: "1.22.22",
    });
    yarnVersion = version;
  }

  try {
    // Copy template files first
    const templateSpinner = createSpinner(
      "Copying Docker infrastructure templates"
    ).start();
    await copyTemplateFiles("infra", process.cwd());
    templateSpinner.success({
      text: "Docker infrastructure templates copied successfully",
    });

    // Update Dockerfiles with proper versions
    const updateDockerfilesSpinner = createSpinner(
      "Updating Docker configurations"
    ).start();

    const scriptPath = path.join(process.cwd(), "scripts", "start-docker.sh");
    await fs.chmod(scriptPath, 0o755);

    // Update Dockerfile.dev
    const dockerfileDev = path.join(process.cwd(), "Dockerfile.dev");
    let dockerfileDevContent = await fs.readFile(dockerfileDev, "utf8");
    dockerfileDevContent = dockerfileDevContent
      .replace(/FROM node:.*-alpine/, `FROM node:${nodeVersion}-alpine`)
      .replace(
        /RUN npm install -g yarn@.*/,
        `RUN npm install -g yarn@${yarnVersion} --force`
      );
    await fs.writeFile(dockerfileDev, dockerfileDevContent, "utf8");

    // Update Dockerfile.prod
    const dockerfileProd = path.join(process.cwd(), "Dockerfile.prod");
    let dockerfileProdContent = await fs.readFile(dockerfileProd, "utf8");
    dockerfileProdContent = dockerfileProdContent
      .replace(
        /FROM node:.*-alpine AS base/,
        `FROM node:${nodeVersion}-alpine AS base`
      )
      .replace(
        /RUN npm install -g yarn@.*/,
        `RUN npm install -g yarn@${yarnVersion} --force`
      );
    await fs.writeFile(dockerfileProd, dockerfileProdContent, "utf8");
    // Update docker-compose.yml with project name for services
    const dockerCompose = path.join(process.cwd(), "docker-compose.yml");
    let dockerComposeContent = await fs.readFile(dockerCompose, "utf8");

    // Add container_name and image name as properties INSIDE each service
    dockerComposeContent = dockerComposeContent
      .replace(
        /  # Development service\n  ${project}-dev:/,
        `  # Development service\n  ${project}-dev:\n    container_name: ${project}-dev\n    image: ${project}-dev`
      )
      .replace(
        /  # Production service\n  ${project}-prod:/,
        `  # Production service\n  ${project}-prod:\n    container_name: ${project}-prod\n    image: ${project}-prod`
      );

    await fs.writeFile(dockerCompose, dockerComposeContent, "utf8");

    updateDockerfilesSpinner.success({
      text: "Docker configurations updated with detected versions and project name",
    });

    // Create .env file for Docker with the detected versions and project name
    const envSpinner = createSpinner(
      "Creating Docker environment file"
    ).start();

    const envContent = `BASE_URL=http://localhost:3001/api`;

    await fs.writeFile(
      path.join(process.cwd(), ".env.local"),
      envContent,
      "utf8"
    );
    envSpinner.success({ text: "Created .env file with detected versions" });

    // Also make the start-docker.sh script executable
    try {
      const scriptPath = path.join(process.cwd(), "scripts", "start-docker.sh");
      await fs.chmod(scriptPath, 0o755); // rwxr-xr-x permission
      console.log(chalk.green("✔ Made start-docker.sh executable"));
    } catch (scriptError) {
      console.log(
        chalk.yellow(
          "Note: Couldn't make start-docker.sh executable. You may need to run: chmod +x scripts/start-docker.sh"
        )
      );
    }

    if (!noGit) {
      const gitSpinner = createSpinner(
        "Creating git commit for Docker setup"
      ).start();
      try {
        // Check if git is initialized
        await execa("git", ["rev-parse", "--is-inside-work-tree"]);

        // Stage the Docker files
        await execa("git", [
          "add",
          "Dockerfile.dev",
          "Dockerfile.prod",
          "docker-compose.yml",
          ".dockerignore",
          ".env.local",
          "scripts/start-docker.sh",
        ]);

        // Create conventional commit
        await execa("git", [
          "commit",
          "-m",
          "feat(docker): add Docker infrastructure",
        ]);

        gitSpinner.success({ text: "Created git commit for Docker setup" });
      } catch (gitError) {
        gitSpinner.error({
          text: `Could not create git commit: ${gitError.message}`,
        });
        console.log(
          chalk.yellow(
            "Note: Git repository may not be initialized or git is not installed."
          )
        );
      }
    }

    const readmeSpinner = createSpinner(
      "Updating README.md with Docker instructions"
    ).start();

    try {
      const readmePath = path.join(process.cwd(), "README.md");
      let readmeContent = await fs.readFile(readmePath, "utf8");

      // Check if Docker instructions already exist
      if (!readmeContent.includes("./scripts/start-docker.sh")) {
        // Find the "Getting Started" section and add Docker instructions after the run commands
        readmeContent = readmeContent.replace(
          /```bash\nnpm run dev\n# or\nyarn dev\n# or\npnpm dev\n# or\nbun dev\n```/,
          "```bash\nyarn dev```\n\nTo start the project using Docker (dev or prod), use the helper script:\n\n```bash\n./scripts/start-docker.sh\n```"
        );

        await fs.writeFile(readmePath, readmeContent, "utf8");
        readmeSpinner.success({
          text: "README.md updated with Docker instructions",
        });

        // Add README.md to git commit if not noGit
        if (!noGit) {
          try {
            await execa("git", ["add", "README.md"]);
          } catch (gitError) {
            // Ignore git errors here, they will be handled in the main git section
          }
        }
      } else {
        readmeSpinner.success({
          text: "README.md already contains Docker instructions",
        });
      }
    } catch (readmeError) {
      readmeSpinner.error({
        text: `Could not update README.md: ${readmeError.message}`,
      });
      console.log(
        chalk.yellow(
          "Note: You may need to manually update README.md with Docker instructions"
        )
      );
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to set up Docker infrastructure: ${error.message}`)
    );
    process.exit(1);
  }

  console.log(chalk.gray("─".repeat(50)));
  console.log(
    chalk.green("\n✔ Docker infrastructure setup completed successfully")
  );
  console.log(chalk.blue("\nCreated files:"));
  console.log(
    chalk.yellow("- Dockerfile.dev (with detected Node/Yarn versions)")
  );
  console.log(
    chalk.yellow("- Dockerfile.prod (with detected Node/Yarn versions)")
  );
  console.log(
    chalk.yellow(
      `- docker-compose.yml (with service names: ${project}-dev, ${project}-prod)`
    )
  );
  console.log(chalk.yellow("- .dockerignore"));
  console.log(chalk.yellow("- .env (with Node/Yarn versions and app name)"));
  console.log(chalk.yellow("- scripts/start-docker.sh (helper script)"));

  console.log(chalk.blue("\nTo run your app in Docker:"));
  console.log(chalk.yellow("Option 1: Use the helper script:"));
  console.log(chalk.yellow("  ./scripts/start-docker.sh"));
  console.log(chalk.yellow("\nOption 2: Use docker-compose directly:"));
  console.log(chalk.yellow("  Development: docker-compose --profile dev up"));
  console.log(chalk.yellow("  Production:  docker-compose --profile prod up"));
};
