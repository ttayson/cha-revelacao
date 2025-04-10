import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all revelations with user info
    const revelations = await prisma.revelation.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Format the data
    const ranking = revelations.map((revelation) => ({
      name: revelation.user.name,
      ticketNumber: revelation.ticketNumber,
    }))

    return NextResponse.json(ranking)
  } catch (error) {
    console.error("Error fetching ranking:", error)
    return NextResponse.json({ error: "Failed to fetch ranking" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
