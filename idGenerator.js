function generateId() {
  return `${Date.now()}-${Math.random()}`;
}

exports.generateId = generateId;
