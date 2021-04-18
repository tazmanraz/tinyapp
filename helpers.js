// MORE HELPER FUNTIONS TO BE MOVED HERE AFTER RESUBMISSION
// CURRENTLY FIGURING OUT REFERENCE ERRORS WHEN MOVING THEM
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const bcrypt = require('bcryptjs');

// Generates random 6 character string
const generateRandomString = function() {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Gets user by email
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user]['email'] === email) {
      return user; // this is a truthy statement - change if giving issues
    } 
  }
  return null;
}

// function to create a new user
const createNewUser = (id, email, password, database) => {
  if (!email || !password) {
    return { status: 400, error: "There is an empty field", data: null }
  }
  if (getUserByEmail(email, database)) {
    return { status: 400, error: "User already exists", data: null } 
  }
  database[id] = { id, email, password }
  return { status: null, error: null, data: { id, email, password } }
}

// Checks login credentials
const checkLogin = (email, password, database) => {
  let id = getUserByEmail(email, database);
  if (!id) {
    return { status: 403, error: "Error logging in", data: null }
  }
  if (id) {
    if (!bcrypt.compareSync(password, database[id]['password'])) {
      return { status: 403, error: "Error logging in", data: null }
    }
  }
  return { status: null, error: null, data: { email, password } }
}

// Function for filtering urls based on user_id
const urlsForUser = (id, urlDB) => {
  let userUrlDatabase = {}
  for (const key in urlDB) {
    if (id === urlDB[key]['userID']){
      userUrlDatabase[key] = urlDB[key]['longURL'];
    }
  }
  return userUrlDatabase;
}

module.exports = {
  getUserByEmail,
  generateRandomString,
  createNewUser,
  checkLogin,
  urlsForUser
}