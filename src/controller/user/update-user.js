import { ZodError } from 'zod';

import {
    EmailIsAlreadyInUseError,
    UserNotFoundError,
} from '../../errors/user.js';

import { updateUserSchema } from '../../schemas/user.js';

import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js';

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isValid = checkIfIdIsValid(userId);

            if (!isValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            await updateUserSchema.parseAsync(params);

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            if (error instanceof EmailIsAlreadyInUseError) {
                return badRequest({ message: error.message });
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            console.log(error);
            return serverError();
        }
    }
}
