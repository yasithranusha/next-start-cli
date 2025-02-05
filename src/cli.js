import { showWelcomeMessage } from "./utils/display.js";
import { getProjectDetails } from "./utils/config.js";
import { createNextJsApp } from "./commands/createNextApp.js";
import { shadcnui } from "./commands/shadcnUI.js";
import { shadcnComponents } from "./commands/shadcnComponents.js";
import { admindashboard } from "./commands/admin.js";

const parseArgs = () => {
  const args = process.argv;
  return {
    isAdmin: args.includes('--admin') || args.includes('-a')
  };
};

export const run = async () => {
  const { isAdmin } = parseArgs();

  process.on("SIGINT", () => {
    console.log("\nExiting CLI...");
    process.exit(0);
  });

  try {
    await showWelcomeMessage();
    await getProjectDetails();
    await createNextJsApp();

    console.clear();
    await shadcnui();

    console.clear();
    await shadcnComponents();

    console.clear();
    if (isAdmin) {
      await admindashboard();
    }
  } catch (error) {
    if (error.message.includes("User force closed the prompt")) {
      console.log("\nOperation cancelled by user");
      process.exit(0);
    }
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
};