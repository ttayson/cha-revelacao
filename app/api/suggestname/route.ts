import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Certifique-se de que esse import está correto com seu projeto

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, gender } = body;

    if (!name && !gender) {
      return NextResponse.json(
        { error: "Pelo menos um nome deve ser informado." },
        { status: 400 }
      );
    }

    const suggestion = await prisma.nameSuggestion.create({
      data: {
        gender,
        name: name.toLowerCase(),
      },
    });

    return NextResponse.json({ success: true, suggestion }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar sugestão de nome:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
