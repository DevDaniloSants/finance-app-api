import { PostgresHelper } from '../../../db/postgres/helper.js';

export class DeleteUserRepository {
    async execute(userId) {
        const user = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        );

        return user[0];
    }
}
