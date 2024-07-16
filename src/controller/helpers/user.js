import validator from 'validator';

import { badRequest } from './http.js';

export const userNotFoundResponse = () => {
    return badRequest({ message: 'The user was not found.' });
};

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at Least 6 characters',
    });

export const invalidEmailResponse = () =>
    badRequest({
        message: 'Invalid Email: Please provide a valid one',
    });

export const checkIfPasswordIsValid = (password) => password.length >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);
