"use server";

import { optimizeRoute } from "@/ai/flows/route-optimization";
import { generateEldLog } from "@/ai/flows/eld-log-generation";
import { RouteSchema, EldLogSchema } from "./schemas";
import { z } from "zod";

export async function optimizeRouteAction(prevState: any, formData: FormData) {
  const validatedFields = RouteSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid input. Please check your entries.",
    };
  }

  try {
    const result = await optimizeRoute(validatedFields.data);
    return { data: result, error: null };
  } catch (error) {
    console.error("Error optimizing route:", error);
    return {
      data: null,
      error: "Failed to optimize route. Please try again.",
    };
  }
}

export async function generateEldLogAction(data: z.infer<typeof EldLogSchema>) {
    const validatedFields = EldLogSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            data: null,
            error: "Invalid input. Please check your entries."
        }
    }

    try {
        const result = await generateEldLog(validatedFields.data);
        return { data: result, error: null };
    } catch (error) {
        console.error("Error generating ELD log:", error);
        return { data: null, error: "Failed to generate ELD log. Please try again." };
    }
}
