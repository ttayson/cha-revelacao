"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Stars, Heart, Gift, Cake, Sparkles, Baby } from "lucide-react";

// Mock questions
const questions = [
  {
    id: 1,
    question: "Quando o papai e a mamãe se conheceram?",
    options: ["2015", "2010", "2020", "2005"],
    answer: "2010",
  },
  {
    id: 2,
    question: "Qual é a cor dos olhos da mamãe e papai?",
    options: ["Azuis", "Castanhos", "Verdes", "Pretos"],
    answer: "Castanhos",
  },
  {
    id: 3,
    question: "Qual o nome das minhas gatas?",
    options: ["Lady & Nega", "Luna & Mel", "Mimi & Nega", "Amora & Nina"],
    answer: "Lady & Nega",
  },
  {
    id: 4,
    question: "Qual é o mês de aniversário da mamãe?",
    options: ["Julho", "Janeiro", "Outubro", "Dezembro"],
    answer: "Outubro",
  },
  {
    id: 5,
    question: "Qual é o mês do aniversário do papai?",
    options: ["Novembro", "Setembro", "Março", "Agosto"],
    answer: "Setembro",
  },
  {
    id: 6,
    question: "Em que ano meus pais se casaram?",
    options: ["2022", "2015", "2020", "2018"],
    answer: "2020",
  },
  {
    id: 7,
    question: "Em que mês provavelmente vou nascer?",
    options: ["Setembro", "Outubro", "Novembro", "Agosto"],
    answer: "Setembro",
  },
  {
    id: 8,
    question: "Qual é a idade do papai?",
    options: ["35", "37", "34", "36"],
    answer: "36",
  },
  {
    id: 9,
    question: "Qual é a idade da mamãe?",
    options: ["31", "33", "32", "30"],
    answer: "32",
  },
  {
    id: 10,
    question: "Qual é o nome da minha cachorrinha?",
    options: ["Mel", "Amora", "Luna", "Bela"],
    answer: "Amora",
  },
];

const icons = [
  <Stars key="stars" className="w-8 h-8 text-accent" />,
  <Heart key="heart" className="w-8 h-8 text-accent" />,
  <Gift key="gift" className="w-8 h-8 text-primary" />,
  <Cake key="cake" className="w-8 h-8 text-primary" />,
  <Sparkles key="sparkles" className="w-8 h-8 text-secondary" />,
];

export default function QuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const userData = JSON.parse(data);
      setUserName(userData.name);
      setUserId(userData.id);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    // Save attempt in API
    try {
      await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          id: userId,
          questionId: questions[currentQuestion].id,
          answer: selectedAnswer,
          isCorrect: selectedAnswer === questions[currentQuestion].answer,
        }),
      });
    } catch (error) {
      console.error("Error saving attempt:", error);

      // Fallback to localStorage if API fails
      const attempts = JSON.parse(localStorage.getItem("attempts") || "[]");
      const userAttempt = attempts.find((a: any) => a.name === userName);

      if (userAttempt) {
        userAttempt.count += 1;
      } else {
        attempts.push({ name: userName, count: 1 });
      }

      localStorage.setItem("attempts", JSON.stringify(attempts));
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setCorrectAnswers(0);
    setShowResult(false);
  };

  const handleReveal = () => {
    // If all answers are correct, go to reveal page
    if (correctAnswers === questions.length) {
      router.push("/reveal");
    }
  };

  const randomIcon = () => {
    return icons[Math.floor(Math.random() * icons.length)];
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <Card className="border-2 border-accent bg-card rounded-2xl shadow-md max-w-2xl w-full">
          <CardHeader className="bg-primary rounded-t-xl">
            <div className="flex items-center justify-center gap-3">
              <Baby className="h-6 w-6 text-foreground" />
              <CardTitle className="text-center text-3xl font-bold text-foreground">
                Resultado
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">{randomIcon()}</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {userName}, você acertou:
            </h3>
            <p className="text-4xl font-bold text-accent-foreground mb-4">
              {correctAnswers} de {questions.length}
            </p>

            {correctAnswers === questions.length ? (
              <div className="space-y-4">
                <p className="text-green-600 text-xl">
                  Parabéns! Você acertou todas as perguntas!
                </p>
                <Button
                  onClick={handleReveal}
                  className="bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-lg h-12 w-full border border-accent"
                >
                  Ver Revelação!
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-orange-600 text-xl">
                  Tente novamente para descobrir o segredo!
                </p>
                <Button
                  onClick={handleRestart}
                  className="bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-lg h-12 w-full border border-accent"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border border-accent text-foreground hover:bg-accent/20"
            >
              Voltar ao Início
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-accent bg-card rounded-2xl shadow-md">
          <CardHeader className="bg-primary rounded-t-xl">
            <div className="flex items-center justify-center gap-3">
              <Baby className="h-6 w-6 text-foreground" />
              <CardTitle className="text-center text-2xl font-bold text-foreground">
                Pergunta {currentQuestion + 1} de {questions.length}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="h-3 bg-muted"
              />
            </div>

            <div className="flex justify-center mb-4">{randomIcon()}</div>

            <h3 className="text-xl font-bold text-foreground mb-4">
              {questions[currentQuestion].question}
            </h3>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    selectedAnswer === option
                      ? "border-accent bg-accent/10"
                      : "border-muted"
                  }`}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="flex-1 cursor-pointer text-lg"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-lg h-12 border border-accent"
            >
              {currentQuestion < questions.length - 1
                ? "Próxima Pergunta"
                : "Ver Resultado"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
