const makePercent = (numerator, denominator) => {
  var value = Number((numerator / denominator) * 100);
  // Split the input string into two arrays containing integers/decimals
    var numSplit = String(value).split('.');
    console.log('NUM SPLIT', numSplit)
  // If there is no decimal point or only one decimal place found.
    if (numSplit.length === 1 || numSplit[1].length > 2) {
        // Set the number to two decimal places
        value = value.toFixed(2);
    }
  // Return updated or original number.
  return value;
}

module.exports = makePercent;
