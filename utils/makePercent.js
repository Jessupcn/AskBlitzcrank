const makePercent = (numerator, denominator) => {
  return Number((numerator / denominator) * 100).toFixed(2);
}

module.exports = makePercent;
