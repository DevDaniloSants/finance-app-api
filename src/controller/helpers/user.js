import { notFound } from './http.js';

export const userNotFoundResponse = () => {
    return notFound({ message: 'The user was not found.' });
};
