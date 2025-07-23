import { generateUsername } from "@/app/[locale]/generators/utils/usernameGenerator";

/**
 * @swagger
 * /api/generators/usernameGenerator:
 *   get:
 *     description: Generate a random username
 *     parameters:
 *       - in: query
 *         name: includeNumber
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Whether to include a number at the end
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeNumber = searchParams.get("includeNumber") !== "false";
  const username = generateUsername(includeNumber);
  return Response.json({ username });
} 