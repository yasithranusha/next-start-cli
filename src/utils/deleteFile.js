import fs from 'fs/promises';
import path from 'path';

export async function deleteFiles(projectPath, files) {
  try {
    for (const file of files) {
      const filePath = path.join(projectPath, file);
      await fs.rm(filePath, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(`Failed to clean files: ${error.message}`);
  }
}