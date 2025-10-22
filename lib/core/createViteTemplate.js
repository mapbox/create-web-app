import chalk from "chalk";
import { execa } from "execa";

export const createViteTemplate = async (framework, projectName) => {
  const templateMap = {
    'react': 'react',      // or 'react' for JS
    'vue': 'vue',          // or 'vue' for JS  
    'svelte': 'svelte',    // or 'svelte' for JS
    'angular': 'vanilla-ts'   // Angular needs custom handling
  };

  const template = templateMap[framework];
  
  try {
    // This runs non-interactively since all params are provided
    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', template], {
      stdio: 'pipe', // Hide Vite's output, show your own
      cwd: process.cwd()
    });
    
    console.log(chalk.green(`✅ ${framework} project scaffolded`));
  } catch (error) {
    console.error('Failed to create Vite template:', error);
    throw error;
  }
};