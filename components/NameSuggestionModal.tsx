import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NameSuggestionModalProps = {
  gender: "menino" | "menina" | undefined;
  forceOpen?: boolean;
  onClose?: () => void;
};

export function NameSuggestionModal({
  gender,
  forceOpen,
  onClose,
}: NameSuggestionModalProps) {
  const [open, setOpen] = useState(forceOpen ?? false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  const handleSubmit = async () => {
    if (!name) return;

    try {
      const res = await fetch("/api/suggestname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gender }),
      });

      if (res.ok) {
        toast({
          title: "Nome enviado com sucesso!",
          description: "Obrigado pela sua sugestão. 💖",
        });
        setOpen(false);
        if (onClose) onClose();
      } else {
        toast({
          title: "Erro ao enviar sugestão",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
      toast({
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-center">
        <DialogTitle className="sr-only">Sugestão de Nome</DialogTitle>
        <Sparkles className="mx-auto mb-2 text-yellow-500 w-10 h-10" />
        <h2 className="text-xl font-bold mb-2">
          Você tem uma sugestão de nome?
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          ✨ Que momento especial! Agora que você já deu seu palpite, que tal
          ajudar os papais com uma sugestão de nome? <br />
          Escolha um nome lindo para{" "}
          {gender === "menino" ? "um príncipe 💙" : "uma princesa 💖"}!
        </p>
        <Input
          type="text"
          placeholder={`Nome para ${gender}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Enviar sugestão
        </Button>
      </DialogContent>
    </Dialog>
  );
}
