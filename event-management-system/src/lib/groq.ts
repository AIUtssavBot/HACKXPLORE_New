import { Groq } from "@groq/groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const DEFAULT_MODEL = process.env.GROQ_MODEL || "mistral-8x7b-instruct";

export async function generateText(prompt: string): Promise<string> {
  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for an event management system.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating text with Groq:", error);
    throw error;
  }
}

export async function generateSponsorshipEmail(
  eventDetails: any,
  companyName: string
): Promise<string> {
  const prompt = `Generate a professional sponsorship email for the following event:
Event Name: ${eventDetails.title}
Event Date: ${eventDetails.date}
Event Description: ${eventDetails.description}
Target Company: ${companyName}

The email should be formal, highlight the benefits of sponsorship, and include specific sponsorship tiers if applicable.`;

  return generateText(prompt);
}

export async function generateContentRecommendations(
  eventData: any
): Promise<string> {
  const prompt = `Based on the following event data, provide content and marketing recommendations:
Event Type: ${eventData.type}
Target Audience: ${eventData.targetAudience}
Previous Attendance: ${eventData.previousAttendance}
Key Objectives: ${eventData.objectives}

Please provide specific recommendations for:
1. Content strategy
2. Marketing channels
3. Engagement ideas
4. Performance metrics to track`;

  return generateText(prompt);
}

export async function generateEventQuiz(
  eventDetails: any,
  options: {
    numQuestions: number;
    difficulty: "easy" | "medium" | "hard";
  }
): Promise<string> {
  const prompt = `Create a quiz for the following event:
Event Name: ${eventDetails.title}
Event Topic: ${eventDetails.topic}
Number of Questions: ${options.numQuestions}
Difficulty Level: ${options.difficulty}

Generate multiple-choice questions related to the event theme and content.`;

  return generateText(prompt);
}

export async function analyzeFeedback(feedbackData: any[]): Promise<string> {
  const prompt = `Analyze the following event feedback and provide insights:
${JSON.stringify(feedbackData, null, 2)}

Please provide:
1. Overall sentiment analysis
2. Key strengths identified
3. Areas for improvement
4. Actionable recommendations`;

  return generateText(prompt);
} 