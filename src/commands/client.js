import { createSpinner } from "nanospinner";
import { execa } from "execa";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { copyTemplateFiles } from "../utils/templateCopier.js";
import { deleteFiles } from "../utils/deleteFile.js";

export const clientSetup = async (projectPath) => {
  console.log(chalk.gray("─".repeat(50)));
  const loginSpinner = createSpinner("Installing Client component...");
  loginSpinner.start();

  try {
    loginSpinner.stop();
    await execa(
      "npx",
      [
        "shadcn@latest",
        "add",
        "accordion",
        "navigation-menu",
        "sheet"
      ],
      {
        stdio: "inherit",
      }
    );
    loginSpinner.success({ text: "Client component installed" });
  } catch (error) {
    loginSpinner.error({ text: `Failed to install Client: ${error.message}` });
    process.exit(1);
  }

  // Add optional border prop to AccordionItem
  const updateAccordionSpinner = createSpinner(
    "Updating Accordion component..."
  ).start();
  try {
    const accordionPath = path.join(
      process.cwd(),
      "src",
      "components",
      "ui",
      "accordion.tsx"
    );
    let accordionContent = await fs.readFile(accordionPath, "utf8");

    // Update AccordionItem props interface to include optional border prop
    accordionContent = accordionContent.replace(
      /function AccordionItem\(\{\s*className,\s*\.\.\.(props|props)\s*\}: React\.ComponentProps<typeof AccordionPrimitive\.Item>\) \{/,
      `function AccordionItem({
    className,
    hideBorder = false,
    ...props
  }: React.ComponentProps<typeof AccordionPrimitive.Item> & { hideBorder?: boolean }) {`
    );

    // Update border class to be conditional based on hideBorder prop
    accordionContent = accordionContent.replace(
      /className=\{cn\("border-b last:border-b-0", className\)\}/,
      `className={cn(hideBorder ? "" : "border-b last:border-b-0", className)}`
    );

    await fs.writeFile(accordionPath, accordionContent, "utf8");
    updateAccordionSpinner.success({
      text: "Updated Accordion component with hideBorder prop",
    });
  } catch (error) {
    updateAccordionSpinner.error({
      text: `Failed to update Accordion component: ${error.message}`,
    });
    console.error(chalk.red(`Error details: ${error.stack}`));
  }
  
  // Update NavigationMenu component
  const updateNavMenuSpinner = createSpinner(
    "Updating Navigation Menu component..."
  ).start();
  try {
    const navMenuPath = path.join(
      process.cwd(),
      "src",
      "components",
      "ui",
      "navigation-menu.tsx"
    );
    let navMenuContent = await fs.readFile(navMenuPath, "utf8");

    // Change left-0 to right-0 in NavigationMenuViewport
    navMenuContent = navMenuContent.replace(
      /absolute top-full left-0/,
      "absolute top-full right-0"
    );

    await fs.writeFile(navMenuPath, navMenuContent, "utf8");
    updateNavMenuSpinner.success({
      text: "Updated Navigation Menu component alignment",
    });
  } catch (error) {
    updateNavMenuSpinner.error({
      text: `Failed to update Navigation Menu component: ${error.message}`,
    });
    console.error(chalk.red(`Error details: ${error.stack}`));
  }

  try {
    const templateSpinner = createSpinner("Copying template files").start();
    await copyTemplateFiles("client", process.cwd());
    templateSpinner.success({
      text: "Client Template files copied successfully",
    });
  } catch (error) {
    console.error(chalk.red(`Failed to copy template files: ${error.message}`));
    process.exit(1);
  }

  try {
    await deleteFiles(process.cwd(), ["src/app/page.tsx"]);
  } catch (error) {
    console.error(chalk.red(`Failed to delete files: ${error.message}`));
    process.exit(1);
  }

    try {
      await deleteFiles(process.cwd(), ["src/app/page.tsx"]);

      // Delete default SVG files
      const deleteSpinner = createSpinner(
        "Removing default SVG files..."
      ).start();
      try {
        await deleteFiles(process.cwd(), [
          "public/file.svg",
          "public/globe.svg",
          "public/next.svg",
          "public/vercel.svg",
          "public/window.svg",
        ]);
        deleteSpinner.success({ text: "Removed default SVG files" });
      } catch (error) {
        deleteSpinner.error({
          text: `Failed to remove SVG files: ${error.message}`,
        });
      }
    } catch (error) {
      console.error(chalk.red(`Failed to delete files: ${error.message}`));
      process.exit(1);
    }
};