import { generateUUID } from "@/app/[locale]/generators/utils/uuidGenerator";

/**
 * @swagger
 * /api/generators/uuidGenerator:
 *   get:
 *     description: Generate a UUID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 */
export async function GET() {
  const uuid = generateUUID();
  return Response.json({ uuid });
} 