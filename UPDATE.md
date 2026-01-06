# Updates

## Check for Updates

To run updates across the templates included in this package run the following command

```
node scripts/check-template-updates.js
```

This will iterate over all templates, checking dependencies for concurrency with the latest [Vite templates](https://github.com/vitejs/vite/tree/main/packages/create-vite) (for Vanilla, React, Vue and Svelte templates) and checking remote dependencies for the Angular template via `npm`.  

This command will produce a report in terminal of all available dependencies available for update. 

## To Update templates

Run the same command with the `--update` flag

```
node scripts/check-template-updates.js --update
```
To implement automatic updates to template files directly through the CLI.  You can choose to 
1. Update all templates which have updates at once
2. Select a singular template for an update at a time

You can also increment versions manually in the corresponding templates if you prefer. 


## Testing Updates
Once local templates have been updated using the script, they must be test locally before being PR'd for review.  Run the `create-web-app` package locally, scaffolding the template you've updated and run the application.  Check for errors, regressions etc.. 

To run this package locally run this command in the main project directory.

```
node cli.js 
```