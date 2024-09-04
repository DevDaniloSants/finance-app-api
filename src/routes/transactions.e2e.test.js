import request from 'supertest';
import { app } from '../app.js';

import { transaction } from '../tests/fixtures/transaction.js';
import { user } from '../tests/fixtures/user.js';
import dayjs from 'dayjs';

describe('Transactions Routes  E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(transaction.name);
        expect(response.body.amount).toBe(String(transaction.amount));
        expect(dayjs(response.body.date).year()).toBe(
            dayjs(transaction.date).year(),
        );
        expect(response.body.type).toBe(transaction.type);
    });

    it('GET /api/transactions?userId should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            });

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        );

        expect(response.statusCode).toBe(200);
        expect(response.body[0].id).toBe(createdTransaction.id);
    });

    it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            });

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({
                amount: 100,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.amount).toBe('100');
    });
    it('DELETE /api/transactions/:transactionId should return 200 when deleting a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            });

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(createdTransaction.id);
    });
});
