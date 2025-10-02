import { join } from "path";
import { glob } from "glob";
import chalk from "chalk";
import { existsSync, promises as fs } from "fs";

export async function replaceTokenInFiles(projectPath, token) {
  console.log(chalk.blue(`🔍 Starting token replacement in: ${projectPath}`));
  
  try {
    // Search for all text files that might contain the token placeholder
    // Exclude node_modules, .git, and other common directories
    const files = await glob("**/*", {
      cwd: projectPath,
      ignore: ["node_modules/**", ".git/**", "Readme.md", "*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf,eot}"],
      nodir: true
    });

    let replacedCount = 0;
    
    for (const file of files) {
      const filePath = join(projectPath, file);
      
      try {
        // Read file content
        const content = await fs.readFile(filePath, "utf8");
        
        // Check if file contains the placeholder
        if (content.includes("YOUR_MAPBOX_ACCESS_TOKEN")) {
          // Replace the placeholder with the actual token
          const updatedContent = content.replace(/YOUR_MAPBOX_ACCESS_TOKEN/g, token);
          
          // Write the updated content back
          await fs.writeFile(filePath, updatedContent);
          
          console.log(chalk.green(`  ✓ Updated token in: ${file}`));
          replacedCount++;
        }
      } catch (err) {
        console.log(chalk.red(`❌ Could not read file: ${file} (${err.message})`));
        // Skip files that can't be read as text (binary files, etc.)
        continue;
      }
    }
    
    if (replacedCount === 0) {
      console.log(chalk.yellow("  ⚠️  No token placeholders found. You may need to manually configure your Mapbox token."));
    } else {
      console.log(chalk.green(`  ✓ Successfully replaced tokens in ${replacedCount} file(s)`));
    }
  } catch (err) {
    console.error(chalk.red("❌ Error while replacing tokens:"), err.message);
  }
}