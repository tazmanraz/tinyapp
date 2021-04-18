// MORE HELPER FUNTIONS TO BE MOVED HERE AFTER RESUBMISSION
// CURRENTLY FIGURING OUT REFERENCE ERRORS WHEN MOVING THEM
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generates random 6 character string
const generateRandomString = function() {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
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




module.exports = {
  getUserByEmail,
  generateRandomString
}