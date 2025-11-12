const BACKEND_URL = 'http://localhost:5000';

export const generateMealPlan = async (preferences) => {
  try {
    const { calories, dietType, allergies, goal } = preferences;

    console.log('🍽️ Mengirim ke Backend:', { calories, dietType, allergies, goal });

    const response = await fetch(`${BACKEND_URL}/api/mealplan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        calories,
        dietType,
        allergies,
        goal
      })
    });

    console.log('📡 Status response:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend Error:', errorData);
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Respons dari Backend:', data);

    if (!data.success || !data.data) {
      throw new Error('Invalid response format from server');
    }

    console.log('🎯 Rencana makan yang diterima:', data.data);

    return data.data;
  } catch (error) {
    console.error('❌ Error generating meal plan:', error);
    throw error;
  }
};
