/**
 * Script: check-template-updates.js
 * Purpose: Check and update template dependencies against upstream sources
 * Usage: 
 *   node scripts/check-template-updates.js         (check only)
 *   node scripts/check-template-updates.js --update (interactive update mode)
 */

import chalk from 'chalk';
import { getLatestMapboxGl } from './lib/fetchers.js';
import { comparePackageJSONs } from './lib/comparisons.js';
import { checkAngularDependencies } from './lib/angular-checker.js';
import { checkVanillaNoBundler, applyCDNUpdates } from './lib/cdn-checker.js';
import { applyUpdates } from './lib/updaters.js';
import { promptUpdateStrategy, promptSelectTemplates, promptConfirmUpdate } from './lib/prompts.js';

// Map local template folder to Vite upstream template folder
const TEMPLATE_CONFIG = {
  react: 'template-react',
  vue: 'template-vue',
  svelte: 'template-svelte',
  vanilla: 'template-vanilla',
  // angular & vanilla-no-bundler: not Vite official templates
};

// All templates to check (including non-Vite)
const ALL_TEMPLATES = ['react', 'vue', 'svelte', 'vanilla', 'angular', 'vanilla-no-bundler'];

const UPDATE_MODE = process.argv.includes('--update');

async function checkAllTemplates(currentMapboxGl) {
  const templateResults = [];
  
  for (const template of ALL_TEMPLATES) {
    console.log(chalk.green(`\n📦 ${template}`));
    
    let results;
    
    // Route to appropriate checker based on template type
    if (template === 'angular') {
      results = await checkAngularDependencies(currentMapboxGl);
    } else if (template === 'vanilla-no-bundler') {
      results = await checkVanillaNoBundler(currentMapboxGl);
    } else {
      // Vite templates
      const remoteTemplate = TEMPLATE_CONFIG[template];
      results = await comparePackageJSONs(template, remoteTemplate, currentMapboxGl);
    }
    
    if (!results.hasChanges) {
      console.log(chalk.dim('🙌 Up to date!'));
    }
    
    templateResults.push({ template, ...results });
  }
  
  return templateResults;
}

async function handleUpdateMode(templatesWithChanges) {
  console.log(chalk.cyan('\n\n📝 Update Mode\n'));
  
  const updateStrategy = await promptUpdateStrategy();
  
  if (updateStrategy === 'none') {
    console.log(chalk.dim('No changes made.\n'));
    return;
  }
  
  let templatesToUpdate = templatesWithChanges;
  
  if (updateStrategy === 'specific') {
    const selectedTemplates = await promptSelectTemplates(templatesWithChanges);
    templatesToUpdate = templatesWithChanges.filter(t => 
      selectedTemplates.includes(t.template)
    );
  }
  
  if (templatesToUpdate.length === 0) {
    console.log(chalk.dim('No templates selected.\n'));
    return;
  }
  
  const confirm = await promptConfirmUpdate(templatesToUpdate.length);
  
  if (!confirm) {
    console.log(chalk.dim('Update cancelled.\n'));
    return;
  }
  
  // Apply updates
  console.log(chalk.cyan('\n📝 Applying updates...\n'));
  for (const template of templatesToUpdate) {
    // Use CDN updater for vanilla-no-bundler, regular updater for others
    if (template.template === 'vanilla-no-bundler') {
      await applyCDNUpdates(template.localPath, template.updates);
    } else {
      await applyUpdates(template.localPath, template.updates);
    }
  }
  
  console.log(chalk.green('\n✨ Updates complete!\n'));
}

async function main() {
  const currentMapboxGl = await getLatestMapboxGl();
  
  console.log(chalk.cyan(`\n🔍 Checking templates against latest versions...\n`));
  console.log(chalk.dim(`Latest mapbox-gl: v${currentMapboxGl}\n`));
  
  const templateResults = await checkAllTemplates(currentMapboxGl);
  
  // If not in update mode, exit here
  if (!UPDATE_MODE) {
    console.log(chalk.cyan('\n\n💡 To update package.json files, run: node scripts/check-template-updates.js --update\n'));
    return;
  }
  
  // Filter templates that have changes
  const templatesWithChanges = templateResults.filter(t => t.hasChanges > 0);
  
  if (templatesWithChanges.length === 0) {
    console.log(chalk.green('\n✨ All templates are up to date!\n'));
    return;
  }
  
  await handleUpdateMode(templatesWithChanges);
}

main();
