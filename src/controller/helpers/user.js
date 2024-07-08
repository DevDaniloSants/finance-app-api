import validator from 'validator';

import { badRequest } from './http.js';

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at Least 6 characters',
    });

export const invalidEmailResponse = () =>
    badRequest({
        message: 'Invalid Email: Please provide a valid one',
    });

export const invalidIdResponse = () =>
    badRequest({ message: 'The provided id is not valid' });

export const checkIfPasswordIsValid = (password) => password.length >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);

export const checkIfIdIsValid = (userId) => validator.isUUID(userId);