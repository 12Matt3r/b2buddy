import { Handler } from "@netlify/functions";

interface Interaction {
  type: string;
  target: string;
  value: any;
  timestamp?: number;
}

interface AIPersonality {
  riskTolerance: number;
  energyManagement: number;
  genreExploration: number;
  crowdAdaptation: number;
  learningVelocity: number;
}

const validateInteraction = (data: any): data is Interaction => {
  if (!data || typeof data !== "object") return false;
  if (typeof data.type !== "string") return false;
  if (typeof data.target !== "string") return false;
  // value can be anything, timestamp is optional but should be number if present
  if (data.timestamp && typeof data.timestamp !== "number") return false;
  return true;
};

const validatePersonality = (data: any): data is AIPersonality => {
  if (!data || typeof data !== "object") return false;
  const props = [
    "riskTolerance",
    "energyManagement",
    "genreExploration",
    "crowdAdaptation",
    "learningVelocity",
  ];
  return props.every((p) => typeof data[p] === "number");
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { interaction, aiPersonality } = body;

    if (!validateInteraction(interaction)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid interaction data" }),
      };
    }

    if (!validatePersonality(aiPersonality)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid or missing AI Personality data",
        }),
      };
    }

    // Logic to update personality based on interaction
    // This mirrors the frontend mock logic but would run server-side
    // persisting to a real database (e.g., FaunaDB, MongoDB)

    const evolvedPersonality = { ...aiPersonality };

    if (interaction.type === "fader" && interaction.target === "crossfader") {
      evolvedPersonality.energyManagement = Math.min(
        100,
        evolvedPersonality.energyManagement + 0.5,
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        evolvedPersonality,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process interaction" }),
    };
  }
};
