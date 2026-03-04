import { queryAI } from './ai.service';  
  
export async function generateInsights(  
  currentAnalysis: any,  
  similarResponses: any[],  
  category: string,  
  brands: string[]  
): Promise<string> {  
  const context = similarResponses  
    .map((hit, index) => `  
      Historical Response ${index + 1}:  
      Prompt: ${hit._source.metadata.prompt}  
      Answer: ${hit._source.response}  
      Brands Mentioned: ${hit._source.metadata.brands.join(', ')}  
      Similarity Score: ${hit._score}  
    `)  
    .join('\n---\n');  
  
  const prompt = `  
    You are an AI visibility analyst. Based on the current analysis and historical context, provide insights about brand visibility trends.  
  
    Current Analysis:  
    ${JSON.stringify(currentAnalysis, null, 2)}  
  
    Historical Context (Similar Responses):  
    ${context}  
  
    Category: ${category}  
    Target Brands: ${brands.join(', ')}  
  
    Provide insights on:  
    1. Brand visibility trends over time  
    2. Competitive positioning patterns  
    3. Sentiment and context patterns  
    4. Recommendations for improving visibility  
  
    Be concise but thorough. Use markdown formatting.  
  `;  
  
  return await queryAI(prompt);  
}  
  
export async function generateTrendAnalysis(  
  brand: string,  
  timeRange: string = '30d'  
): Promise<string> {  
  const prompt = `  
    Analyze visibility trends for ${brand} over the past ${timeRange}.  
      
    Consider:  
    1. Mention frequency patterns  
    2. Context changes  
    3. Competitive shifts  
    4. Sentiment evolution  
      
    Provide actionable insights for marketing strategy.  
  `;  
  
  return await queryAI(prompt);  
}