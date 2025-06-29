import React from 'react';

const validEmail = (email) => {
  const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
  // returns true if email is valid, false otherwise
};

const getInitials = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  let initials = '';
  if (words[1]) {
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }
  } else {
    initials = words[0][0];
  }
  return initials.toUpperCase();
};

export { validEmail, getInitials };
