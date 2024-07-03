import validator from 'validator';

import { CreateUserUseCase } from '../use-cases/create-user.js';
import { badRequest, created, serverError } from './helpers.js';
import { EmailIsAlreadyInUseError } from '../errors/user.js';

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` });
                }
            }

            const passwordIsValid = params.password.length < 6;

            if (passwordIsValid) {
                return badRequest({
                    message: 'Password must be at Least 6 characters',
                });
            }

            const emailIsValid = await validator.isEmail(params.email);

            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid Email: Please provide a valid one',
                });
            }

            const createUserUseCase = new CreateUserUseCase();

            const createdUser = await createUserUseCase.execute(params);

            return created(createdUser);
        } catch (error) {
            console.error(error);
            if (error instanceof EmailIsAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            return serverError();
        }
    }
}
