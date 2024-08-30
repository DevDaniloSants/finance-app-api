import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import {
    transaction as fakerTransaction,
    user as fakerUser,
} from '../../../tests';
import { DeleteTransactionRepository } from './delete-transaction';

describe('DeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        //arrage
        const user = await prisma.user.create({ data: fakerUser });
        const transaction = await prisma.transaction.create({
            data: { ...fakerTransaction, user_id: user.id },
        });

        const sut = new DeleteTransactionRepository();

        //act
        const result = await sut.execute(transaction.id);

        //assert
        expect(result.id).toBe(transaction.id);
        expect(result.user_id).toBe(user.id);
        expect(result.name).toBe(transaction.name);
        expect(result.type).toBe(transaction.type);
        expect(result.amount.toString()).toBe(transaction.amount.toString());
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(transaction.date).month(),
        );
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
    });

    it('should call Prisma with correct params', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const transaction = await prisma.transaction.create({
            data: { ...fakerTransaction, user_id: user.id },
        });

        const sut = new DeleteTransactionRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'delete');
        //act
        await sut.execute(transaction.id);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        });
    });

    it('should throws generic error if Prisma throws generic error', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const transaction = await prisma.transaction.create({
            data: { ...fakerTransaction, user_id: user.id },
        });

        const sut = new DeleteTransactionRepository();

        jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(transaction.id);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
