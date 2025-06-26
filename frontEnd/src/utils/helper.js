import React from 'react';

const validEmail = (email) => {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
// returns true if email is valid, false otherwise
};

export default validEmail;
