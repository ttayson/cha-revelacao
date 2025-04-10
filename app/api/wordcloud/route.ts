import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const data = await prisma.nameSuggestion.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
    });

    const words = data.map((item) => ({
      text: item.name,
      value: item._count.name,
    }));

    return NextResponse.json(words);
  } catch (error) {
    console.error("Erro ao gerar nuvem de palavras:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
