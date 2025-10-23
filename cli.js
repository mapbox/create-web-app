#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { execa } from "execa";
import { existsSync, promises as fs } from "fs";
import addSearchFeature from "./lib/search/addSearchFeature.js"
import { createTemplate, replaceTokenInFiles } from "./lib/core/index.js";
import open from "open";


async function run() {
  console.log(chalk.cyan.bold("\n🌍 Welcome to create-mapbox-web-app!\n"));

  // Step 1: Framework selection
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Which framework do you want to use?",
      choices: ["Vanilla", "React", "Vue", "Svelte", "Angular"]
    }
  ]);

  const frameworkLower = framework.toLowerCase();

  // Step 2: Project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: `mapbox-${frameworkLower}-app`
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

   // Step 4: Search JS
  const { search } = await inquirer.prompt([
    {
      type: "confirm",
      name: "search",
      message: "Addons: Add interactive Search to your map?",
    }
  ]);

  // Step 5: Clone template from  /templates/{framework}
 try {
     await createTemplate(frameworkLower, projectName)
  } catch(err) {
    console.log(chalk.red.bold("\nThere was a problem cloning the template:", err))
  }

  if (search) {
    console.log(chalk.gray("\n🔍 Adding Search JS...\n"))
    try {
      await addSearchFeature(frameworkLower, projectName)
    } catch(err) {
      console.log(chalk.red.bold("\nError trying to add Search JS Template: ", err))
    }
  }
 
  // Step 6: Find and replace token placeholder in all files
  try {
    await replaceTokenInFiles(projectName, token, frameworkLower);
  } catch(err) {
    console.log(chalk.red.bold("\nError adding token to env files:", err))
  }

  // Step 6: Install deps
  console.log(chalk.cyan("\n📦 Installing dependencies... (this may take a minute)\n"));
  await execa("npm", ["install"], { cwd: projectName, stdio: "inherit" });
  
  if (search) {
    // Install framework-specific search packages
    const searchPackages = {
      'react': '@mapbox/search-js-react',
      'vue': '@mapbox/search-js-web',
      'svelte': '@mapbox/search-js-web', 
      'angular': '@mapbox/search-js-web',
      'vanilla': '@mapbox/search-js-web'
    };
    
    const packageToInstall = searchPackages[frameworkLower] || '@mapbox/search-js-web';
    try {
      await execa("npm", ["install", packageToInstall], { cwd: projectName, stdio: "inherit" });
    } catch(err) {
      console.log(chalk.red.bold(`\nError trying to install ${packageToInstall}: `, err))
    }
  }
  // Step 7: Run app
  console.log(chalk.green(`\n🚀 Starting ${framework} dev server...\n`));
  
  const ports = {
    react: 5173,    // Vite
    vue: 5173,      // Vite  
    svelte: 5173,   // Vite
    angular: 4200,  // Angular CLI
    vanilla: 5173   // Vite
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
