import { join } from "path";
import chalk from "chalk";
import { promises as fs } from "fs";

export async function replaceTokenInFiles(projectPath, token, framework) {
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
        } catch (err) {
          console.log(chalk.yellow(`  ⚠️  Could not update ${envFile}: ${err.message}`));
        }
      }
    } else {
      // For other frameworks, use .env files
      const envVarName = 'VITE_MAPBOX_ACCESS_TOKEN';
      
      const envFilePath = join(projectPath, '.env');
      const envContent = `# Mapbox Access Token
# Get your token from: https://account.mapbox.com/access-tokens/
${envVarName}=${token}
`;

      await fs.writeFile(envFilePath, envContent);
      console.log(chalk.green(`  ✓ Created .env file with Mapbox token`));

      // Also create .env.example for version control
      const envExamplePath = join(projectPath, '.env.example');
      const envExampleContent = `# Mapbox Access Token
# Get your token from: https://account.mapbox.com/access-tokens/
${envVarName}=your_mapbox_access_token_here
`;

      await fs.writeFile(envExamplePath, envExampleContent);
      console.log(chalk.green(`  ✓ Created .env.example template`));
    }

    console.log(chalk.green(`  ✓ Environment configuration complete`));
  } catch (err) {
    console.error(chalk.red("❌ Error while replacing tokens:"), err.message);
  }
}