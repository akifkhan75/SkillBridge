const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Replace hard-coded colors with theme equivalents (basic ones)
      const colorMap = {
        '#0F172A': 'colors.dark.background',
        '#334155': 'colors.dark.surfaceElevated',
        '#F1F5F9': 'colors.dark.textPrimary',
        '#94A3B8': 'colors.dark.textSecondary',
        '#FFF': '"#FFFFFF"', // or theme.surface but let's just make it valid string or keep it if it's #fff
      };
      
      // For now, let's just see how many files have them.
      for (const [hex, token] of Object.entries(colorMap)) {
        if (content.includes(hex)) {
          content = content.replace(new RegExp(hex, 'g'), token);
          changed = true;
        }
      }

      if (changed) {
        // If we replaced colors, we might need to import colors if not already imported
        if (!content.includes("import { colors }")) {
          content = "import { colors } from '../../src/theme';\n" + content;
        }
        // Write it back
        // fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// Just printing to see
processDir(path.join(__dirname, 'app'));
