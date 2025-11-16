import React, { useState } from 'react';
import { generateMealPlan } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const tabStyles = {
  base: "py-2 px-4 -mb-px",
  active: "border-b-2 border-[#0055b8] text-white",
  inactive: "text-gray-400 hover:text-white"
};

export default function AIAssistant() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('meal-plan');
  const [preferences, setPreferences] = useState({
    calories: '',
    dietType: 'balanced',
    allergies: '',
    goal: 'maintenance'
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('Sending preferences:', preferences);
      const plan = await generateMealPlan(preferences);
      console.log('Received plan:', plan);
      setMealPlan(plan);
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed to generate meal plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#001a3d] text-white px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <div className="text-sm text-gray-400">
            Welcome, {user?.username}!
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('meal-plan')}
            className={[
              tabStyles.base,
              activeTab === 'meal-plan' ? tabStyles.active : tabStyles.inactive
            ].join(' ')}
          >
            Meal Planner
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={[
              tabStyles.base,
              activeTab === 'workout' ? tabStyles.active : tabStyles.inactive
            ].join(' ')}
          >
            Workout Assistance
          </button>
        </div>

        {activeTab === 'meal-plan' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#002a5c] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Generate Meal Plan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2">Daily Calorie Target</label>
                  <input
                    type="number"
                    name="calories"
                    value={preferences.calories}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#001a3d] border border-[#0055b8]"
                    placeholder="e.g., 2000"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2">Diet Type</label>
                  <select
                    name="dietType"
                    value={preferences.dietType}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#001a3d] border border-[#0055b8]"
                  >
                    <option value="balanced">Balanced</option>
                    <option value="low-carb">Low Carb</option>
                    <option value="high-protein">High Protein</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Allergies/Restrictions</label>
                  <input
                    type="text"
                    name="allergies"
                    value={preferences.allergies}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#001a3d] border border-[#0055b8]"
                    placeholder="e.g., nuts, dairy"
                  />
                </div>

                <div>
                  <label className="block mb-2">Fitness Goal</label>
                  <select
                    name="goal"
                    value={preferences.goal}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#001a3d] border border-[#0055b8]"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[#0055b8] hover:bg-[#0066dd] rounded font-medium disabled:opacity-50"
                >
                  {loading ? 'Generating Plan...' : 'Generate Meal Plan'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-[#002a5c] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Your Meal Plan</h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055b8]"></div>
                </div>
              ) : mealPlan ? (
                <div className="space-y-6">
                  {['breakfast', 'lunch', 'dinner'].map(mealType => (
                    <div key={mealType} className="bg-[#001a3d] p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 capitalize">{mealType}</h3>
                      <div className="space-y-3">
                        <h4 className="font-medium">{mealPlan[mealType].name}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>Calories: {mealPlan[mealType].calories}</div>
                          <div>Protein: {mealPlan[mealType].protein}g</div>
                          <div>Carbs: {mealPlan[mealType].carbs}g</div>
                          <div>Fat: {mealPlan[mealType].fat}g</div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Ingredients:</h5>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            {mealPlan[mealType].ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Instructions:</h5>
                          <p className="text-sm text-gray-300">{mealPlan[mealType].instructions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  Enter your preferences and generate a meal plan to see results here
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="bg-[#002a5c] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Workout Assistant</h2>
            <p className="text-gray-400">Coming soon! Get personalized workout recommendations and form guidance.</p>
          </div>
        )}
      </div>
    </div>
  );
}