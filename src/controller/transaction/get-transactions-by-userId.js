import { UserNotFoundError } from '../../errors/user.js';
import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    requiredFieldIsMissingResponse,
    ok,
} from '../helpers/index.js';

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserUseCase) {
        this.getTransactionsByUserUseCase = getTransactionsByUserUseCase;
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId;

            if (!userId) {
                return requiredFieldIsMissingResponse(userId);
            }

            const userIdIsValid = checkIfIdIsValid(userId);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const transactions =
                await this.getTransactionsByUserUseCase.execute(userId);

            return ok(transactions);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
