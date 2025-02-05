import { createSpinner } from "nanospinner";
import { execa } from "execa";
import { projectName, nextJsVersion } from "../utils/config.js";

export const createNextJsApp = async () => {
  const spinner = createSpinner("Initializing Next.js app creation");
  spinner.start();

  try {
    spinner.stop();
    await execa(
      "npx",
      [
        `create-next-app${nextJsVersion !== "latest" ? `@${nextJsVersion}` : ""}`,
        projectName,
        "--use-yarn",
        "--tailwind",
        "--eslint",
        "--app",
        "--src-dir",
        "--import-alias",
        "@/*",
      ],
      { stdio: "inherit" }
    );
    spinner.success({ text: "Next.js app created successfully" });
  } catch (error) {
    spinner.error({ text: `Failed to create Next.js app: ${error.message}` });
    process.exit(1);
  }
};