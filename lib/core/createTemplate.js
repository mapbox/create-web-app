import chalk from "chalk";
import { execa } from "execa";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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
    await execa('cp', ['-r', templatePath, projectName], { stdio: 'inherit' });

    console.log(chalk.green('✅ Template copied successfully'));
  } catch (error) {
    console.log(chalk.red('💥 createTemplate function caught an error!'));
    console.log(chalk.red(`Error details: ${error.message}`));
    console.log(chalk.gray('Full error:', error));
    
    throw error;
  }
}