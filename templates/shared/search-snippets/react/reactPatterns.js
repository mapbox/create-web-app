// templates/shared/search-snippets/react/patterns.js
export const reactPatterns = {
  // Add imports after last import statement
  imports: /(import.*?['"];?\s*\n)(?!import)/s,
  
  // Add logic inside function component (after opening brace)
  logic: /(function App\(\)[^{]*{|const App = \(\) => {)/,
  
  // Add component before map div
  component: /(\s*)(<div[^>]*id=["']map["'][^>]*>)/,
  
  // Alternative: Add component inside a container div
  containerComponent: /(\s*)(<div className=["'].*container.*["'][^>]*>\s*)/
};