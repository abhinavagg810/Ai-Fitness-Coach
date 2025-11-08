import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an AI fitness and nutrition coach. Create structured, personalized 7-day plans
with daily workouts and meals. Provide realistic sets, reps, rest, and macro data.
Always respond with valid JSON.`;

function buildClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildPrompt(userData, planSummary) {
  const base = `Generate a 7-day personalized workout and nutrition plan for the following user data:\n${JSON.stringify(
    userData,
    null,
    2
  )}\nInclude daily workouts (exercise name, sets, reps, rest time, intensity level) and meals (calories, macros: protein, carbs, fats). Return result in JSON format with keys week, workouts, meals.`;
  if (!planSummary) {
    return base;
  }

  return `${base}\nHere is the previous week's progress summary:\n${JSON.stringify(planSummary, null, 2)}\nAdjust the difficulty, volume, or macros based on the progress.`;
}

function buildFallbackPlan() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return {
    week: 1,
    workouts: days.map((day) => ({
      day,
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: 12, rest: '60s', intensity: 'Moderate' },
        { name: 'Push-ups', sets: 3, reps: 10, rest: '60s', intensity: 'Moderate' },
      ],
    })),
    meals: days.map((day) => ({
      day,
      totalCalories: 2200,
      macros: { protein: 140, carbs: 250, fat: 70 },
      meals: ['Oatmeal with berries', 'Grilled tofu salad', 'Lentil soup'],
    })),
  };
}

export async function generatePlan(userData, planSummary) {
  const client = buildClient();
  if (!client) {
    return buildFallbackPlan();
  }

  const prompt = buildPrompt(userData, planSummary);

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from OpenAI');
  }

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}
