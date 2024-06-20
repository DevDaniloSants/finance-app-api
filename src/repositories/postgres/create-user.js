import { PostgresHelper } from '../../db/postgres/helper';

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        const results = PostgresHelper(
            'INSERT INTO users (ID, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
            [
                createUserParams.ID,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        );

        return results[0];
    }
}
