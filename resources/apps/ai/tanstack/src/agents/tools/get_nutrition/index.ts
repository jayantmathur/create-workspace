import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const definition = toolDefinition({
  name: "get_nutrition",
  description: "Get the nutrition data for a food",
  inputSchema: z.object({
    food: z
      .string()
      .describe(
        "The food, e.g. Apple. Serve the input as a lowercase query with whitespaces filled by plus signs.",
      ),
  }),
  outputSchema: z.array(
    z.object({
      // name: z.string(),
      // calories:"Only available for premium subscribers.",
      serving_size_g: z.number().describe("Serving size in grams"),
      fat_total_g: z.number().describe("Total fat in grams"),
      fat_saturated_g: z.number().describe("Saturated fat in grams"),
      fat_trans_g: z.number().describe("Trans fat in grams"),
      // protein_g:"Only available for premium subscribers.",
      sodium_mg: z.number().describe("Sodium in milligrams"),
      potassium_mg: z.number().describe("Potassium in milligrams"),
      cholesterol_mg: z.number().describe("Cholesterol in milligrams"),
      carbohydrates_total_g: z
        .number()
        .describe("Total carbohydrates in grams"),
      fiber_g: z.number().describe("Fiber in grams"),
      sugar_g: z.number().describe("Sugar in grams"),
    }),
  ),
  // needsApproval: true,
});

// Create server implementation
export const get_nutrition = definition.server(async ({ food }) => {
  const apiKey = process.env.APININJAS_API_KEY;
  if (!apiKey) throw new Error("API key is not configured");

  const url = `https://api.api-ninjas.com/v1/nutrition?query=${food}`;
  const response = await fetch(url, { headers: { "X-Api-Key": apiKey } });
  const results = await response.json();

  return results;
});
