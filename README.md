# AI Visibility Tracker (RAG Powered)

An AI-powered analytics platform that analyzes **brand visibility in AI-generated responses** using **Retrieval Augmented Generation (RAG)**, **semantic embeddings**, and **Elasticsearch vector search**.

The system helps track how often brands appear in AI responses and provides insights into **brand positioning, competition trends, and semantic similarity with historical responses.**

---

## Features

### AI Visibility Analysis
Analyze how brands appear in AI-generated answers across multiple prompts.

### RAG-powered insights
Uses **Retrieval Augmented Generation** to provide deeper insights using historical AI responses.

### Semantic Search
Uses **vector embeddings + Elasticsearch dense vectors** to retrieve semantically similar responses.

### Brand Leaderboard
Ranks brands based on mention frequency and prominence.

### Prompt Analysis
Shows how different prompts influence AI responses.

### Historical Sessions
Stores and displays previous analysis sessions with timestamps.

### AI Insights
Generates high-level insights from historical patterns and similar responses.

---

## Tech Stack

**Frontend**
- React
- TypeScript
- TailwindCSS
- Framer Motion

**Backend**
- Node.js
- Express
- TypeScript

**AI & RAG**
- HuggingFace Embeddings
- Retrieval Augmented Generation
- Semantic Vector Search

**Database & Search**
- Elasticsearch (Vector Search)

---

## Architecture Overview

User Query
↓
Generate Prompts
↓
AI Responses
↓
Embedding Generation
↓
Store in Elasticsearch Vector Index
↓
Hybrid Search (Vector + Keyword)
↓
Retrieve Similar Responses
↓
Generate RAG Insights
↓
Display Analytics Dashboard
---


---

## RAG Pipeline

1. User submits category and brands
2. System generates multiple prompts
3. AI generates responses
4. Responses are converted into **vector embeddings**
5. Embeddings are stored in **Elasticsearch**
6. Similar historical responses are retrieved
7. RAG generates insights using historical context

---

## Project Structure

frontend
│
├── components

│ ├── dashboard

│ │ ├── AnalysisInputPanel.tsx

│ │ ├── Leaderboard.tsx

│ │ ├── PromptTable.tsx

│ │ ├── SessionSidebar.tsx

│ │ └── RAGInsights.tsx

│

├── services

│ ├── visibilityApi.ts

│ └── sessionApi.ts

│

└── pages

└── Dashboard.tsx

backend

│

├── controllers

│ └── visibility.controller.ts

│

├── services

│ ├── ai.service.ts

│ ├── analysis.service.ts

│ ├── insight.service.ts

│ └── vector.service.ts

│

└── index.ts

---

## Installation

### 1 Clone repository
git clone https://github.com/sahilkhan786000/AI-Visibility-Tracker-RAG-Powered-
cd ai-visibility-tracker

### 2 Install dependencies

**Backend**
cd frontend
npm install

**Frontend**
cd frontend
npm install

---

## Environment Variables

> Create `.env` file in backend:
> HF_API_KEY=your_huggingface_key
> ELASTICSEARCH_URL=https://your-elastic-url
> ELASTICSEARCH_USERNAME=elastic
> ELASTICSEARCH_PASSWORD=your_password


---

## Running the Project

**Start backend**
> cd backend
> npm run dev
> Backend runs on http://localhost:4000

**Start frontend**
> cd frontend
> npm run dev
> Frontend runs on http://localhost:5173

---

## Example Workflow

1 User enters category and brands
Example:
> Category: CRM software
> Brands: Salesforce, HubSpot, Zoho

2 System generates prompts such as:
> What are the best CRM tools for startups?
> Which CRM platform is best for enterprise?

3 AI generates responses

4 Responses are analyzed for brand mentions

5 Embeddings are stored in Elasticsearch

6 Similar historical responses are retrieved

7 RAG generates insights

---

## Example RAG Insights
-HubSpot visibility has increased in recent responses.
-Salesforce remains dominant in enterprise recommendations.
-Zoho appears mostly in budget-oriented recommendations.
-**Recommendation:**
-Focus on prompts targeting SMB CRM tools to improve visibility.

---

## Future Improvements

-Brand sentiment analysis
-Visualization of brand visibility trends
-Knowledge graph for brand relationships
-Prompt impact scoring
-AI response monitoring over time

