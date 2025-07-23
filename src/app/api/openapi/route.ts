import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'F3S Open API',
        version: '1.0.0',
      },
    },
  });
  return Response.json(spec);
} 