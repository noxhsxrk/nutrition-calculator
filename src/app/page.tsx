// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import NutritionalFacts from "./NutritionalFacts";

interface Ingredient {
  name: string;
  percentage: number | null;
  error?: string;
}

interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  dietaryFiber: number;
  sugars: number;
  vitaminA: string;
  vitaminC: string;
  calcium: string;
  iron: string;
}

const NutritionCalculator: React.FC = () => {
  const [totalWeight, setTotalWeight] = useState<number>(100);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", percentage: null },
  ]);
  const [ignoreRemaining, setIgnoreRemaining] = useState<boolean>(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(
    null
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (ingredients.length < 1) {
      setError("Please add at least one ingredient");
      return;
    }
  }, [ingredients]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedIngredients = [...ingredients];
    if (name === "name") {
      updatedIngredients[index].name = value;
      updatedIngredients[index].error = "";
    } else {
      updatedIngredients[index].percentage = value ? Number(value) : null;
    }
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", percentage: null }]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const calculateWeights = () => {
    if (totalWeight < 1) {
      setError("Total weight must be greater than 0");
      return;
    }

    if (ingredients.length < 1) {
      setError("Please add at least one ingredient");
      return;
    }

    if (ingredients.some((i) => !i.name)) {
      setError("All ingredients must have a name");
      return;
    }

    if (ingredients.some((i) => i.percentage === null)) {
      setError("All ingredients must have a percentage");
      return;
    }

    const totalPercentage = ingredients.reduce(
      (acc, ingredient) => acc + (ingredient.percentage || 0),
      0
    );

    if (!ignoreRemaining && totalPercentage < 100) {
      setError("Total percentage must not be less than 100%");
      return;
    }

    const weights = ingredients.reduce((acc, ingredient) => {
      if (ingredient.percentage !== null) {
        acc[ingredient.name] = (ingredient.percentage / 100) * totalWeight;
      }
      return acc;
    }, {} as Record<string, number>);

    fetchNutritionData(weights);
  };

  const fetchNutritionData = async (weights: Record<string, number>) => {
    setError("");
    try {
      const combinedNutrition = await Promise.all(
        Object.entries(weights).map(async ([ingredient, weight]) => {
          const response = await axios.post(
            `https://trackapi.nutritionix.com/v2/natural/nutrients`,
            {
              query: `${weight}g ${ingredient}`,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-app-id": process.env.NUTRITIONIX_APP_ID || "",
                "x-app-key": process.env.NUTRITIONIX_APP_KEY || "",
              },
            }
          );

          const foodItem = response.data.foods[0];

          return {
            calories: foodItem.nf_calories || 0,
            protein: foodItem.nf_protein || 0,
            fat: foodItem.nf_total_fat || 0,
            carbs: foodItem.nf_total_carbohydrate || 0,
            totalFat: foodItem.nf_total_fat || 0,
            saturatedFat: foodItem.nf_saturated_fat || 0,
            transFat: foodItem.nf_trans_fat || 0,
            cholesterol: foodItem.nf_cholesterol || 0,
            sodium: foodItem.nf_sodium || 0,
            dietaryFiber: foodItem.nf_dietary_fiber || 0,
            sugars: foodItem.nf_sugars || 0,
            vitaminA: foodItem.nf_vitamin_a || "N/A",
            vitaminC: foodItem.nf_vitamin_c || "N/A",
            calcium: foodItem.nf_calcium || "N/A",
            iron: foodItem.nf_iron || "N/A",
          };
        })
      );

      const totalNutrition = combinedNutrition.reduce<NutritionData>(
        (acc, curr) => ({
          calories: acc.calories + curr.calories,
          protein: acc.protein + curr.protein,
          fat: acc.fat + curr.fat,
          carbs: acc.carbs + curr.carbs,
          totalFat: acc.totalFat + curr.totalFat,
          saturatedFat: acc.saturatedFat + curr.saturatedFat,
          transFat: acc.transFat + curr.transFat,
          cholesterol: acc.cholesterol + curr.cholesterol,
          sodium: acc.sodium + curr.sodium,
          dietaryFiber: acc.dietaryFiber + curr.dietaryFiber,
          sugars: acc.sugars + curr.sugars,
          vitaminA: curr.vitaminA,
          vitaminC: curr.vitaminC,
          calcium: curr.calcium,
          iron: curr.iron,
        }),
        {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          totalFat: 0,
          saturatedFat: 0,
          transFat: 0,
          cholesterol: 0,
          sodium: 0,
          dietaryFiber: 0,
          sugars: 0,
          vitaminA: "N/A",
          vitaminC: "N/A",
          calcium: "N/A",
          iron: "N/A",
        }
      );

      setNutritionData(totalNutrition);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          const query = JSON.parse(error.config?.data);
          const ingredientName = query.query.split(" ")[1];
          setError(
            `Nutrition data not found. Please check the ingredient name: ${ingredientName}.`
          );
        }
      } else {
        setError("Error fetching nutrition data. Please check the API.");
      }
      console.error("Error fetching nutrition data", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-6 w-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Nutritional Calculator
        </h1>
        <input
          type="number"
          placeholder="Total Weight (g)"
          onChange={(e) => setTotalWeight(Number(e.target.value))}
          className="border p-2 mb-2 w-full text-black"
        />

        <div className="flex items-center mb-4 text-gray-700">
          <input
            type="checkbox"
            checked={ignoreRemaining}
            onChange={(e) => setIgnoreRemaining(e.target.checked)}
            className="mr-2"
          />
          <label>Ignore Remaining Percentage</label>
        </div>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              name="name"
              placeholder="Ingredient Name (e.g., ไก่)"
              value={ingredient.name}
              onChange={(e) => handleInputChange(index, e)}
              className="border p-2 w-1/2 mr-2 text-black"
            />
            <input
              type="number"
              name="percentage"
              placeholder="Percentage (%)"
              value={
                ingredient.percentage !== null ? ingredient.percentage : ""
              }
              onChange={(e) => handleInputChange(index, e)}
              className="border p-2 w-1/2 text-black"
            />
            <button
              onClick={() => removeIngredient(index)}
              className="text-red-500 text-xl ml-2"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          onClick={addIngredient}
          className="bg-green-500 text-white p-2 rounded mb-4 w-full"
        >
          Add Ingredient
        </button>
        <button
          onClick={calculateWeights}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Calculate
        </button>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        {nutritionData && (
          <div className="flex justify-center items-center mt-4">
            <NutritionalFacts
              servingSize={totalWeight}
              calories={nutritionData.calories}
              totalFat={nutritionData.totalFat}
              saturatedFat={nutritionData.saturatedFat}
              transFat={nutritionData.transFat}
              cholesterol={nutritionData.cholesterol}
              sodium={nutritionData.sodium}
              totalCarbohydrate={nutritionData.carbs}
              dietaryFiber={nutritionData.dietaryFiber}
              sugars={nutritionData.sugars}
              protein={nutritionData.protein}
              vitaminA={nutritionData.vitaminA}
              vitaminC={nutritionData.vitaminC}
              calcium={nutritionData.calcium}
              iron={nutritionData.iron}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionCalculator;
