import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { gender } = await request.json();

    const result = await prisma.guess.create({
      data: {
        guess: gender,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { error: "Failed to create attempt" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // Get all users with their attempt counts

    const result = await prisma.guess.findMany({});
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
