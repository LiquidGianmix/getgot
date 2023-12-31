// pages/api/failTask.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, index } = req.body;

    const tasksFilePath = path.join(process.cwd(), 'public', `${code}.txt`);
    const failFilePath = path.join(process.cwd(), 'public', `${code}_fail.txt`);

    try {
      // Ensure the fail file exists
      if (!fs.existsSync(failFilePath)) {
        fs.writeFileSync(failFilePath, '', 'utf8');
      }

      // Read and update the tasks file
      const tasks = fs.existsSync(tasksFilePath) ? fs.readFileSync(tasksFilePath, 'utf8').split('\n') : [];
      if (index < 0 || index >= tasks.length) {
        throw new Error('Invalid task index');
      }
      const failedTask = tasks.splice(index, 1)[0];
      fs.writeFileSync(tasksFilePath, tasks.join('\n'), 'utf8');

      // Append to the fail file
      fs.appendFileSync(failFilePath, `${failedTask}\n`, 'utf8');

      res.status(200).json({ message: 'Task marked as failed' });
    } catch (error) {
      res.status(500).json({ message: `Error failing task: ${error.message}` });
    }
  } else {
    res.status(405).end('Method not allowed');
  }
}
