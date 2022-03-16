exports.getNowString = () => {
  return new Date().toISOString();
}

exports.createPlaceholdersArr = (valuesArr, start = 1) => {
  return valuesArr.map((_, idx) => `$${idx+start}`);
}
