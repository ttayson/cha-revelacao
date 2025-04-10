"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Baby } from "lucide-react";

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<
    Array<{ name: string; count: number }>
  >([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const response = await fetch("/api/attempts");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched attempts:", data);
          setAttempts(data);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);

        // Fallback to localStorage if API fails
        const storedAttempts = JSON.parse(
          localStorage.getItem("attempts") || "[]"
        );
        setAttempts(storedAttempts);
      }
    }

    fetchAttempts();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-accent bg-card rounded-2xl shadow-md">
          <CardHeader className="bg-primary rounded-t-xl">
            <div className="flex items-center justify-center gap-3">
              <Baby className="h-6 w-6 text-foreground" />
              <CardTitle className="text-center text-3xl font-bold text-foreground">
                Tentativas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {attempts.length > 0 ? (
              <div className="space-y-3 ranking-scroll pr-2">
                {attempts.map((attempt, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-card rounded-lg border border-accent"
                  >
                    <span className="text-foreground font-medium">
                      {attempt.name}
                    </span>
                    <span className="text-foreground font-bold">
                      {attempt.count} / 15 acertos
                      {/* {attempt.count === 1 ? "tentativa" : "tentativas"} */}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">
                  Nenhuma tentativa registrada ainda!
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-accent">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
