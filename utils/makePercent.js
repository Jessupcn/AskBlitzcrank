const makePercent = (numerator, denominator) => {
  let value = Number((numerator / denominator) * 100);
  let numSplit = String(value).split('.');
  console.log('NUM SPLIT', numSplit.length, numSplit[1] ? numSplit[1].length  : '')

  console.log('test:', numSplit.length === 1, numSplit[1] ? numSplit[1].length > 2 : '')
  // If there is no decimal point or only one decimal place found.
    if (numSplit.length > 1 || numSplit[1]?.length > 2) {
        // Set the number to two decimal places
        value = value.toFixed(2);
    }
  // Return updated or original number.
  return value;
}

module.exports = makePercent;
