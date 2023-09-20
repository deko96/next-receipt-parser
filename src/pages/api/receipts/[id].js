import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const { id } = req.query;
  const prisma = new PrismaClient();

  try {
    const intId = parseInt(id);
    if (!intId) {
      throw new Error("Invalid receipt ID");
    }

    const receipt = await prisma.receipt.findUnique({
      where: {
        id: intId,
      },
      include: {
        items: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!receipt) {
      return res.status(404).json({
        message: "Receipt not found",
      });
    }

    return res.json(receipt);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Unknown error occured" });
  } finally {
    await prisma.$disconnect();
  }
}
