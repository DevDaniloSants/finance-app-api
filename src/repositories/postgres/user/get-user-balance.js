import { prisma } from '../../../../prisma/prisma.js';

export class GetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        });

        const _totalEarning = totalEarnings || 0;
        const _totalExpenses = totalExpenses || 0;
        const _totalInvestments = totalInvestments || 0;

        const balance = _totalEarning - _totalExpenses - _totalInvestments;

        return {
            earnings: _totalEarning,
            expenses: _totalExpenses,
            investiments: _totalInvestments,
            balance,
        };
    }
}
