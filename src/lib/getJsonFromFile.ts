"use server"

import * as fs from 'fs/promises';
import * as path from 'path';

export async function getJsonFromFile(){
    const filePath = path.join(process.cwd(), 'scan_report');
    try {
      const results = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(results);
      return data;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
};
