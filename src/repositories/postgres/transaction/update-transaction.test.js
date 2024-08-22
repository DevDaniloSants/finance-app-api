import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import {
    user as fakerUser,
    transaction as fakerTransaction,
} from '../../../tests';
import { UpdateTransactionRepository } from './update-transaction';
import { TransactionType } from '@prisma/client';
import dayjs from 'dayjs';

describe('UpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const transaction = await prisma.transaction.create({
            data: { ...fakerTransaction, user_id: user.id },
        });

        const sut = new UpdateTransactionRepository();

        const updateTransactionParams = {
            id: transaction.id,
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: +faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
        };

        //act

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        );

        //assert
        expect(result.id).toBe(updateTransactionParams.id);
        expect(result.id).toBe(updateTransactionParams.id);
        expect(result.user_id).toBe(user.id);
        expect(result.name).toBe(updateTransactionParams.name);
        expect(result.type).toBe(updateTransactionParams.type);
        expect(result.amount.toString()).toBe(
            updateTransactionParams.amount.toString(),
        );
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionParams.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionParams.date).month(),
        );
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionParams.date).year(),
        );
    });

    it('should call Prisma with correct params', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const transaction = await prisma.transaction.create({
            data: { ...fakerTransaction, user_id: user.id },
        });
        const sut = new UpdateTransactionRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'update');

        //act
        await sut.execute(transaction.id, transaction);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: transaction,
        });
    });

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new UpdateTransactionRepository();

        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(fakerTransaction.id, fakerTransaction);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
