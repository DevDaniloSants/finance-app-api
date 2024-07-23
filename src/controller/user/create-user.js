import { ZodError } from 'zod';

import { EmailIsAlreadyInUseError } from '../../errors/user.js';
import { badRequest, created, serverError } from '../helpers/index.js';
import { createUserSchema } from '../../schemas/index.js';

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            await createUserSchema.parseAsync(params);

            const createdUser = await this.createUserUseCase.execute(params);

            return created(createdUser);
        } catch (error) {
            console.error(error);
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            if (error instanceof EmailIsAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            return serverError();
        }
    }
}
