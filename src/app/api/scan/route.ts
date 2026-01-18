import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { parseString } from 'xml2js';
import { transformNmapXml, validateTarget, cleanTarget } from './helpers';

const execAsync = promisify(exec);
const parseXmlAsync = promisify(parseString);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target } = body;
    
    // Validate input
    if (!target || typeof target !== 'string') {
      return NextResponse.json(
        { error: 'Target is required and must be a string' },
        { status: 400 }
      );
    }
    
    const cleantarget = cleanTarget(target);
    // Security: Strict validation to prevent command injection
    if (!validateTarget(cleantarget)) {
      return NextResponse.json(
        { error: 'Invalid target format. Must be a valid IP address or domain name' },
        { status: 400 }
      );
    }

    // Execute nmap command
    let stdout: string;
    try {
      const { stdout: output } = await execAsync(`nmap -F ${cleantarget} -oX -`);
      stdout = output;
    } catch (execError: any) {
      // Check if nmap is not installed
      if (execError.code === 127 || execError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Nmap is not installed on this system' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Nmap scan failed', details: execError.message },
        { status: 500 }
      );
    }

    // Parse XML output
    const xmlData = await parseXmlAsync(stdout);
    
    // Transform to clean JSON
    const scanResult = transformNmapXml(xmlData);
    console.log(scanResult);

    return NextResponse.json(scanResult);
  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
