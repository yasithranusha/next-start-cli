import { showWelcomeMessage } from "./utils/display.js";
import { getProjectDetails, projectName } from "./utils/config.js";
import { createNextJsApp } from "./commands/createNextApp.js";
import { shadcnui } from "./commands/shadcnUI.js";
import { shadcnComponents } from "./commands/shadcnComponents.js";
import { admindashboard } from "./commands/admin.js";
import { clientSetup } from "./commands/client.js";
import { setupInfra } from "./commands/infra.js";
import { setupUnitTestFramework } from "./commands/unit-test-case.js";
import { setupEndToEndTestFramework } from "./commands/e2e-test-case.js";
import { showEndInstructions } from "./commands/endInstructions.js";

const parseArgs = () => {
  const args = process.argv;
  return {
    isAdmin: args.includes("--admin") || args.includes("-a"),
    noGit: args.includes("--no-git"),
    tests: args.includes("--tests") || args.includes("-t"),
  };
};

export const run = async () => {
  const { isAdmin, noGit, tests } = parseArgs();

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
    await setupInfra(project, noGit);

    if (tests) {
      console.clear();
      await setupUnitTestFramework(project, noGit);
      console.clear();
      await setupEndToEndTestFramework(project, noGit);
    }

    console.clear();
    showEndInstructions(projectName, tests);
  } catch (error) {
    if (error.message.includes("User force closed the prompt")) {
      console.log("\nOperation cancelled by user");
      process.exit(0);
    }
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
};
