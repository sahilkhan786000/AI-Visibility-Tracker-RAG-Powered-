import { Client as ESClient, estypes } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

/* ===============================
   Elasticsearch Client
================================ */
const esClient = new ESClient({
  node: process.env.ELASTICSEARCH_URL!,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
});

const INDEX_NAME = "ai-responses";

/* ===============================
   Initialize Vector Index
================================ */
export async function initializeVectorIndex() {
  try {
    const exists = await esClient.indices.exists({ index: INDEX_NAME });

    if (!exists) {
      await esClient.indices.create({
        index: INDEX_NAME,
        mappings: {
          properties: {
            response: { type: "text" },

            embedding: {
              type: "dense_vector",
              dims: 384,
              index: true,
              similarity: "cosine",
            },

            metadata: {
              properties: {
                category: { type: "keyword" },
                brands: { type: "keyword" },
                timestamp: { type: "date" },
                prompt: { type: "text" },
              },
            },
          },
        },
      });

      console.log("✅ Vector index created");
    }
  } catch (error) {
    console.error("❌ Index initialization error:", error);
  }
}

/* ===============================
   Generate Embedding (HF Router)
================================ */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HF Router error: ${response.status} - ${err}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid embedding response format");
    }

    return data;

  } catch (error) {
    console.error("❌ Embedding error:", error);
    throw error;
  }
}

/* ===============================
   Store Response with Embedding
================================ */
export async function indexResponse(
  response: string,
  prompt: string,
  category: string,
  brands: string[]
) {
  const embedding = await generateEmbedding(response);

  await esClient.index({
    index: INDEX_NAME,
    document: {
      response,
      embedding,
      metadata: {
        category,
        brands,
        timestamp: new Date().toISOString(),
        prompt,
      },
    },
  });
}

/* ===============================
   Pure Vector Search
================================ */
export async function findSimilarResponses(query: string, k: number = 5) {
  const qEmbedding = await generateEmbedding(query);

  const result = await esClient.search({
    index: INDEX_NAME,
    knn: {
      field: "embedding",
      query_vector: qEmbedding,
      k,
      num_candidates: 100,
    },
  });

  return result.hits.hits;
}

/* ===============================
   Hybrid Search
================================ */
export async function hybridSearch(
  query: string,
  filters: Record<string, string> = {},
  k: number = 5
) {
  const qEmbedding = await generateEmbedding(query);

  const filterQueries: estypes.QueryDslQueryContainer[] = Object.entries(filters).map(
    ([key, value]) => ({
      term: {
        [`metadata.${key}`]: {
          value,
        },
      },
    })
  );

  const result = await esClient.search({
    index: INDEX_NAME,

    query: {
      bool: {
        must: [
          {
            match: {
              response: {
                query,
                boost: 0.3,
              },
            },
          },
        ],
        filter: filterQueries,
      },
    },

    knn: {
      field: "embedding",
      query_vector: qEmbedding,
      k,
      boost: 0.7,
      num_candidates: 100,
    },
  });

  return result.hits.hits;
}