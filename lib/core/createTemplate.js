import chalk from "chalk";
import { execa } from "execa";

export const createTemplate = async (frameworkLower, projectName) => {
  
  console.log(chalk.gray(`\n📦 Copying  template for ${frameworkLower}...\n`));

  try {
    // Step 4a: Copy Minimal Template to project folder
    const templatePath = `templates/${frameworkLower}`;
    console.log(chalk.gray(`Copying: ${templatePath} -> ${projectName}`));
    await execa('cp', ['-r', templatePath, projectName], { stdio: 'inherit' });

    console.log(chalk.green('✅ Template copied successfully'));
  } catch (error) {
    console.log(chalk.red('💥 createMinimalTemplate function caught an error!'));
    console.log(chalk.red(`Error details: ${error.message}`));
    console.log(chalk.gray('Full error:', error));
    
    if (error.message.includes('not found')) {
      console.log(chalk.yellow(`\n💡 Available framework options:`));
      console.log(chalk.gray(`   - react`));
      console.log(chalk.gray(`   - vue`));
      console.log(chalk.gray(`   - svelte`));
      console.log(chalk.gray(`   - angular`));
    } else {
      console.log(chalk.yellow(`\n💡 Something went wrong copying the template for ${frameworkLower}`));
    }
    
    throw error;
  }
}