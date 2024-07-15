import validator from 'validator';

import { badRequest } from './http.js';

export const invalidIdResponse = () =>
    badRequest({ message: 'The provided id is not valid' });

export const checkIfIdIsValid = (userId) => validator.isUUID(userId);
