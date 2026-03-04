import { useTheme } from "../../context/ThemeContext";  
import { themes } from "../../styles/themes";  
import { type SimilarResponse } from "../../types/visibility";  
  
interface RAGInsightsProps {  
  insights: string | null;  
  similarResponses: SimilarResponse[];  
}  
  
export default function RAGInsights({ insights, similarResponses }: RAGInsightsProps) {  
  const { theme } = useTheme();  
  
  if (!insights && similarResponses.length === 0) return null;  
  
  return (  
    <div className={`mt-4 p-4 rounded-lg ${themes[theme].card}`}>  
      {insights && (  
        <div className="mb-4">  
          <h3 className={`font-semibold mb-2 ${themes[theme].text}`}>  
            🤖 AI-Generated Insights  
          </h3>  
          <div   
            className={`text-sm ${themes[theme].text} prose prose-sm max-w-none`}  
            dangerouslySetInnerHTML={{ __html: insights }}  
          />  
        </div>  
      )}  
  
      {similarResponses.length > 0 && (  
        <div>  
          <h3 className={`font-semibold mb-2 ${themes[theme].text}`}>  
            🔍 Similar Historical Responses  
          </h3>  
          <div className="space-y-2">  
            {similarResponses.map((resp, index) => (  
              <div   
                key={index}  
                className={`p-3 rounded ${themes[theme].card} border ${themes[theme].text} opacity-20`}  
              >  
                <div className="flex justify-between items-start mb-1">  
                  <span className="text-xs opacity-70">  
                    {new Date(resp.metadata.timestamp).toLocaleDateString()}  
                  </span>  
                  <span className="text-xs opacity-70">  
                    Score: {resp.score.toFixed(3)}  
                  </span>  
                </div>  
                <p className="text-sm">{resp.response}</p>  
                <div className="mt-1 text-xs opacity-70">  
                  Brands: {resp.metadata.brands.join(', ')}  
                </div>  
              </div>  
            ))}  
          </div>  
        </div>  
      )}  
    </div>  
  );  
}