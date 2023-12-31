// pages/api/deleteTask.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, index } = req.body;

    const codeFilePath = path.join(process.cwd(), 'public', `${code}.txt`);
    const replacementsFilePath = path.join(process.cwd(), 'public', 'replacements.txt');

    try {
      const data = fs.readFileSync(codeFilePath, 'utf8');
      let lines = data.split('\n');

      const replacementsData = fs.readFileSync(replacementsFilePath, 'utf8');
      let replacementLines = replacementsData.split('\n');

      if (replacementLines.length === 0 || replacementLines[0] === '') {
        throw new Error('No replacements available');
      }

      const replacement = replacementLines.shift();

      lines[index] = replacement;

      fs.writeFileSync(codeFilePath, lines.join('\n'), 'utf8');
      fs.writeFileSync(replacementsFilePath, replacementLines.join('\n'), 'utf8');

      res.status(200).json({ message: 'Task replaced successfully' });
    } catch (error) {
      res.status(500).json({ message: `Error replacing task: ${error.message}` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
