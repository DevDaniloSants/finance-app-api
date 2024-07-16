import { PostgresHelper } from '../../../db/postgres/helper.js';

export class GetTransactionsByUserIdRepository {
    async execute(userId) {
        const transactions = await PostgresHelper.query(
            `
        SELECT * FROM transactions WHERE user_id = $1 RETURNING * 
        `,
            [userId],
        );

        return transactions[0];
    }
}
