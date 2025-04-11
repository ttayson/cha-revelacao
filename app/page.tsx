"use client";

import React, { useEffect } from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Baby, Heart } from "lucide-react";
import { GenderModal } from "@/components/GenderModal";
import Thermometer from "@/components/Thermometer";

export default function Home() {
  const [name, setName] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [isUpdated, setIsupdated] = useState(false);
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);

  const router = useRouter();

  const refreshGuesses = async () => {
    setIsupdated(!isUpdated);
  };

  useEffect(() => {
    async function fetchguesses() {
      try {
        const response = await fetch("/api/guess");
        if (response.ok) {
          const data = await response.json();
          setGuesses(data);
        } else {
          throw new Error("fallback");
        }
      } catch (error) {}
    }

    fetchguesses();
  }, [isUpdated]);

  useEffect(() => {
    fetch("/api/wordcloud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // pode incluir filtros aqui se quiser
    })
      .then((res) => res.json())
      .then(setWords)
      .catch((err) => console.error("Erro ao buscar nuvem:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // localStorage.setItem("currentUser", name)

      // Create user in database
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        const data = await response.json();
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error creating user:", error);
      }

      router.push("/questions");
    }
  };
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <GenderModal onVote={refreshGuesses} />

      <div className="max-w-4xl w-full">
        <Card className="border-2 border-accent bg-card rounded-2xl shadow-md">
          <CardHeader className="bg-primary rounded-t-xl">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Baby className="h-8 w-8 text-foreground" />
              <CardTitle className="text-center text-4xl font-bold text-foreground">
                Casal T&T Chá Revelação
              </CardTitle>
            </div>

            <CardDescription className="text-center text-xl text-muted-foreground mt-2">
              Junte-se a nós neste momento especial onde amigos e família se
              unem para celebrar a chegada do nosso bebê. Cada palpite, cada
              sorriso e cada momento compartilhado tece os laços que nos
              conectam nesta jornada de amor.
            </CardDescription>
            {/* <Separator className="border-[0.8px] border-black" /> */}
            <Thermometer guesses={guesses} />
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xl font-medium text-foreground"
                  >
                    Qual é o seu nome?
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-accent rounded-xl text-lg h-12"
                    placeholder="Digite seu nome aqui"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-lg h-12 border border-accent"
                >
                  Começar!
                </Button>
              </form>

              <Carousel className="w-full">
                <CarouselContent>
                  {/* Slide 1: Sobre o Chá Revelação */}
                  <CarouselItem>
                    <div className="bg-card p-6 rounded-xl border border-accent">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Sobre o Chá Revelação
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Este é um momento único onde celebramos a vida e o amor.
                        Responda corretamente às perguntas sobre o casal T&T e
                        descubra se o novo membro da família será um menino ou
                        uma menina. Cada resposta certa nos aproxima do grande
                        momento da revelação!
                      </p>
                    </div>
                  </CarouselItem>

                  {/* Slide 2: WordCloud */}
                  <CarouselItem>
                    <div className="bg-card p-6 rounded-xl border border-accent">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Nomes mais apostados!
                      </h3>
                      {words.length > 0 ? (
                        <div className="overflow-auto max-h-64">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4 border-b text-foreground text-sm">
                                  #
                                </th>
                                <th className="py-2 px-4 border-b text-foreground text-sm">
                                  Nome
                                </th>
                                <th className="py-2 px-4 border-b text-foreground text-sm">
                                  Votos
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {words?.map((word, index) => (
                                <tr key={index}>
                                  <td className="py-2 px-4 border-b text-muted-foreground text-sm">
                                    {index + 1}
                                  </td>
                                  <td className="py-2 px-4 border-b text-foreground font-medium text-sm">
                                    {word?.text?.toUpperCase() || "-"}
                                  </td>
                                  <td className="py-2 px-4 border-b text-muted-foreground text-sm">
                                    {word?.value || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Nenhum nome registrado ainda!
                        </p>
                      )}
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center gap-5 mt-6 relative z-10">
                  <CarouselPrevious className="static w-auto" />
                  <CarouselNext className="static w-auto" />
                </div>
              </Carousel>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent-foreground" />
                Quem ja acertou?
              </h3>
              <div className="ranking-scroll space-y-2 pr-2">
                <RankingList />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-6">
            <Link href="/attempts">
              <Button
                variant="outline"
                className="border border-accent text-foreground hover:bg-accent/20"
              >
                Ver Tentativas
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function RankingList() {
  const [ranking, setRanking] = useState<
    Array<{ name: string; ticketNumber: string }>
  >([]);

  // Fetch ranking data from API
  // React.useEffect(() => {
  //   async function fetchRanking() {
  //     try {
  //       const response = await fetch("/api/ranking");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setRanking(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching ranking:", error);

  //       // Fallback to localStorage if API fails
  //       const storedRanking = JSON.parse(
  //         localStorage.getItem("ranking") || "[]"
  //       );
  //       setRanking(storedRanking);
  //     }
  //   }

  //   fetchRanking();
  // }, []);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const response = await fetch("/api/ranking");
        if (response.ok) {
          const data = await response.json();
          setRanking(data);
        } else {
          throw new Error("fallback");
        }
      } catch (error) {
        if (typeof window !== "undefined") {
          const storedRanking = JSON.parse(
            localStorage.getItem("ranking") || "[]"
          );
          setRanking(storedRanking);
        }
      }
    }

    fetchRanking();
  }, []);

  if (ranking.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">
          Nenhum vencedor registrado ainda!
        </p>
      </div>
    );
  }

  return (
    <>
      {ranking.map((person, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 bg-card rounded-lg border border-accent"
        >
          <div className="flex items-center">
            <span className="text-foreground font-bold mr-2">{index + 1}.</span>
            <span className="text-foreground">{person.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            #{person.ticketNumber}
          </span>
        </div>
      ))}
    </>
  );
}
