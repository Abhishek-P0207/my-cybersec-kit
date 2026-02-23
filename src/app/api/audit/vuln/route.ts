import Docker from 'dockerode';
import { Writable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  
  let fullOutput = '';
  
  const logStream = new Writable({
    write(chunk, encoding, next) {
      const chunkString = chunk.toString();
      fullOutput += chunkString; 
      next();
    }
  });

  try {
    const [runResult, container] = await docker.run(
      'cyberwatch/wapiti', 
      ['-u', url, '-f', 'json', '-o', 'scan_report'], 
      logStream 
    );

    const jsonStartIndex = fullOutput.indexOf('{');
    const jsonEndIndex = fullOutput.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON found in Wapiti output. Scan might have failed.");
    }

    const jsonString = fullOutput.substring(jsonStartIndex, jsonEndIndex + 1);
    const report = JSON.parse(jsonString);

    return NextResponse.json({ success: true, report: report.vulnerabilities });

  } catch (error: any) {
    console.error("Scan Error:", error);
    return NextResponse.json({ error: 'Scan failed', details: error.message }, { status: 500 });
  }
}