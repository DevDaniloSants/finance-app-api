import { PostgresGetByUserIdRepository } from '../repositories/postgres/index.js';

export class GetByUserIdUseCase {
    async execute(userId) {
        const postgresGetByUserIdRepository =
            new PostgresGetByUserIdRepository();

        const user = await postgresGetByUserIdRepository.execute(userId);

        return user;
    }
}
