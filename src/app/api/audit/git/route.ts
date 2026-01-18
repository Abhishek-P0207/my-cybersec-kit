import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Strict regex for HTTPS GitHub/GitLab URLs only
const GITHUB_HTTPS_REGEX = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/;
const GITLAB_HTTPS_REGEX = /^https:\/\/gitlab\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/;

interface TrivyResult {
  SchemaVersion?: number;
  ArtifactName?: string;
  ArtifactType?: string;
  Metadata?: any;
  Results?: any[];
  [key: string]: any;
}

function validateRepoUrl(repoUrl: string): boolean {
  // Must be a string
  if (typeof repoUrl !== 'string') {
    return false;
  }

  // Must start with https:// (prevent file://, git://, etc.)
  if (!repoUrl.startsWith('https://')) {
    return false;
  }

  // Must match GitHub or GitLab pattern
  return GITHUB_HTTPS_REGEX.test(repoUrl) || GITLAB_HTTPS_REGEX.test(repoUrl);
}

function sanitizeRepoUrl(repoUrl: string): string {
  // Remove any shell metacharacters that could be used for injection
  // Even though we validate with regex, this adds an extra layer of security
  const dangerous = /[;&|`$(){}[\]<>]/g;
  
  if (dangerous.test(repoUrl)) {
    throw new Error('Repository URL contains invalid characters');
  }

  return repoUrl.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repoUrl, token } = body;

    // Validate input exists
    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'repoUrl is required and must be a string' },
        { status: 400 }
      );
    }

    // Security: Validate HTTPS GitHub/GitLab URL only
    if (!validateRepoUrl(repoUrl)) {
      return NextResponse.json(
        { 
          error: 'Invalid repository URL',
          details: 'Only HTTPS URLs from github.com or gitlab.com are allowed'
        },
        { status: 400 }
      );
    }

    // Security: Sanitize input to prevent command injection
    let sanitizedUrl: string;
    try {
      sanitizedUrl = sanitizeRepoUrl(repoUrl);
    } catch (sanitizeError: any) {
      return NextResponse.json(
        { error: 'Invalid repository URL format', details: sanitizeError.message },
        { status: 400 }
      );
    }

    const scanEnv = { 
      ...process.env, 
      GITHUB_TOKEN: token || process.env.GITHUB_TOKEN
    };

    // Execute Trivy scan
    let stdout: string;
    try {
      const { stdout: output } = await execAsync(
        `trivy repo ${sanitizedUrl} --format json -q`,
        { 
          env: scanEnv,
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large scan results
          timeout: 300000 // 5 minute timeout
        }
      );
      stdout = output;
    } catch (execError: any) {
      // Check if Trivy is not installed
      if (execError.code === 127 || execError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Trivy is not installed on this system' },
          { status: 500 }
        );
      }

      // Check for common repository access errors
      const errorMessage = execError.message || execError.stderr || '';
      
      if (errorMessage.includes('repository not found') || 
          errorMessage.includes('404')) {
        return NextResponse.json(
          { 
            error: 'Repository not found',
            details: 'The repository does not exist or the URL is incorrect'
          },
          { status: 404 }
        );
      }

      if (errorMessage.includes('authentication required') || 
          errorMessage.includes('403') ||
          errorMessage.includes('private')) {
        return NextResponse.json(
          { 
            error: 'Access denied',
            details: 'The repository is private or requires authentication'
          },
          { status: 403 }
        );
      }

      if (execError.killed || errorMessage.includes('timeout')) {
        return NextResponse.json(
          { 
            error: 'Scan timeout',
            details: 'The repository scan took too long and was terminated'
          },
          { status: 504 }
        );
      }

      // Generic scan failure
      return NextResponse.json(
        { 
          error: 'Repository scan failed',
          details: errorMessage.substring(0, 500) // Limit error message length
        },
        { status: 500 }
      );
    }

    // Parse JSON output
    let scanResult: TrivyResult;
    try {
      scanResult = JSON.parse(stdout);
    } catch (parseError: any) {
      return NextResponse.json(
        { 
          error: 'Failed to parse scan results',
          details: 'Trivy output was not valid JSON'
        },
        { status: 500 }
      );
    }

    // Return the parsed Trivy results
    return NextResponse.json({
      success: true,
      repository: sanitizedUrl,
      scanDate: new Date().toISOString(),
      results: scanResult
    });

  } catch (error: any) {
    console.error('Git audit error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
