#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { execa } from "execa";
import { existsSync, promises as fs } from "fs";
import { addMapboxGLJS, addSearchFeature } from "./lib/core/addAppFeatures.js"
import { createViteTemplate, replaceTokenInFiles } from "./lib/core/index.js";
import open from "open";


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

   // Step 4: Search JS
  const { search } = await inquirer.prompt([
    {
      type: "confirm",
      name: "search",
      message: "Addons: Add interactive Search to your map?",
    }
  ]);

  // Step 5: Clone template from tutorials repo OR Minimal framework templates in /templates/
  try {
    await createViteTemplate(frameworkLower, projectName)
    console.log("installed the appropriate vite template")
  } catch(err) {
    console.log("There was an error creating the Vite Template: ", error)
  }

  // Copy Map App Components into Vite Template
  try {
    await addMapboxGLJS(frameworkLower, projectName)
  } catch(err) {
    console.log("Error copying map components into package:", err)
  }

  if (search) {
    console.log(chalk.gray("\n🔍 Adding Search JS...\n"))
    try {
      await addSearchFeature(frameworkLower, projectName)
    } catch(err) {
      console.log("Error trying to add Search JS Template: ", err)
    }
  }
 
//   // Step 6: Find and replace token placeholder in all files
//   console.log(chalk.gray("\n🔍 Searching for token placeholder and replacing...\n"));
//   await replaceTokenInFiles(projectName, token);

//   // Step 6: Install deps
//   console.log(chalk.cyan("\n📦 Installing dependencies... (this may take a minute)\n"));
//   await execa("npm", ["install"], { cwd: projectName, stdio: "inherit" });
  
//   if (search) {
//      await execa("npm", ["install", "@mapbox/search-js-react"], { cwd: projectName, stdio: "inherit" });
//   }
//   // Step 7: Run app
//   console.log(chalk.green(`\n🚀 Starting ${framework} dev server...\n`));
  
//   const ports = {
//     react: 5173,    // Vite
//     vue: 5173,      // Vite  
//     svelte: 5173,   // Vite
//     angular: 4200   // Angular CLI
//   };
//   const port = ports[frameworkLower] || 5173;

//   // Open browser after a short delay to let the dev server start
//   console.log(chalk.green.bold("\n🌐 Browser will open automatically in 3 seconds..."));
//   console.log(chalk.gray("─".repeat(50)));
//   setTimeout(async () => {
//     try {
//       await open(`http://localhost:${port}`);
//     } catch (err) {
//       console.log(chalk.yellow(`⚠️  Could not open browser automatically. Visit http://localhost:${port}`));
//     }
//   }, 3000); // 3 second delay

//   const command = frameworkLower === 'angular' ? ["start"] : ["run", "dev"];
//   await execa("npm", command, { cwd: projectName, stdio: "inherit" });
  }

run().catch((err) => {
  console.error(chalk.red("❌ Something went wrong:"));
  console.error(err);
  process.exit(1);
});
