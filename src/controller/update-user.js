import validator from 'validator';

import { badRequest, ok, serverError } from './helpers.js';
import { UpdateUserUseCase } from '../use-cases/update-user.js';
import { EmailIsAlreadyInUseError } from '../errors/user.js';

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isValid = validator.isUUID(userId);

            if (!isValid) {
                return badRequest({ message: 'The provided ID is not valid' });
            }

            const updateParams = httpRequest.body;

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldIsNotAllowed = Object.keys(updateParams).some(
                (field) => !allowedFields.includes(field),
            );

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                });
            }

            if (updateParams.password) {
                const passwordIsNotValid = updateParams.password.length < 6;

                if (passwordIsNotValid) {
                    badRequest({
                        message: 'Password must be at least 6 characters ',
                    });
                }
            }

            if (updateParams.email) {
                const emailIsValid = validator.isEmail(updateParams.email);

                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid Email: Please provide a valid one',
                    });
                }
            }

            const updateUserUseCase = new UpdateUserUseCase();

            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateParams,
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof EmailIsAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
