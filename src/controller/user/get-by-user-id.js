import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js';

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
    }
    async execute(httpRequest) {
        try {
            const isUuidValid = checkIfIdIsValid(httpRequest.params.userId);

            if (!isUuidValid) {
                return invalidIdResponse();
            }

            const user = await this.getUserByIdUseCase.execute(
                httpRequest.params.userId,
            );

            if (!user) {
                return userNotFoundResponse();
            }

            return ok(user);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
