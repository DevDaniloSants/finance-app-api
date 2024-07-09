import { EmailIsAlreadyInUseError } from '../errors/user.js';
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    invalidEmailResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    badRequest,
    ok,
    serverError,
} from './helpers/index.js';

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

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                });
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password);

                if (!passwordIsValid) {
                    return invalidPasswordResponse();
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email);

                if (!emailIsValid) {
                    return invalidEmailResponse();
                }
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
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
