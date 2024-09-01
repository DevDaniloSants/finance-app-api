import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '../app.js';
import { user } from '../tests/fixtures/user';

describe('Users Routes E2E Tests', () => {
    it('POST /users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        expect(response.statusCode).toBe(201);
    });

    it('GET /api/users/:userId should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const response = await request(app).get(`/api/users/${createdUser.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(createdUser);
    });

    it('PATCH /api/users/:userId return 200 when user updated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const updatedUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 6 }),
        };

        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updatedUserParams);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(createdUser.id);
        expect(response.body.last_name).toBe(updatedUserParams.last_name);
        expect(response.body.email).toBe(updatedUserParams.email);
        expect(response.body.password).not.toBe(updatedUserParams.password);
    });

    it('DELETE /api/users/:userId return 200 when user deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            });

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`,
        );

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(createdUser);
    });
});
