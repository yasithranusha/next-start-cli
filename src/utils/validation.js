import chalk from "chalk";

/**
 * Reserved names that cannot be used as project names
 * Includes Node.js built-in modules and common package names
 */
const RESERVED_NAMES = [
  "node_modules",
  "test",
  "tests",
  "assert",
  "buffer",
  "child_process",
  "cluster",
  "crypto",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "https",
  "net",
  "os",
  "path",
  "punycode",
  "querystring",
  "readline",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "zlib",
  "next",
  "react",
  "node",
  "npm",
  "yarn",
];

/**
 * Validates project name according to npm package naming rules
 * @param {string} name - The project name to validate
 * @returns {{isValid: boolean, error: string|null}} Validation result
 */
export const validateProjectName = (name) => {
  if (!name || typeof name !== "string") {
    return {
      isValid: false,
      error: "Project name is required",
    };
  }

  // Trim the name
  const trimmedName = name.trim();

  // Check if empty after trimming
  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: "Project name cannot be empty",
    };
  }

  // Check length (npm package name limit is 214 characters)
  if (trimmedName.length > 214) {
    return {
      isValid: false,
      error: "Project name must be 214 characters or less",
    };
  }

  // Check if it starts with a dot or underscore
  if (trimmedName.startsWith(".") || trimmedName.startsWith("_")) {
    return {
      isValid: false,
      error: "Project name cannot start with a dot (.) or underscore (_)",
    };
  }

  // Check for spaces
  if (trimmedName.includes(" ")) {
    return {
      isValid: false,
      error: "Project name cannot contain spaces. Use hyphens (-) instead",
    };
  }

  // Check for uppercase letters
  if (trimmedName !== trimmedName.toLowerCase()) {
    return {
      isValid: false,
      error: "Project name must be lowercase",
    };
  }

  // Check for invalid characters (only lowercase, numbers, hyphens, and @ for scoped packages)
  const validNamePattern = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (!validNamePattern.test(trimmedName)) {
    return {
      isValid: false,
      error:
        "Project name can only contain lowercase letters, numbers, hyphens (-), underscores (_), and dots (.)",
    };
  }

  // Check for reserved names
  if (RESERVED_NAMES.includes(trimmedName)) {
    return {
      isValid: false,
      error: `"${trimmedName}" is a reserved name and cannot be used as a project name`,
    };
  }

  // Check for special characters that might cause issues
  if (
    trimmedName.includes("\\") ||
    trimmedName.includes("/") ||
    trimmedName.includes(":") ||
    trimmedName.includes("*") ||
    trimmedName.includes("?") ||
    trimmedName.includes('"') ||
    trimmedName.includes("<") ||
    trimmedName.includes(">") ||
    trimmedName.includes("|")
  ) {
    return {
      isValid: false,
      error: "Project name contains invalid characters",
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validates Next.js version format
 * @param {string} version - The version string to validate
 * @returns {{isValid: boolean, error: string|null}} Validation result
 */
export const validateNextJsVersion = (version) => {
  if (!version || typeof version !== "string") {
    return {
      isValid: false,
      error: "Version is required",
    };
  }

  const trimmedVersion = version.trim();

  // Allow "latest" or "canary"
  if (trimmedVersion === "latest" || trimmedVersion === "canary") {
    return {
      isValid: true,
      error: null,
    };
  }

  // Check for valid semver format (major.minor.patch or major.minor or major)
  // Also allow version ranges like ^14.0.0, ~14.0.0, >=14.0.0, etc.
  const semverPattern =
    /^([\^~>=<]+)?(\d+)(\.\d+)?(\.\d+)?(-[a-z]+(\.\d+)?)?$/i;
  if (!semverPattern.test(trimmedVersion)) {
    return {
      isValid: false,
      error: `Invalid version format: "${trimmedVersion}". Use format like "14.0.0", "14", "latest", or "canary"`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validates if a directory already exists
 * @param {string} dirPath - The directory path to check
 * @returns {Promise<{exists: boolean, error: string|null}>} Check result
 */
export const checkDirectoryExists = async (dirPath) => {
  try {
    const fs = await import("fs/promises");
    await fs.access(dirPath);
    return {
      exists: true,
      error: `Directory "${dirPath}" already exists`,
    };
  } catch {
    return {
      exists: false,
      error: null,
    };
  }
};

/**
 * Generates a cryptographically secure random password
 * @param {number} length - The length of the password (default: 16)
 * @returns {string} The generated password
 */
export const generateSecurePassword = async (length = 16) => {
  const crypto = await import("crypto");
  
  // Define character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  // Ensure password has at least one character from each set
  let password = "";
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password
    .split("")
    .sort(() => crypto.randomInt(0, 2) - 0.5)
    .join("");
};

/**
 * Displays validation error in a user-friendly format
 * @param {string} error - The error message to display
 */
export const displayValidationError = (error) => {
  console.log(chalk.red("\n✖ Validation Error:"));
  console.log(chalk.yellow(`  ${error}\n`));
};
