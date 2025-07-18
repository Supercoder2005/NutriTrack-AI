interface UserData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose' | 'maintain' | 'gain';
}

// Calculate Body Mass Index (BMI)
export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(1));
}

export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 24.9) return "Healthy Weight";
    if (bmi >= 25 && bmi < 29.9) return "Overweight";
    return "Obese";
}

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
function calculateBMR({ weight, height, age, gender }: Omit<UserData, 'goal'>): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  if (gender === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  // For 'other', we can average the male and female formulas as a neutral baseline
  const bmrMale = 10 * weight + 6.25 * height - 5 * age + 5;
  const bmrFemale = 10 * weight + 6.25 * height - 5 * age - 161;
  return (bmrMale + bmrFemale) / 2;
}

// Calculate daily calorie goal based on BMR, activity level, and goal
export function calculateCalorieGoal(userData: UserData): number {
  const bmr = calculateBMR(userData);
  // Assuming a sedentary activity level (BMR * 1.2) as a baseline.
  // A more complex app might ask for activity level.
  const maintenanceCalories = bmr * 1.2;

  let calorieGoal: number;

  switch (userData.goal) {
    case 'lose':
      calorieGoal = maintenanceCalories - 500; // 1lb per week deficit
      break;
    case 'gain':
      calorieGoal = maintenanceCalories + 500; // 1lb per week surplus
      break;
    case 'maintain':
    default:
      calorieGoal = maintenanceCalories;
      break;
  }

  return Math.round(calorieGoal);
}
