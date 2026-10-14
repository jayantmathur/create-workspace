import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const definition = toolDefinition({
  name: "get_weather",
  description: "Get the current weather for a location",
  inputSchema: z.object({
    location: z.string().meta({ description: "The city, e.g. Tokyo" }),
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    location: z.string(),
  }),
});

// Create server implementation
export const getWeather = definition.server(async ({ location, unit }) => {
  const response = await fetch(
    `https://worldtimeweather.com/api/v1/city/${location.toLowerCase()}.json`,
  );
  const results = await response.json();

  const { weather } = results;
  const { temperature_c, temperature_f } = weather;

  switch (unit || "fahrenheit") {
    case "fahrenheit":
      return temperature_f;
    case "celsius":
    default:
      return temperature_c;
  }
});
