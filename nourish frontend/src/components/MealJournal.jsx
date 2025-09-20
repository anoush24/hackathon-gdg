import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  LogOut,
  Calendar,
  Plus,
  Edit,
  Camera,
  Clock,
  Star,
  Utensils,
  TrendingUp,
  Heart,
  BookOpen,
  Sparkles,
  Trash2,
  RefreshCw,
  DollarSign
} from 'lucide-react';

const MealJournal = ({ user, onLogout, onBackToMealPlan }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealEntries, setMealEntries] = useState([
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast',
      name: 'Avocado Toast with Eggs',
      calories: 420,
      rating: 5,
      notes: 'Perfect start to the day! Loved the creamy avocado.',
      image: null,
      time: '08:30'
    },
    {
      id: 2,
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch',
      name: 'Mediterranean Quinoa Bowl',
      calories: 380,
      rating: 4,
      notes: 'Fresh and filling. Maybe add more protein next time.',
      image: null,
      time: '12:45'
    }
  ]);

  // Weekly Planner State
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: { breakfast: null, lunch: null, dinner: null },
    tuesday: { breakfast: null, lunch: null, dinner: null },
    wednesday: { breakfast: null, lunch: null, dinner: null },
    thursday: { breakfast: null, lunch: null, dinner: null },
    friday: { breakfast: null, lunch: null, dinner: null },
    saturday: { breakfast: null, lunch: null, dinner: null },
    sunday: { breakfast: null, lunch: null, dinner: null },
  });

  const mealTypeColors = {
    breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    lunch: 'bg-blue-100 text-blue-800 border-blue-300',
    dinner: 'bg-green-100 text-green-800 border-green-300',
    snack: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  // Weekly Planner Functions
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', color: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' },
    { key: 'lunch', label: 'Lunch', color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100' },
    { key: 'dinner', label: 'Dinner', color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' }
  ];

  const mealSuggestions = {
    breakfast: [
      { name: 'Avocado Toast with Eggs', calories: 320, time: '10 min', cost: 4 },
      { name: 'Greek Yogurt Parfait', calories: 280, time: '5 min', cost: 3 },
      { name: 'Overnight Oats', calories: 350, time: '5 min', cost: 2 },
      { name: 'Smoothie Bowl', calories: 290, time: '8 min', cost: 5 }
    ],
    lunch: [
      { name: 'Mediterranean Quinoa Bowl', calories: 420, time: '25 min', cost: 8 },
      { name: 'Chicken Caesar Salad', calories: 380, time: '15 min', cost: 9 },
      { name: 'Vegetable Wrap', calories: 340, time: '10 min', cost: 6 },
      { name: 'Lentil Soup', calories: 310, time: '30 min', cost: 4 }
    ],
    dinner: [
      { name: 'Herb-Crusted Salmon', calories: 485, time: '30 min', cost: 15 },
      { name: 'Pasta Primavera', calories: 450, time: '25 min', cost: 8 },
      { name: 'Grilled Chicken & Vegetables', calories: 410, time: '35 min', cost: 10 },
      { name: 'Vegetarian Stir Fry', calories: 380, time: '20 min', cost: 7 }
    ]
  };

  const handleAddMeal = (day, mealType) => {
    const suggestions = mealSuggestions[mealType];
    const randomMeal = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: randomMeal
      }
    }));
  };

  const handleRemoveMeal = (day, mealType) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: null
      }
    }));
  };

  const calculateWeeklyStats = () => {
    let totalCalories = 0;
    let totalCost = 0;
    let mealCount = 0;

    Object.values(weeklyPlan).forEach(day => {
      Object.values(day).forEach(meal => {
        if (meal) {
          totalCalories += meal.calories;
          totalCost += meal.cost;
          mealCount++;
        }
      });
    });

    return { totalCalories, totalCost, mealCount };
  };

  const generateAIPlan = () => {
    const newPlan = { ...weeklyPlan };
    
    days.forEach(day => {
      mealTypes.forEach(mealType => {
        const suggestions = mealSuggestions[mealType.key];
        const randomMeal = suggestions[Math.floor(Math.random() * suggestions.length)];
        newPlan[day][mealType.key] = randomMeal;
      });
    });

    setWeeklyPlan(newPlan);
  };

  const clearAllMeals = () => {
    setWeeklyPlan({
      monday: { breakfast: null, lunch: null, dinner: null },
      tuesday: { breakfast: null, lunch: null, dinner: null },
      wednesday: { breakfast: null, lunch: null, dinner: null },
      thursday: { breakfast: null, lunch: null, dinner: null },
      friday: { breakfast: null, lunch: null, dinner: null },
      saturday: { breakfast: null, lunch: null, dinner: null },
      sunday: { breakfast: null, lunch: null, dinner: null },
    });
  };

  const todayEntries = mealEntries.filter(entry => entry.date === selectedDate);
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const weeklyStats = calculateWeeklyStats();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Back Button + Title */}
            <div className="flex items-center gap-4">
              <Button
                onClick={onBackToMealPlan}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="border-l border-gray-300 h-6"></div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-primary">Meal Journal & Planner</h1>
                  <p className="text-sm text-gray-600">Track meals and plan your week</p>
                </div>
              </div>
            </div>
            
            {/* User Info + Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </div>
              
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selector & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-1 p-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </Card>

          <Card className="p-4 text-center">
            <Utensils className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{todayEntries.length}</div>
            <div className="text-sm text-gray-600">Meals Logged</div>
          </Card>

          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{totalCalories}</div>
            <div className="text-sm text-gray-600">Total Calories</div>
          </Card>

          <Card className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {todayEntries.length > 0 ? (todayEntries.reduce((sum, entry) => sum + entry.rating, 0) / todayEntries.length).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </Card>
        </div>

        {/* Add New Entry Button */}
        <div className="mb-6">
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Log New Meal
          </Button>
        </div>

        {/* Meal Entries */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Meals for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>

          {todayEntries.length === 0 ? (
            <Card className="p-8 text-center">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No meals logged for this day</h3>
              <p className="text-gray-500 mb-4">Start tracking your meals to build healthy eating habits!</p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Meal
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {todayEntries.map((entry) => (
                <Card key={entry.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className={`${mealTypeColors[entry.mealType]} px-2 py-1 rounded-full text-xs font-medium`}>
                        {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {entry.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Meal Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-2">{entry.name}</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-gray-600">{entry.calories} calories</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < entry.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{entry.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Photo Placeholder */}
                    <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                      {entry.image ? (
                        <img src={entry.image} alt={entry.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Add photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* WEEKLY MEAL PLANNER SECTION */}
        <div className="mb-8">
          {/* Weekly Planner Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">${weeklyStats.totalCost}</div>
              <div className="text-sm text-gray-600">Weekly Cost</div>
              <div className="text-xs text-gray-500">Budget: ${user?.budget || 75}</div>
            </Card>

            <Card className="p-4 text-center">
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-primary">{weeklyStats.totalCalories}</div>
              <div className="text-sm text-gray-600">Total Calories</div>
              <div className="text-xs text-gray-500">Avg: {Math.round(weeklyStats.totalCalories / 7)}/day</div>
            </Card>

            <Card className="p-4 text-center">
              <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">{weeklyStats.mealCount}</div>
              <div className="text-sm text-gray-600">Meals Planned</div>
              <div className="text-xs text-gray-500">of 21 total</div>
            </Card>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={generateAIPlan}
                className="bg-gradient-primary text-sm px-3 py-2"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                AI Generate
              </Button>
              <Button 
                onClick={clearAllMeals}
                variant="outline" 
                size="sm"
                className="text-sm px-3 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Weekly Meal Planner */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Weekly Meal Planner</h2>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={generateAIPlan}
                  variant="outline" 
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Plan
                </Button>
                <Badge variant="outline">
                  Week of {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {days.map((day, dayIndex) => (
                <div key={day} className="border rounded-lg overflow-hidden">
                  {/* Day Header */}
                  <div className="bg-gray-50 p-3 text-center border-b">
                    <h3 className="font-semibold text-gray-900">{dayLabels[dayIndex]}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Meals */}
                  <div className="p-3 space-y-2">
                    {mealTypes.map(mealType => (
                      <div key={mealType.key}>
                        {weeklyPlan[day][mealType.key] ? (
                          <div className={`p-2 rounded-lg border ${mealType.color}`}>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-xs">
                                {weeklyPlan[day][mealType.key].name}
                              </h4>
                              <button
                                onClick={() => handleRemoveMeal(day, mealType.key)}
                                className="text-red-500 hover:text-red-700 ml-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>{weeklyPlan[day][mealType.key].calories} cal</span>
                                <span>${weeklyPlan[day][mealType.key].cost}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{weeklyPlan[day][mealType.key].time}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddMeal(day, mealType.key)}
                            className={`w-full p-2 rounded-lg border-2 border-dashed ${mealType.color} transition-colors`}
                          >
                            <Plus className="w-3 h-3 mx-auto mb-1" />
                            <div className="text-xs font-medium">{mealType.label}</div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weekly Summary */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">This Week's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">28</div>
              <div className="text-sm text-gray-600">Meals Logged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8,450</div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">4.2</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MealJournal;
