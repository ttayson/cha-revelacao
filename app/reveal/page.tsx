"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import confetti from "canvas-confetti";
import { Baby } from "lucide-react";

export default function RevealPage() {
  const [isScratched, setIsScratched] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [babyGender, setbabyGender] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const defaultColors = {
    primary: "#D1D5DB", // cinza neutro
    secondary: "#F3F4F6", // fundo claro
    accent: "#9CA3AF", // cinza escuro
    text: "#374151", // texto neutro
    button: "#6B7280", // botão neutro
  };

  const girlColors = {
    primary: "#F9A8D4",
    secondary: "#FDF2F8",
    accent: "#FBBF24",
    text: "#BE185D",
    button: "#F472B6",
  };

  const boyColors = {
    primary: "#93C5FD",
    secondary: "#EFF6FF",
    accent: "#34D399",
    text: "#1D4ED8",
    button: "#60A5FA",
  };

  const genderColors = isRevealed
    ? babyGender === "menina"
      ? girlColors
      : boyColors
    : defaultColors;

  const ticketNumberRef = useRef<string>(
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  );

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const response = await fetch("/api/gender");
        if (response.ok) {
          const data = await response.json();
          setbabyGender(data.gender);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    }

    fetchAttempts();
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const palpite = localStorage.getItem("palpite");
    if (data) {
      const userData = JSON.parse(data);
      setUserName(userData.name);
      setGender(palpite || "");
    } else {
      router.push("/");
    }

    const currentTicketNumber = ticketNumberRef.current;
    setTicketNumber(currentTicketNumber);

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#CCCCCC";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#FFFBEA";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = genderColors.accent;
        ctx.font = "bold 20px Courier";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`BILHETE Nº ${currentTicketNumber}`, canvas.width / 2, 30);

        ctx.fillStyle = genderColors.primary;
        ctx.font = "bold 34px Comic Sans MS";
        ctx.fillText(
          `É ${(babyGender || "??").toUpperCase()}!`,
          canvas.width / 2,
          canvas.height / 2
        );

        ctx.strokeStyle = genderColors.accent;
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(20, canvas.height - 50);
        ctx.lineTo(canvas.width - 20, canvas.height - 50);
        ctx.stroke();

        ctx.font = "12px monospace";
        ctx.fillStyle = "#9CA3AF";
        ctx.setLineDash([]);
        ctx.fillText(
          `SÉRIE: T&T-${Date.now().toString().slice(-6)}`,
          canvas.width / 2,
          canvas.height - 25
        );

        ctx.globalCompositeOperation = "source-over";

        let isDrawing = false;

        const startDrawing = (e: MouseEvent | TouchEvent) => {
          isDrawing = true;
          draw(getEventPosition(e, canvas));
        };

        const stopDrawing = () => {
          isDrawing = false;
        };

        const draw = (position: { x: number; y: number }) => {
          if (!isDrawing) return;

          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.arc(position.x, position.y, 20, 0, Math.PI * 2);
          ctx.fill();

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          let transparentPixels = 0;

          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
          }

          const percentScratched =
            (transparentPixels / (pixels.length / 4)) * 100;
          if (percentScratched > 50 && !isScratched) {
            setIsScratched(true);
          }
        };

        const getEventPosition = (
          e: MouseEvent | TouchEvent,
          canvas: HTMLCanvasElement
        ) => {
          const rect = canvas.getBoundingClientRect();
          let x, y;

          if ((e as TouchEvent).touches) {
            x = (e as TouchEvent).touches[0].clientX - rect.left;
            y = (e as TouchEvent).touches[0].clientY - rect.top;
          } else {
            x = (e as MouseEvent).clientX - rect.left;
            y = (e as MouseEvent).clientY - rect.top;
          }

          return { x, y };
        };

        const moveDrawing = (e: MouseEvent | TouchEvent) => {
          if (isDrawing) {
            draw(getEventPosition(e, canvas));
          }
        };

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("touchstart", startDrawing);
        canvas.addEventListener("mousemove", moveDrawing);
        canvas.addEventListener("touchmove", moveDrawing);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("touchend", stopDrawing);

        return () => {
          canvas.removeEventListener("mousedown", startDrawing);
          canvas.removeEventListener("touchstart", startDrawing);
          canvas.removeEventListener("mousemove", moveDrawing);
          canvas.removeEventListener("touchmove", moveDrawing);
          canvas.removeEventListener("mouseup", stopDrawing);
          canvas.removeEventListener("touchend", stopDrawing);
        };
      }
    }
  }, [router, babyGender]);

  const handleReveal = async () => {
    setIsRevealed(true);

    // Save to database
    try {
      await fetch("/api/revelations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          ticketNumber: ticketNumber,
          gender: gender,
        }),
      });
    } catch (error) {
      console.error("Error saving revelation:", error);

      // Fallback to localStorage if API fails
      const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
      if (!ranking.some((r: any) => r.name === userName)) {
        ranking.push({
          name: userName,
          ticketNumber: ticketNumber,
        });
        localStorage.setItem("ranking", JSON.stringify(ranking));
      }
    }

    // Confete
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D1D5DB", "#E5E7EB", "#F3F4F6", "#FFFFFF"],
    });

    // 🔥 Remove os dados do localStorage após a revelação
    localStorage.removeItem("userData");
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${genderColors.secondary}, white)`,
      }}
    >
      <Card
        className="border-4 rounded-2xl shadow-lg max-w-2xl w-full"
        style={{ borderColor: genderColors.accent }}
      >
        <CardHeader
          className="rounded-t-xl"
          style={{ backgroundColor: genderColors.primary }}
        >
          <div className="flex items-center justify-center gap-3">
            <Baby className="h-6 w-6 text-white" />
            <CardTitle
              className="text-center text-3xl font-extrabold tracking-wider"
              style={{ color: genderColors.text }}
            >
              🎉 BILHETE PREMIADO 🎉
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 text-center">
          <h3
            className="text-xl font-semibold uppercase tracking-wide mb-2"
            style={{ color: genderColors.text }}
          >
            {userName}, este bilhete contém um segredo...
          </h3>
          <p
            className="text-md italic mb-4"
            style={{ color: genderColors.primary }}
          >
            Raspe com cuidado e descubra o que o destino reservou!
          </p>

          <div
            className="relative mx-auto mb-6 w-80 h-64 rounded-lg overflow-hidden border-4 shadow-lg"
            style={{ borderColor: genderColors.accent }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full h-full cursor-pointer"
            />

            {isScratched && !isRevealed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={handleReveal}
                  className="font-bold rounded-xl text-lg border shadow-md"
                  style={{
                    backgroundColor: genderColors.button,
                    color: "#fff",
                    borderColor: genderColors.accent,
                  }}
                >
                  🎁 Revelar Prêmio!
                </Button>
              </div>
            )}

            {isRevealed && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  animation: "smokeEffect 2s ease-in-out",
                }}
              >
                <p
                  className="text-4xl font-bold mb-4"
                  style={{ color: genderColors.text }}
                >
                  É {babyGender.toUpperCase()}!
                </p>
                <p className="text-xl font-bold text-gray-700">
                  Bilhete Nº {ticketNumber}
                </p>
              </div>
            )}
          </div>

          {isRevealed && (
            <>
              <p
                className="text-xl font-bold"
                style={{ color: genderColors.primary }}
              >
                Parabéns! Você descobriu o segredo!
              </p>
              <p className="text-sm italic mt-2 text-gray-600">
                🚨 Shhh! Mantenha em segredo até o grande anúncio! 🤫
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            style={{
              borderColor: genderColors.accent,
              color: genderColors.text,
            }}
          >
            Voltar ao Início
          </Button>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes smokeEffect {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
