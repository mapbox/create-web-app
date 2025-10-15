#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { execa } from "execa";
import { existsSync, promises as fs } from "fs";
import { replaceTokenInFiles } from "./replaceToken.js";
import open from "open";
import { createTutorialTemplate } from "./utils/createTutorialTemplate.js";
import { createMinimalTemplate } from "./utils/createMinimalTemplate.js";


async function run() {
  console.log(chalk.cyan.bold("\n🌍 Welcome to create-mapbox-gljs-app!\n"));

  // Step 1: Framework selection
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Which framework do you want to use?",
      choices: ["React", "Vue", "Svelte", "Angular"]
    }
  ]);

  const frameworkLower = framework.toLowerCase();

  // Step 3: Template Type
  const { templateType } = await inquirer.prompt([{
    type: "list",
    name: "templateType", 
    message: "Choose template type:",
    choices: [
      "Example App - simple app demonstrating state management, event handling and 2-way interactivity.",
      "Minimal setup - just a full-screen map"
    ]
  }]);

  // Step 2: Project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: `mapbox-${framework}-app`
    }
  ]);

  if (existsSync(projectName)) {
    console.error(chalk.red(`❌ Folder ${projectName} already exists.`));
    process.exit(1);
  }

  // Step 3: Mapbox token
  const { token } = await inquirer.prompt([
    {
      type: "input",
      name: "token",
      message: `Enter your Mapbox Access Token:\n  ${chalk.gray('(Get yours at')} ${chalk.blue.underline('https://console.mapbox.com')}${chalk.gray(')')}`,
      validate: (val) => val.length > 0 || "Token cannot be empty"
    }
  ]);


  // Step 4: Clone template from tutorials repo OR Minimal framework templates in /templates/
  if(templateType.includes('Minimal')) {
    await createMinimalTemplate(frameworkLower, projectName)
  } else {
    await createTutorialTemplate(frameworkLower, projectName)
  }
 
  // Step 5: Find and replace token placeholder in all files
  console.log(chalk.gray("\n🔍 Searching for token placeholder and replacing...\n"));
  await replaceTokenInFiles(projectName, token);

  // Step 6: Install deps
  console.log(chalk.cyan("\n📦 Installing dependencies... (this may take a minute)\n"));
  await execa("npm", ["install"], { cwd: projectName, stdio: "inherit" });

  // Step 7: Run app
  console.log(chalk.green(`\n🚀 Starting ${framework} dev server...\n`));
  
  const ports = {
    react: 5173,    // Vite
    vue: 5173,      // Vite  
    svelte: 5173,   // Vite
    angular: 4200   // Angular CLI
  };
  const port = ports[frameworkLower] || 5173;

  // Open browser after a short delay to let the dev server start
  console.log(chalk.green.bold("\n🌐 Browser will open automatically in 3 seconds..."));
  console.log(chalk.gray("─".repeat(50)));
  setTimeout(async () => {
    try {
      await open(`http://localhost:${port}`);
    } catch (err) {
      console.log(chalk.yellow(`⚠️  Could not open browser automatically. Visit http://localhost:${port}`));
    }
  }, 3000); // 3 second delay

  const command = frameworkLower === 'angular' ? ["start"] : ["run", "dev"];
  await execa("npm", command, { cwd: projectName, stdio: "inherit" });
}

run().catch((err) => {
  console.error(chalk.red("❌ Something went wrong:"));
  console.error(err);
  process.exit(1);
});
