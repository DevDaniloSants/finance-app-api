import { prisma } from '../../../../prisma/prisma.js';

export class UpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        return await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: updateTransactionParams,
        });
    }
}
