import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { name, questionId, answer, isCorrect, id } = await request.json();

//     // Find user
//     const user = await prisma.user.findFirst({
//       where: { id },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Create attempt
//     const attempt = await prisma.attempt.create({
//       data: {
//         userId: user.id,
//         questionId,
//         answer,
//         isCorrect,
//       },
//     });

//     return NextResponse.json(attempt);
//   } catch (error) {
//     console.error("Error creating attempt:", error);
//     return NextResponse.json(
//       { error: "Failed to create attempt" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function GET() {
  try {
    // Get all users with their attempt counts
    const gender = await prisma.gender.findFirst({});

    return NextResponse.json(gender);
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
