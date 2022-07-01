const emailLookup = (object, email) => {
  for (const id in object) {
    if (object[id].email === email) {
      return id;
    }
  }
};

module.exports = emailLookup;