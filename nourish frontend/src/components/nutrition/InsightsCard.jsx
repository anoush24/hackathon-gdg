import { useState } from 'react';
import axios from 'axios';
import { authService } from '../../authBridge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';

const InsightsCard = () => {
  const [insight, setInsight] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateInsight = async () => {
    setIsLoading(true);
    setError(null);
    setInsight(null);
    try {
      const token = authService.getRawToken ? authService.getRawToken() : authService.getValidToken(); 
      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await axios.post(
        'http://localhost:5000/api/meal-plans/insights', 
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setInsight(response.data.insight);
      } else {
        setError(response.data.message || 'Failed to get an insight.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'The AI service is currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-warm border-0 bg-gradient-subtle mt-8">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Sparkles className="mr-2 h-5 w-5" />
          Your Weekly Insight
        </CardTitle>
        <CardDescription>
          Get a personalized look at your eating habits from the past week.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {isLoading ? (
          <div>
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-3 text-warm italic">Our AI chef is analyzing your week...</p>
          </div>
        ) : error ? (
          <div className="text-red-600">
            <p>Oops! {error}</p>
            <Button onClick={handleGenerateInsight} className="mt-4">Try Again</Button>
          </div>
        ) : insight ? (
          <div className="text-left space-y-4 text-warm">
            <h3 className="font-bold text-lg text-primary">{insight.title}</h3>
            <p className="border-l-4 border-green-400 pl-4 bg-green-50/50 py-2">
              {insight.positive_feedback}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <p className="flex items-start">
                 <Lightbulb className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                 <span><span className="font-bold">Recommendation:</span> {insight.actionable_recommendation}</span>
               </p>
            </div>
             <Button onClick={handleGenerateInsight} variant="outline" className="mt-4">
                Generate New Insight
             </Button>
          </div>
        ) : (
          <Button 
            onClick={handleGenerateInsight} 
            disabled={isLoading}
            className="bg-gradient-primary text-primary-foreground shadow-warm hover:shadow-glow"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate My Insight
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsCard;