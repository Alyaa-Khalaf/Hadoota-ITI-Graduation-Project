"use client";

import { useState } from "react";

interface Scene {
  id: number;
  image: string;
  text: string;
}

export default function StoryPlayer({
  scenes,
  title,
}: {
  scenes: Scene[];
  title?: string;
}) {
  const [current, setCurrent] = useState(0);

  const scene = scenes[current];

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}

      <div className="bg-white p-5 rounded-xl shadow">
        <img
          src={scene.image}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />

        <p className="text-lg">{scene.text}</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrent((p) => p - 1)}
          disabled={current === 0}
        >
          السابق
        </button>

        <span>
          {current + 1} / {scenes.length}
        </span>

        <button
          onClick={() => setCurrent((p) => p + 1)}
          disabled={current === scenes.length - 1}
        >
          التالي
        </button>
      </div>
    </div>
  );
}