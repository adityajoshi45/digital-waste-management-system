// Rough CO₂ saving factors (kg CO₂ saved per kg of e-waste recycled)
const CO2_FACTOR = 2.3;

const calcCO2 = (weightKg) => {
  return parseFloat((weightKg * CO2_FACTOR).toFixed(2));
};

module.exports = { calcCO2 };
