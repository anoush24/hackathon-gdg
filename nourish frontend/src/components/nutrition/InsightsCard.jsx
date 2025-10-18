import { useState } from 'react';
import axios from 'axios';
import { authService } from '../../authBridge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, Loader2, Sparkles, Brain, Target, TrendingUp } from 'lucide-react';
import HeroBackground from '../../assets/herobgveg5.png';

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
    <div className="mb-12">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-emerald-200 relative overflow-hidden">
        
        {/* Background Pattern - Same as other sections */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: `url(${HeroBackground})`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-3 bg-green-600  rounded-xl shadow-md">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">AI Nutrition Insights</h2>
            <p className="text-gray-600">Get personalized analysis of your eating habits</p>
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-0 shadow-xl relative z-10 bg-white/90 backdrop-blur-sm overflow-hidden">
          
          {/* Loading State */}
          {isLoading && (
            <div className="p-12 text-center">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-emerald-500 mb-6" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Chef is Analyzing...</h3>
              <p className="text-gray-600 italic">Discovering patterns in your nutrition journey</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button 
                onClick={handleGenerateInsight} 
                className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Insight Display */}
          {insight && !isLoading && (
            <div className="p-8">
              {/* Insight Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">{insight.title}</h3>
              </div>

              <div className="space-y-6">
                {/* Positive Feedback */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">What's Going Great!</h4>
                      <p className="text-green-700 leading-relaxed">{insight.positive_feedback}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-800 mb-2">Smart Recommendation</h4>
                      <p className="text-blue-700 leading-relaxed">{insight.actionable_recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center pt-4">
                  <Button 
                    onClick={handleGenerateInsight} 
                    variant="outline"
                    className="border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Fresh Insight
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!insight && !isLoading && !error && (
            <div className="p-12 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready for Your AI Nutrition Analysis?
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Our AI chef will analyze your recent meals and provide personalized insights to help you achieve your nutrition goals.
              </p>
              
              <Button 
                onClick={handleGenerateInsight} 
                disabled={isLoading}
                className="bg-green-600 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Generate My AI Insight
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InsightsCard;