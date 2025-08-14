import { NextRequest } from 'next/server';

interface JWTConfig {
  algorithm: string;
  expiresIn: number;
  includeIssuer: boolean;
  includeAudience: boolean;
  includeSubject: boolean;
  includeJTI: boolean;
  includeIAT: boolean;
  includeNBF: boolean;
}

interface JWTPayload {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  jti?: string;
  [key: string]: any;
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomEmail(): string {
  const domains = ['example.com', 'test.org', 'demo.net', 'fake.io', 'mock.co'];
  const names = ['user', 'admin', 'test', 'demo', 'fake', 'mock', 'john', 'jane'];
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${name}${randomNum}@${domain}`;
}

function generateRandomName(): string {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

function generateFakeJWT(config: JWTConfig): { jwt: string; decoded: any } {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + config.expiresIn;
  
  // Create payload
  const payload: JWTPayload = {};
  
  if (config.includeSubject) {
    payload.sub = generateRandomEmail();
  }
  
  if (config.includeIssuer) {
    payload.iss = 'https://f3ssoftware.com';
  }
  
  if (config.includeAudience) {
    payload.aud = ['https://f3ssoftware.com/api', 'https://f3ssoftware.com/web'];
  }
  
  if (config.includeIAT) {
    payload.iat = now;
  }
  
  if (config.includeNBF) {
    payload.nbf = now;
  }
  
  if (config.includeJTI) {
    payload.jti = generateRandomString(16);
  }
  
  // Add some custom claims
  payload.name = generateRandomName();
  payload.email = generateRandomEmail();
  payload.role = ['user', 'admin', 'moderator'][Math.floor(Math.random() * 3)];
  payload.permissions = ['read', 'write', 'delete'].slice(0, Math.floor(Math.random() * 3) + 1);
  payload.exp = expiresAt;
  
  // Create header
  const header = {
    alg: config.algorithm,
    typ: 'JWT'
  };
  
  // Encode header and payload (base64url)
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Generate fake signature (this is not a real cryptographic signature)
  const signature = generateRandomString(43); // Base64 encoded string length
  
  // Combine to form JWT
  const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  return {
    jwt,
    decoded: {
      header,
      payload,
      signature: signature
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const config: JWTConfig = await request.json();
    
    // Validate config
    const validAlgorithms = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'];
    if (!validAlgorithms.includes(config.algorithm)) {
      return Response.json({ error: 'Invalid algorithm' }, { status: 400 });
    }
    
    if (config.expiresIn < 60 || config.expiresIn > 31536000) {
      return Response.json({ error: 'Expires in must be between 60 and 31536000 seconds' }, { status: 400 });
    }
    
    // Generate JWT
    const result = generateFakeJWT(config);
    
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET() {
  // Default JWT generation
  const defaultConfig: JWTConfig = {
    algorithm: 'HS256',
    expiresIn: 3600,
    includeIssuer: true,
    includeAudience: true,
    includeSubject: true,
    includeJTI: true,
    includeIAT: true,
    includeNBF: false,
  };
  
  const result = generateFakeJWT(defaultConfig);
  return Response.json(result);
}
