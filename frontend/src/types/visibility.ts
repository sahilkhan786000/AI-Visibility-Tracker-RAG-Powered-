export interface AnswerItem {  
  prompt: string;  
  answer: string;  
  mentions: string[];  
}  
  
export interface LeaderboardItem {  
  brand: string;  
  mentions: number;  
}  
  
export interface SimilarResponse {  
  response: string;  
  score: number;  
  metadata: {  
    category: string;  
    brands: string[];  
    timestamp: string;  
    prompt: string;  
  };  
}  
  
export interface RAGData {  
  insights: string | null;  
  similarResponses: SimilarResponse[];  
}  
  
export interface VisibilityResponse {  
  summary: {  
    totalPrompts: number;  
    visibilityScore: Record<string, number>;  
  };  
  leaderboard: LeaderboardItem[];  
  answers: AnswerItem[];  
  rag?: RAGData;  
}