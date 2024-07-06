import { GetByUserIdUseCase } from '../use-cases/get-user-by-id.js';

import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from './helpers/index.js';

export class GetByUserIdController {
    async execute(httpRequest) {
        try {
            const isUuidValid = checkIfIdIsValid(httpRequest.params.userId);

            if (!isUuidValid) {
                return invalidIdResponse();
            }

            const getByUserIdUseCase = new GetByUserIdUseCase();

            const user = await getByUserIdUseCase.execute(
                httpRequest.params.userId,
            );

            if (!user) {
                return notFound({ message: 'user not found.' });
            }

            return ok(user);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
