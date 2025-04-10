"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type ThermometerProps = {
  guesses: { guess: string }[];
};

const Thermometer: React.FC<ThermometerProps> = ({ guesses }) => {
  const [boyPercent, setBoyPercent] = useState(0);
  const [girlPercent, setGirlPercent] = useState(0);

  useEffect(() => {
    const total = guesses.length;
    const boys = guesses.filter((g) => g.guess === "menino").length;
    const girls = guesses.filter((g) => g.guess === "menina").length;

    setBoyPercent(total > 0 ? (boys / total) * 100 : 0);
    setGirlPercent(total > 0 ? (girls / total) * 100 : 0);
  }, [guesses]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-center text-xl font-bold mb-4">Qual o seu time?</h2>

      <div className="flex items-center justify-center gap-4">
        {/* Imagem Menino à esquerda */}
        <Image src="/menino.png" alt="Menino" width={64} height={64} />

        {/* Termômetro */}
        <div className="flex flex-col flex-grow max-w-md w-full">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-500">
              Menino ({boyPercent.toFixed(0)}%)
            </span>
            <span className="text-pink-500">
              Menina ({girlPercent.toFixed(0)}%)
            </span>
          </div>

          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${boyPercent}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-pink-500 transition-all duration-500"
              style={{ width: `${girlPercent}%` }}
            />
          </div>
        </div>

        {/* Imagem Menina à direita */}
        <Image src="/menina.png" alt="Menina" width={64} height={64} />
      </div>
    </div>
  );
};

export default Thermometer;
