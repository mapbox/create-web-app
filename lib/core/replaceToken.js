import { join } from "path";
import chalk from "chalk";
import { promises as fs } from "fs";

export async function replaceTokenInFiles(projectPath, token, framework) {
  console.log(chalk.blue(`🔍 Creating .env file with Mapbox token in: ${projectPath}`));
  
  try {
    // Determine the environment variable name based on framework
    const isAngular = framework === 'angular';
    const envVarName = isAngular ? 'MAPBOX_ACCESS_TOKEN' : 'VITE_MAPBOX_ACCESS_TOKEN';
    
    // Create .env file with the Mapbox access token
    const envFilePath = join(projectPath, '.env');
    const envContent = `# Mapbox Access Token
# Get your token from: https://account.mapbox.com/access-tokens/
${envVarName}=${token}
`;

    await fs.writeFile(envFilePath, envContent);
    console.log(chalk.green(`  ✓ Created .env file with Mapbox token`));

    console.log(chalk.green(`  ✓ Environment configuration complete`));
  } catch (err) {
    console.error(chalk.red("❌ Error while replacing tokens:"), err.message);
  }
}