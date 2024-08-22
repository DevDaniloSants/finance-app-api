import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser, transaction } from '../../../tests';
import { PostgresCreateTransactionRepository } from './create-transaction';

describe('CreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakerUser });
        const sut = new PostgresCreateTransactionRepository();

        const createTransactionParams = { ...transaction, user_id: user.id };

        //act
        const result = await sut.execute(createTransactionParams);

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
});
