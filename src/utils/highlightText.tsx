
import React from "react";

const KEYWORDS = [
  "ReactJS",
  "NextJS",
  "TypeScript",
  "TailwindCSS",
  "Material UI",
  "NodeJS",
  "ExpressJS",
  "PostgreSQL",
  "RESTful APIs",
  "JWT-based authentication",
  "RBAC",
  "Redux",
  "LangChain",
  "OpenRouter",
  "AI models",
  "Full Stack Developer",
  "Frontend Developer",
  "3.6 years",
];

export const highlightText = (text: string): React.ReactNode => {
  if (!text) return text;

  const escapedKeywords = KEYWORDS
    .sort((a, b) => b.length - a.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");

  return text.split(regex).map((part, index) => {
    const isKeyword = KEYWORDS.some(
      (keyword) => keyword.toLowerCase() === part.toLowerCase()
    );

    return isKeyword ? (
      <span
        key={index}
        className="rounded bg-indigo-100 px-1 py-0.5 font-semibold text-indigo-700"
      >
        {part}
      </span>
    ) : (
      part
    );
  });
};
