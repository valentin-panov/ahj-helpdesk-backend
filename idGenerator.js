function generateId() {
  return `${new Date().getTime()}-${Math.random()}`;
}

exports.generateId = generateId;
