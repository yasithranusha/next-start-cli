import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createSpinner } from "nanospinner";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function copyTemplateFiles(templateName, projectPath) {
  const spinner = createSpinner("Copying template files").start();

  try {
    const templatePath = path.join(__dirname, "..", "templates", templateName);
    const templateConfig = JSON.parse(
      await fs.readFile(path.join(templatePath, "template.json"), "utf-8")
    );

    for (const file of templateConfig.files) {
      const sourcePath = path.join(templatePath, file.source);
      const targetPath = path.join(projectPath, file.destination);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        await copyDir(sourcePath, targetPath);
        spinner.update({ text: `Copied directory ${file.destination}` });
      } else {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(sourcePath, targetPath);
        spinner.update({ text: `Copied file ${file.destination}` });
      }
    }

    spinner.success({ text: `Template ${templateName} applied successfully` });
    return true;
  } catch (error) {
    spinner.error({ text: `Failed to copy template: ${error.message}` });
    throw error;
  }
}
