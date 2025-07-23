import { generatePassword } from "@/app/[locale]/generators/utils/passwordGenerator";

/**
 * @swagger
 * /api/generators/passwordGenerator:
 *   get:
 *     description: Generate a random password
 *     parameters:
 *       - in: query
 *         name: length
 *         schema:
 *           type: integer
 *           default: 16
 *         required: false
 *         description: Password length
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const length = parseInt(searchParams.get("length") || "16", 10);
  const password = generatePassword(length);
  return Response.json({ password });
} 