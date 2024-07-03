import { PostgresHelper } from '../../db/postgres/helper.js';

export class PostgresGetByUserEmail {
    async execute(email) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users email = $1',
            [email],
        );

        return user[0];
    }
}
