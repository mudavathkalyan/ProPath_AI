import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ProPathAI", // Unique app ID
  name: "ProPathAI",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
