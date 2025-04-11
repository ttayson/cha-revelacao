"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";
import { NameSuggestionModal } from "./NameSuggestionModal"; // importa aqui
import { DialogTitle } from "@radix-ui/react-dialog";

export function GenderModal({ onVote }: { onVote?: () => void }) {
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gender, setGender] = useState<"menino" | "menina">();
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const gender = localStorage.getItem("palpite");
    if (!gender) setShowModal(true);
  }, []);

  const handleChoice = async (gender: "menino" | "menina") => {
    try {
      await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender }),
      });
      setGender(gender);
      localStorage.setItem("palpite", gender);
      setShowModal(false);

      // 👉 chama a função de callback, se fornecida
      if (onVote) onVote();

      // 👉 abre o modal de sugestão após votar
      setTimeout(() => setShowSuggestionModal(true), 500);
    } catch (err) {
      console.error("Erro ao enviar palpite:", err);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <Dialog open={showModal}>
        <DialogContent className="text-center">
          <DialogTitle>Qual é o seu palpite?</DialogTitle>
          {/* <h2 className="text-2xl font-bold mb-4">Qual é o seu palpite?</h2> */}
          <div className="flex justify-center gap-6">
            <Button
              className="bg-blue-500 text-white text-lg w-32 h-32 flex flex-col items-center justify-center rounded-full shadow-lg"
              onClick={() => handleChoice("menino")}
            >
              <Baby size={64} className="mb-2" />
              Menino
            </Button>
            <Button
              className="bg-pink-500 text-white text-lg w-32 h-32 flex flex-col items-center justify-center rounded-full shadow-lg"
              onClick={() => handleChoice("menina")}
            >
              <Baby className="w-16 h-16 mb-2" />
              Menina
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showSuggestionModal && (
        <NameSuggestionModal
          gender={gender}
          forceOpen
          onClose={() => setShowSuggestionModal(false)}
        />
      )}
    </>
  );
}
