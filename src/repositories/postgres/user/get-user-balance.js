import { PostgresHelper } from '../../../db/postgres/helper';

export class GetUserBalanceRepository {
    async execute(userId) {
        const balance = await PostgresHelper.query(
            `
    SELECT 
	    SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)AS Earnings,
	    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS Expenses,
	    SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS Investiments,  
	   (
        SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) - 
	    SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) -
	    SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
        ) AS balance
    FROM transactions
    WHERE user_id = $1
            `,
            [userId],
        );

        return balance[0];
    }
}
