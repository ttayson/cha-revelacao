import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, ticketNumber, gender } = await request.json()

    // Find user
    const user = await prisma.user.findFirst({
      where: { name },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if ticket number already exists
    const existingTicket = await prisma.revelation.findUnique({
      where: { ticketNumber },
    })

    if (existingTicket) {
      return NextResponse.json({ error: "Ticket number already exists" }, { status: 400 })
    }

    // Create revelation
    const revelation = await prisma.revelation.create({
      data: {
        userId: user.id,
        ticketNumber,
        gender,
      },
    })

    return NextResponse.json(revelation)
  } catch (error) {
    console.error("Error creating revelation:", error)
    return NextResponse.json({ error: "Failed to create revelation" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
