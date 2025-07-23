import { generateAddress } from "@/app/[locale]/generators/utils/addressGenerator";

/**
 * @swagger
 * /api/generators/addressGenerator:
 *   get:
 *     description: Generate a random address
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zip:
 *                   type: string
 *                 country:
 *                   type: string
 */
export async function GET() {
  const address = generateAddress();
  return Response.json(address);
} 