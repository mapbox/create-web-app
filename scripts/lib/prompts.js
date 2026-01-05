// Prompts - Interactive inquirer prompts for update mode

import inquirer from 'inquirer';

/**
 * Ask user how they want to update templates
 */
export async function promptUpdateStrategy() {
  const { updateStrategy } = await inquirer.prompt([
    {
      type: 'list',
      name: 'updateStrategy',
      message: 'How would you like to update the templates?',
      choices: [
        { name: 'Update all templates with changes', value: 'all' },
        { name: 'Select specific templates to update', value: 'specific' },
        { name: 'Exit without updating', value: 'none' }
      ]
    }
  ]);
  
  return updateStrategy;
}

/**
 * Prompt user to select specific templates
 */
export async function promptSelectTemplates(templatesWithChanges) {
  const { selectedTemplates } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTemplates',
      message: 'Select templates to update:',
      choices: templatesWithChanges.map(t => ({
        name: `${t.template} (${t.hasChanges} change${t.hasChanges > 1 ? 's' : ''})`,
        value: t.template,
        checked: false
      }))
    }
  ]);
  
  return selectedTemplates;
}

/**
 * Confirm before applying updates
 */
export async function promptConfirmUpdate(count) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Update ${count} template${count > 1 ? 's' : ''}?`,
      default: true
    }
  ]);
  
  return confirm;
}
