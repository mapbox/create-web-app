import chalk from "chalk";
import { execa } from "execa";

export const createTutorialTemplate = async (frameworkLower, projectName) => {
  const repo = `mapbox/tutorials`;
  const subfolder = `use-mapbox-gl-js-with-${frameworkLower}`;
  const repoUrl = `https://github.com/${repo}.git`;
  const tempDir = `temp-${Date.now()}`;
  
  console.log(chalk.gray(`\n📦 Downloading template from ${repo}/${subfolder}...\n`));

  try {
    // Step 4a: Shallow clone the entire repo
    console.log(chalk.blue('🔄 Cloning repository...'));
    console.log(chalk.gray(`Running: git clone --depth 1 ${repoUrl} ${tempDir}`));
    
    try {
      const cloneResult = await execa('git', ['clone', '--depth', '1', repoUrl, tempDir], {
        stdio: 'inherit', // Show git output for debugging
        timeout: 30000 // 30 second timeout
      });
      
      console.log(chalk.green('✅ Git clone completed'));
      console.log(chalk.gray(`Clone result:`, cloneResult));
    } catch (cloneError) {
      console.log(chalk.red(`❌ Git clone failed: ${cloneError.message}`));
      console.log(chalk.gray(`Clone error details:`, cloneError));
      throw cloneError;
    }

    // Step 4b: Copy the specific subfolder to project directory
    console.log(chalk.blue('📁 Extracting template files...'));
    const { existsSync } = await import('fs');
    const subfolderPath = `${tempDir}/${subfolder}`;
    
    console.log(chalk.gray(`Checking for subfolder: ${subfolderPath}`));
    
    if (!existsSync(subfolderPath)) {
      // List what's actually in the temp directory for debugging
      const { readdirSync } = await import('fs');
      try {
        const tempContents = readdirSync(tempDir);
        console.log(chalk.yellow(`Contents of ${tempDir}:`), tempContents);
      } catch (e) {
        console.log(chalk.yellow(`Could not read temp directory: ${e.message}`));
      }
      throw new Error(`Template folder '${subfolder}' not found in repository`);
    }
    
    console.log(chalk.gray(`Copying: ${subfolderPath} -> ${projectName}`));
    await execa('cp', ['-r', subfolderPath, projectName], { stdio: 'inherit' });

    // Step 4c: Clean up temporary directory
    console.log(chalk.blue('🧹 Cleaning up...'));
    await execa('rm', ['-rf', tempDir], { stdio: 'inherit' });

  } catch (error) {
    console.log(chalk.red('💥 createTutorialTemplate function caught an error!'));
    console.log(chalk.red(`Error details: ${error.message}`));
    console.log(chalk.gray('Full error:', error));
    
    // Clean up temp directory if it exists
    try {
      await execa('rm', ['-rf', tempDir], { stdio: 'pipe' });
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    console.log(chalk.red(`\n❌ Failed to download template: ${error.message}`));
    
    if (error.message.includes('not found')) {
      console.log(chalk.yellow(`\n💡 Available framework options:`));
      console.log(chalk.gray(`   - react`));
      console.log(chalk.gray(`   - vue`));
      console.log(chalk.gray(`   - svelte`));
      console.log(chalk.gray(`   - angular`));
    } else {
      console.log(chalk.yellow(`\n💡 This might be a network connectivity issue.`));
      console.log(chalk.gray(`Make sure you have internet access and git is installed.`));
    }
    
    throw error;
  }
}