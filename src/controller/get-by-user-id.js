import validator from 'validator';
import { badRequest, notFound, ok, serverError } from './helpers.js';
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
