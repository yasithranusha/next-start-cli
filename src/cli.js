import { showWelcomeMessage } from "./utils/display.js";
import { getProjectDetails } from "./utils/config.js";
import { createNextJsApp } from "./commands/createNextApp.js";
import { shadcnui } from "./commands/shadcnUI.js";
import { shadcnComponents } from "./commands/shadcnComponents.js";
import { admindashboard } from "./commands/admin.js";
import { clientSetup } from "./commands/client.js";
import { setupInfra } from "./commands/infra.js";

const parseArgs = () => {
  const args = process.argv;
  return {
    isAdmin: args.includes('--admin') || args.includes('-a'),
    noGit: args.includes('--no-git')
  };
};

export const run = async () => {
  const { isAdmin, noGit } = parseArgs();

  process.on("SIGINT", () => {
    console.log("\nExiting CLI...");
    process.exit(0);
  });

  try {
    await showWelcomeMessage();
    const project = await getProjectDetails();
    await createNextJsApp();

    console.clear();
    await shadcnui();

    console.clear();
    await shadcnComponents();

    console.clear();
    await clientSetup();
    

    console.clear();
    if (isAdmin) {
      await admindashboard(noGit);
    }

    console.clear();
    await setupInfra(project);

  } catch (error) {
    if (error.message.includes("User force closed the prompt")) {
      console.log("\nOperation cancelled by user");
      process.exit(0);
    }
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
};