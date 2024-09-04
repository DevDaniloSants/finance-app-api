import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../../prisma/prisma.js';
import { TransactionNotFoundError } from '../../../errors/transaction.js';

export class UpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId);
                }
            }
            throw error;
        }
    }
}
