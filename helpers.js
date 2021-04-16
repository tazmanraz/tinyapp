const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user]['email'] === email) {
      return user; // this is a truthy statement - change if giving issues
    } 
  }
  return null;
}

module.exports = {
  getUserByEmail
}