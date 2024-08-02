import { CreateUserController } from './create-user';

describe('create user controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Danilo',
                last_name: 'Santos',
                email: 'danilo@dnl.com',
                password: '1234567',
            },
        };

        // act

        const result = await createUserController.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toBe(httpRequest.body);
        expect(result.body).not.toBeUndefined();
    });
});
