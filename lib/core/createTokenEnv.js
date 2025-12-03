import { join } from "path";
import chalk from "chalk";
import { promises as fs } from "fs";

export async function createTokenEnv(projectPath, token, framework) {
  console.log(chalk.blue(`🔒 Setting up Mapbox token in: ${projectPath}`));
  
  try {
    if (framework === 'angular') {
      // For Angular, replace the placeholder in environment files
      const envFiles = [
        join(projectPath, 'src/environments/environment.ts'),
        join(projectPath, 'src/environments/environment.prod.ts')
      ];
      
      for (const envFile of envFiles) {
        try {
          const content = await fs.readFile(envFile, 'utf8');
          const updatedContent = content.replace('YOUR_MAPBOX_ACCESS_TOKEN', token);
          await fs.writeFile(envFile, updatedContent);
          console.log(chalk.green(`  ✓ Updated token in: ${envFile}`));
        } catch (err) {
          console.log(chalk.yellow(`  ⚠️  Could not update ${envFile}: ${err.message}`));
        }
      }
    } else if (framework === 'vanilla-no-bundler') {
      // For Vanilla No Bundler, replace the placeholder directly in index.html
      const indexHtmlPath = join(projectPath, 'index.html');
      
      try {
        const content = await fs.readFile(indexHtmlPath, 'utf8');
        const updatedContent = content.replace('your_mapbox_access_token_here', token);
        await fs.writeFile(indexHtmlPath, updatedContent);
        console.log(chalk.green(`  ✓ Updated token in: ${indexHtmlPath}`));
      } catch (err) {
        console.log(chalk.yellow(`  ⚠️  Could not update ${indexHtmlPath}: ${err.message}`));
        throw err;
      }
    } else {
      // For other frameworks, copy .env.example to .env and replace the token placeholder
      const envExamplePath = join(projectPath, '.env.example');
      const envFilePath = join(projectPath, '.env');
      
      try {
        // Read the .env.example file
        const envExampleContent = await fs.readFile(envExamplePath, 'utf8');
        
        // Replace placeholder with actual token
        const envContent = envExampleContent.replace(
          /VITE_MAPBOX_ACCESS_TOKEN=.*/,
          `VITE_MAPBOX_ACCESS_TOKEN=${token}`
        );
        
        // Write to .env file
        await fs.writeFile(envFilePath, envContent);
        console.log(chalk.green(`  ✓ Created .env file with Mapbox token`));
      } catch (err) {
        console.log(chalk.yellow(`  ⚠️  Could not create .env file: ${err.message}`));
        throw err;
      }
    }

    console.log(chalk.green(`  ✓ Environment configuration complete`));
  } catch (err) {
    console.error(chalk.red("❌ Error while replacing tokens:"), err.message);
  }
}