import { createSpinner } from "nanospinner";
import { execa } from "execa";
import { projectName, nextJsVersion } from "../utils/config.js";
import fs from "fs/promises";
import path from "path";

export const createNextJsApp = async () => {
  const spinner = createSpinner("Initializing Next.js app creation");
  spinner.start();

  try {
    spinner.stop();
    await execa(
      "npx",
      [
        `create-next-app${
          nextJsVersion !== "latest" ? `@${nextJsVersion}` : "@latest"
        }`,
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

    // Update next.config.ts with new configuration
    const nextConfigContent = `import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      images: {
        remotePatterns: [
          { protocol: "https", hostname: "lh3.googleusercontent.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
        ],
      },
    };

    export default nextConfig;`;

    const configPath = path.join(process.cwd(), projectName, "next.config.ts");
    await fs.writeFile(configPath, nextConfigContent, "utf8");

    // Create data directory and brand.ts file
    const dataDir = path.join(process.cwd(), projectName, "src", "data");
    await fs.mkdir(dataDir, { recursive: true });

    const brandContent = `export const BRAND = {
    name: "ABC Brand",
    productName: "ABC Template",
    productDescription: "A Next.js template for ABC Company",
    logo: "https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg",
    mobilelogo:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA", //optional
  } as const;`;

    const brandPath = path.join(dataDir, "brand.ts");
    await fs.writeFile(brandPath, brandContent, "utf8");

    spinner.success({
      text: "Next.js app created successfully with updated configuration and brand data",
    });

    // After creating brand.ts file:
    const layoutPath = path.join(
      process.cwd(),
      projectName,
      "src",
      "app",
      "layout.tsx"
    );
    let layoutContent = await fs.readFile(layoutPath, "utf8");

    // Add BRAND import
    layoutContent = layoutContent.replace(
      'import "./globals.css"',
      'import "./globals.css";\nimport { BRAND } from "@/data/brand";'
    );

    // Update metadata
    layoutContent = layoutContent.replace(
      /export const metadata: Metadata = {[\s\S]*?};/m,
      `export const metadata: Metadata = {
  title: \`\${BRAND.productName}\`,
  description: \`\${BRAND.productDescription}\`,
};`
    );

    await fs.writeFile(layoutPath, layoutContent, "utf8");
  } catch (error) {
    spinner.error({ text: `Failed to create Next.js app: ${error.message}` });
    process.exit(1);
  }
};
