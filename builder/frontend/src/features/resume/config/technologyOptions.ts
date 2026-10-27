/*
 * Technology suggestions for the Project "Technologies" field.
 * Starts from the skill suggestions the editor already has, then adds the
 * things projects are built with that are not "skills" (APIs, libraries...).
 */

import { ALL_TECHNOLOGY_SUGGESTIONS } from "../editor/utils/skillSuggestions";
import { searchOptions, type Option } from "./searchOptions";

const EXTRA: Option[] = [
  { name: "HTML", aliases: ["html5"] },
  { name: "CSS", aliases: ["css3"] },
  { name: "Node.js", aliases: ["nodejs", "node"] },
  { name: "Redux Toolkit", aliases: ["redux"] },
  { name: "Tailwind CSS", aliases: ["tailwind"] },
  { name: "Bootstrap" },
  { name: "Material UI", aliases: ["mui"] },
  { name: "Vite" },
  { name: "Socket.io", aliases: ["websocket", "websockets", "socketio"] },
  { name: "REST API", aliases: ["rest", "restful"] },
  { name: "GraphQL" },
  { name: "JWT", aliases: ["json web token", "authentication"] },
  { name: "Mongoose" },
  { name: "Prisma" },
  { name: "Cloudinary" },
  { name: "Stripe", aliases: ["payments"] },
  { name: "Razorpay", aliases: ["payments"] },
  { name: "Jest", aliases: ["testing"] },
  { name: "Cypress", aliases: ["testing"] },
  { name: "Vercel" },
  { name: "Render" },
  { name: "Nginx" },
  { name: "TensorFlow", aliases: ["tf"] },
  { name: "PyTorch" },
  { name: "scikit-learn", aliases: ["sklearn"] },
  { name: "Pandas" },
  { name: "NumPy" },
  { name: "OpenAI API", aliases: ["gpt", "chatgpt"] },
  { name: "LangChain", aliases: ["langchainjs"] },
  { name: "React Native", aliases: ["expo"] },
  { name: "Flutter", aliases: ["dart"] },
  { name: "Zustand" },
  { name: "React Query", aliases: ["tanstack query"] },
  { name: "Zod" },
];

const TECHNOLOGIES: Option[] = [
  ...ALL_TECHNOLOGY_SUGGESTIONS.map((name) => ({ name })),
  ...EXTRA,
].filter(
  // The skill list and EXTRA overlap ("Node.js", "Tailwind CSS"): keep the first.
  (option, index, all) =>
    all.findIndex((o) => o.name.toLowerCase() === option.name.toLowerCase()) ===
    index,
);

/** `exclude` hides technologies that are already added as tags. */
export const searchTechnologies = (
  input: string,
  exclude: string[] = [],
  limit = 6,
) => searchOptions(TECHNOLOGIES, input, limit, exclude);
