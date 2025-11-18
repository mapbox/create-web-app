import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cp } from "fs/promises";

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go up two levels from lib/core to package root
const packageRoot = join(__dirname, '..', '..');

export const createTemplate = async (frameworkLower, projectName) => {
  
  console.log(chalk.gray(`\n📦 Copying  template for ${frameworkLower}...\n`));

  try {
    // Use absolute path from package root
    const templatePath = join(packageRoot, 'templates', frameworkLower);
    await cp(templatePath, projectName, { recursive: true });

    console.log(chalk.green('✅ Template copied successfully'));
  } catch (error) {
    console.log(chalk.red('💥 createTemplate function caught an error!'));
    console.log(chalk.red(`Error details: ${error.message}`));
    console.log(chalk.gray('Full error:', error));
    
    throw error;
  }
}