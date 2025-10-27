import chalk from "chalk";
import { execa } from "execa";

export const createTemplate = async (frameworkLower, projectName) => {
  
  console.log(chalk.gray(`\n📦 Copying  template for ${frameworkLower}...\n`));

  try {
    const templatePath = `templates/${frameworkLower}`;
    await execa('cp', ['-r', templatePath, projectName], { stdio: 'inherit' });

    console.log(chalk.green('✅ Template copied successfully'));
  } catch (error) {
    console.log(chalk.red('💥 createTemplate function caught an error!'));
    console.log(chalk.red(`Error details: ${error.message}`));
    console.log(chalk.gray('Full error:', error));
    
    throw error;
  }
}