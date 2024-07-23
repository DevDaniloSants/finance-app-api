import { badRequest } from './http.js';

export const userNotFoundResponse = () => {
    return badRequest({ message: 'The user was not found.' });
};
