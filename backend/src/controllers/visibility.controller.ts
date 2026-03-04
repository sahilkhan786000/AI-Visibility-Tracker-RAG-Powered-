import { Request, Response } from "express";
import { generatePrompts } from "../services/prompt.service";
import { queryAI } from "../services/ai.service";
import { analyzeAnswers } from "../services/analysis.service";

import {
  initializeVectorIndex,
  indexResponse,
  hybridSearch
} from "../services/vector.serivce"; // ✅ FIXED spelling

import { generateInsights } from "../services/insight.service"; // ✅ FIXED filename

// Initialize vector index on startup
initializeVectorIndex().catch(console.error);

export async function checkVisibility(req: Request, res: Response) {
  const { category, brands, useRAG = true } = req.body;

  if (!category || !Array.isArray(brands) || !brands.length) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const prompts = generatePrompts(category);

    const answers = await Promise.all(
      prompts.map((p: string) => queryAI(p))
    );

    const analysis = analyzeAnswers(prompts, answers, brands);

    let ragInsights: string | null = null;
    let similarResponses: any[] = [];

    if (useRAG) {
      // Store responses
      await Promise.all(
        answers.map((answer: string, index: number) =>
          indexResponse(answer, prompts[index], category, brands)
        )
      );

      // Retrieve similar
      similarResponses = await hybridSearch(
        `Category: ${category}, Brands: ${brands.join(", ")}`,
        { category },
        5
      );

      // Generate Insights
      ragInsights = await generateInsights(
        analysis,
        similarResponses,
        category,
        brands
      );
    }

    return res.json({
      ...analysis,
      rag: {
        insights: ragInsights,
        similarResponses: similarResponses.map((hit: any) => ({
          response: hit._source?.response,
          score: hit._score,
          metadata: hit._source?.metadata
        }))
      }
    });

  } catch (error) {
    console.error("Error in visibility check:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function searchSimilarResponses(req: Request, res: Response) {
  const { query, category, brands, k = 5 } = req.body;

  try {
    const filters: Record<string, any> = {};

    if (category) filters.category = category;
    if (brands && Array.isArray(brands)) filters.brands = brands;

    const results = await hybridSearch(query, filters, k);

    return res.json({
      results: results.map((hit: any) => ({
        response: hit._source?.response,
        score: hit._score,
        metadata: hit._source?.metadata
      }))
    });

  } catch (error) {
    console.error("Error searching similar responses:", error);
    return res.status(500).json({ error: "Search failed" });
  }
}