import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { propertyType, bedrooms, bathrooms, squareFootage, address, features, tone } = await req.json()

  // Get API keys from environment variables
  const openaiKey = process.env.OPENAI_API_KEY
  const openrouterKey = process.env.OPENROUTER_API_KEY

  // Determine which API to use and configure accordingly
  let model: string
  let apiKey: string | undefined
  let baseURL: string | undefined

  if (openrouterKey) {
    // Use OpenRouter
    model = "openai/gpt-4o-mini" // OpenRouter model format
    apiKey = openrouterKey
    baseURL = "https://openrouter.ai/api/v1"
  } else if (openaiKey) {
    // Use OpenAI directly
    model = "gpt-4o-mini"
    apiKey = openaiKey
    baseURL = undefined // Use default OpenAI endpoint
  } else {
    // Fallback to Vercel AI Gateway (default)
    model = "openai/gpt-4o-mini"
    apiKey = undefined
    baseURL = undefined
  }

  const toneDescriptions: Record<string, string> = {
    modern: "modern, sleek, and contemporary with emphasis on clean lines and updated features",
    cozy: "warm, inviting, and charming with emphasis on comfort and homey atmosphere",
    luxury: "luxurious, elegant, and sophisticated with emphasis on high-end finishes and exclusivity",
    family: "family-friendly, practical, and welcoming with emphasis on space and community",
    "move-in": "move-in ready, well-maintained, and turnkey with emphasis on convenience and condition",
  }

  const prompt = `You are a professional real estate copywriter. Write a compelling property description for the following property:

Property Type: ${propertyType}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Square Footage: ${squareFootage} sq ft
Address: ${address}

Key Features:
${features}

Writing Style: ${toneDescriptions[tone] || "professional and engaging"}

Create a compelling, detailed property description that:
1. Opens with an attention-grabbing introduction
2. Highlights the key features in an engaging way
3. Describes the property's best attributes
4. Mentions the location and neighborhood appeal
5. Ends with a call to action
6. Uses vivid, descriptive language that helps buyers visualize living there
7. Is approximately 150-250 words

Write the description now:`

  try {
    const result = await generateText({
      model,
      prompt,
      maxOutputTokens: 1000,
      temperature: 0.8,
      ...(apiKey && { apiKey }),
      ...(baseURL && { baseURL }),
    })

    return Response.json({ description: result.text })
  } catch (error) {
    console.error("Error generating description:", error)
    return Response.json({ error: "Failed to generate description" }, { status: 500 })
  }
}
