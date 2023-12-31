import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;

    const directoryPath = path.join(process.cwd(), 'public');
    
    try {
      const files = fs.readdirSync(directoryPath);
      const isValidCode = files.some(file => file === `${code.join("")}.txt`);

      res.status(200).json({ isValid: isValidCode });
    } catch (error) {
      res.status(500).json({ message: 'Error validating the code' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
