import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@prosopopeia/env/server";

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_AI_API_KEY,
});
