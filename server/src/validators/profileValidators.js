const { normalizeString } = require("../utils/sanitize");

function validateProfileUpdate(payload) {
  const name = normalizeString(payload.name);
  const goal = normalizeString(payload.goal);
  const rawWeight = payload.weight;

  let weight = null;
  if (rawWeight !== undefined && rawWeight !== null && String(rawWeight).trim() !== "") {
    const parsedWeight = Number(rawWeight);

    if (!Number.isFinite(parsedWeight) || parsedWeight < 0 || parsedWeight > 500) {
      return { error: "weight must be a number between 0 and 500." };
    }

    weight = parsedWeight;
  }

  if (name.length > 80) {
    return { error: "name must be 80 characters or fewer." };
  }

  if (goal.length > 200) {
    return { error: "goal must be 200 characters or fewer." };
  }

  return {
    value: {
      name,
      goal,
      weight
    }
  };
}

module.exports = {
  validateProfileUpdate
};
