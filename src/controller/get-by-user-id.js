import validator from 'validator';
import { badRequest, ok, serverError } from './helpers.js';
import { GetByUserIdUseCase } from '../use-cases/get-user-by-id.js';

export class GetByUserIdController {
    async execute(httpRequest) {
        try {
            const isUuidValid = validator.isUUID(httpRequest.params.userId);

            if (!isUuidValid) {
                return badRequest({ message: 'The provided id is not valid' });
            }

            const getByUserIdUseCase = new GetByUserIdUseCase();

            const user = await getByUserIdUseCase.execute(
                httpRequest.params.userId,
            );

            return ok(user);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
