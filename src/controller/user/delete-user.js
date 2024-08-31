import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js';
import { UserNotFoundError } from '../../errors/user.js';

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const idIsValid = checkIfIdIsValid(userId);

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const user = await this.deleteUserUseCase.execute(userId);

            return ok(user);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
