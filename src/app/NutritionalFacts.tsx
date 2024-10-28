import React from "react";

interface NutritionalFactsProps {
  servingSize: number;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  vitaminA: string;
  vitaminC: string;
  calcium: string;
  iron: string;
}

const NutritionalFacts: React.FC<NutritionalFactsProps> = ({
  servingSize,
  calories,
  totalFat,
  saturatedFat,
  transFat,
  cholesterol,
  sodium,
  totalCarbohydrate,
  dietaryFiber,
  sugars,
  protein,
  vitaminA,
  vitaminC,
  calcium,
  iron,
}) => {
  return (
    <div className="border p-4 w-64 text-gray-700">
      <h2 className="text-xl font-bold text-center mb-2">Nutritional Facts</h2>
      <p className="text-center">Serving Size: {servingSize}g</p>
      <p className="text-center">Amount Per Serving</p>
      <p className="font-bold">Calories: {calories}</p>
      <hr className="my-2" />
      <h3 className="font-semibold">Total Fat: {totalFat}g</h3>
      <p>Saturated Fat: {saturatedFat}g</p>
      <p>Trans Fat: {transFat}g</p>
      <p>Cholesterol: {cholesterol}mg</p>
      <p>Sodium: {sodium}mg</p>
      <hr className="my-2" />
      <h3 className="font-semibold">
        Total Carbohydrate: {totalCarbohydrate}g
      </h3>
      <p>Dietary Fiber: {dietaryFiber}g</p>
      <p>Sugars: {sugars}g</p>
      <hr className="my-2" />
      <h3 className="font-semibold">Protein: {protein}g</h3>
      <hr className="my-2" />
      <div className="flex justify-between">
        <p>Vitamin A: {vitaminA}</p>
        <p>Vitamin C: {vitaminC}</p>
      </div>
      <div className="flex justify-between">
        <p>Calcium: {calcium}</p>
        <p>Iron: {iron}</p>
      </div>
      <p className="text-sm text-gray-500">
        *Percent Daily Values (DV) are based on a 2,000 calorie diet.
      </p>
    </div>
  );
};

export default NutritionalFacts;
