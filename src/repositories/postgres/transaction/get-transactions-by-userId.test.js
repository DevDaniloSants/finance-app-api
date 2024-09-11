import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser, transaction } from '../../../tests';
import { GetTransactionsByUserIdRepository } from './get-transactions-by-userId';

describe('GetTransactionsByUserId', () => {
    it('should get transactions by user id on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new GetTransactionsByUserIdRepository();

        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        });

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result.length).toBe(1);
        expect(result[0].name).toBe(transaction.name);
        expect(result[0].id).toBe(transaction.id);
        expect(result[0].user_id).toBe(user.id);
        expect(result[0].name).toBe(transaction.name);
        expect(result[0].type).toBe(transaction.type);
        expect(result[0].amount.toString()).toBe(transaction.amount.toString());
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        );
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        );
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        );
    });

    it('should call Prisma with correct params', async () => {
        //arrange
        await prisma.user.create({ data: fakerUser });
        await prisma.transaction.create({
            data: { ...transaction, user_id: fakerUser.id },
        });

        const sut = new GetTransactionsByUserIdRepository();

        const prismaSpy = import.meta.jest.spyOn(
            prisma.transaction,
            'findMany',
        );

        //act
        await sut.execute(fakerUser.id);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { user_id: fakerUser.id },
        });
    });

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new GetTransactionsByUserIdRepository();

        import.meta.jest
            .spyOn(prisma.transaction, 'findMany')
            .mockRejectedValueOnce(new Error());
        //act
        const promise = sut.execute(transaction.id);

        //assert
        expect(promise).rejects.toThrow();
    });
});
