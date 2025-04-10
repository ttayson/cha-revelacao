"use client";

import React, { useEffect, useRef } from "react";

interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: Word[];
}

export const SimpleWordCloud: React.FC<WordCloudProps> = ({ words }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !words.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const placedWords: { x: number; y: number; w: number; h: number }[] = [];

    const max = Math.max(...words.map((w) => w.value));
    const min = Math.min(...words.map((w) => w.value));

    // Ajusta o range do tamanho com base na largura do canvas
    const canvasFactor = Math.min(width, height) / 300;

    const getFontSize = (value: number) => {
      const minSize = 24 * canvasFactor;
      const maxSize = 72 * canvasFactor;
      if (max === min) return (maxSize + minSize) / 2;
      return minSize + ((value - min) / (max - min)) * (maxSize - minSize);
    };

    const getRandomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    const isOverlapping = (x: number, y: number, w: number, h: number) => {
      return placedWords.some((word) => {
        return !(
          x + w < word.x ||
          x > word.x + word.w ||
          y + h < word.y ||
          y > word.y + word.h
        );
      });
    };

    const sorted = [...words].sort((a, b) => b.value - a.value);

    const angles = Array.from({ length: 360 }, (_, i) => (i * Math.PI) / 180);
    const radii = Array.from({ length: 100 }, (_, i) => i * 4);

    const shuffle = <T,>(array: T[]): T[] =>
      array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    const randomAngles = shuffle(angles);
    const randomRadii = shuffle(radii);

    const a = width / 2.1;
    const b = height / 2.4;

    const toOvalCoords = (
      angle: number,
      r: number,
      textWidth: number,
      textHeight: number
    ) => {
      const safeA = a - textWidth / 2;
      const safeB = b - textHeight / 2;
      return [
        centerX + safeA * Math.cos(angle) * (r / a),
        centerY + safeB * Math.sin(angle) * (r / b),
      ];
    };

    for (const word of sorted) {
      const fontSize = getFontSize(word.value);
      ctx.font = `${fontSize}px Arial`;
      const textWidth = ctx.measureText(word.text).width;
      const textHeight = fontSize;

      let placed = false;
      for (const r of randomRadii) {
        for (const angle of randomAngles) {
          const [x, y] = toOvalCoords(angle, r, textWidth, textHeight);
          const drawX = x - textWidth / 2;
          const drawY = y - textHeight / 2;

          if (!isOverlapping(drawX, drawY, textWidth, textHeight)) {
            ctx.fillStyle = getRandomColor();
            ctx.fillText(word.text, drawX, drawY + fontSize / 2.5);
            placedWords.push({
              x: drawX,
              y: drawY,
              w: textWidth,
              h: textHeight,
            });
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }
  }, [words]);

  return (
    <div className="flex justify-center items-center p-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{
          borderRadius: "50%",
          backgroundColor: "#f8f9fa",
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};
