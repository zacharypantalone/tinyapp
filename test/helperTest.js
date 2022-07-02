const { assert } = require('chai');
const  emailLookup  = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('emailLookup', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert(user, expectedUserID);
    
  });

  it('should return undefined if the email is non-existent', function() {
    const user = emailLookup(testUsers, "zakdfsgfg@gmail.com");
    const expectedResult = 'undefined';
    assert(typeof user, expectedResult);
  });
  
});