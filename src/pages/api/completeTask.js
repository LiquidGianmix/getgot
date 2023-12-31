// pages/api/completeTask.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, index } = req.body;

    const tasksFilePath = path.join(process.cwd(), 'public', `${code}.txt`);
    const successFilePath = path.join(process.cwd(), 'public', `${code}_success.txt`);

    try {
      // Ensure the success file exists
      if (!fs.existsSync(successFilePath)) {
        fs.writeFileSync(successFilePath, '', 'utf8');
      }

      // Read and update the tasks file
      const tasks = fs.existsSync(tasksFilePath) ? fs.readFileSync(tasksFilePath, 'utf8').split('\n') : [];
      if (index < 0 || index >= tasks.length) {
        throw new Error('Invalid task index');
      }
      const completedTask = tasks.splice(index, 1)[0];
      fs.writeFileSync(tasksFilePath, tasks.join('\n'), 'utf8');

      // Append to the success file
      fs.appendFileSync(successFilePath, `${completedTask}\n`, 'utf8');

      res.status(200).json({ message: 'Task completed successfully' });
    } catch (error) {
      res.status(500).json({ message: `Error completing task: ${error.message}` });
    }
  } else {
    res.status(405).end('Method not allowed');
  }
}
