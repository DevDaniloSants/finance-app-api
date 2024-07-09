import { EmailIsAlreadyInUseError } from '../errors/user.js';

import { badRequest, created, serverError } from './helpers/index.js';

import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidPasswordResponse,
} from './helpers/user.js';

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
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

            const passwordIsValid = checkIfPasswordIsValid(params.password);

            if (!passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);

            if (!emailIsValid) {
                return invalidEmailResponse();
            }

            const createdUser = await this.createUserUseCase.execute(params);

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
