import validator from 'validator';

import { badRequest } from './http.js';

export const invalidIdResponse = () =>
    badRequest({ message: 'The provided id is not valid' });

export const checkIfIdIsValid = (userId) => validator.isUUID(userId);

export const requiredFieldIsMissingResponse = (missingField) => {
    return badRequest({ message: `The field ${missingField} is required.` });
};
