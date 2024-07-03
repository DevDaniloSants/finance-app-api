import { PostgresGetByUserId } from '../repositories/postgres/get-user-by-id';

export class GetByUserIdUseCase {
    async execute(userId) {
        const postgresGetByUserId = new PostgresGetByUserId();

        const user = await postgresGetByUserId.execute(userId);

        return user;
    }
}
