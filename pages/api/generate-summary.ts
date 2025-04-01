import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Prepare context for summary generation
    const context = messages
      .filter(msg => msg.content && msg.user?.name)
      .map(msg => `${msg.user.name}: ${msg.content}`)
      .join('\n');

    if (!context) {
      return res.status(400).json({ error: 'No valid messages to summarize' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create the prompt
    const prompt = `Please analyze this conversation and provide:

1. A concise summary of the key discussion points
2. Important decisions made
3. Action items and next steps
4. Any risks or concerns raised

Format the response in clear sections with bullet points. Focus on actionable insights and critical information.

Conversation:
${context}`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('AI Summary Generation Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}