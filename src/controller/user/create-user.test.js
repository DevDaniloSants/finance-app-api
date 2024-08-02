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

    it('should return 400 if first_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                last_name: 'Santos',
                email: 'danilo@dnl.com',
                password: '1234567',
            },
        };

        // act

        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.first_name).toBeUndefined();
    });
    it('should return 400 if last_name is not provided', async () => {
        //arrange

        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Danilo',
                email: 'danilo@dnl.com',
                password: '1234567',
            },
        };

        // act

        const result = await createUserController.execute(httpRequest);
        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.last_name).toBeUndefined();
    });
    it('should return 400 if email is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Danilo',
                last_name: 'Santos',
                password: '1234567',
            },
        };
        // act
        const result = await createUserController.execute(httpRequest);
        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.email).toBeUndefined();
    });

    it('should return 400 if email is not valid', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Danilo',
                last_name: 'Santos',
                email: 'danilo',
                password: '1234567',
            },
        };
        //act
        const result = await createUserController.execute(httpRequest);
        //assert

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Danilo',
                last_name: 'Santos',
                email: 'danilo@dnl.com',
            },
        };
        // act

        const result = await createUserController.execute(httpRequest);
        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.password).toBeUndefined();
    });
    it('should return 400 if password is less than 6 characters', async () => {
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
                password: '1234',
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });
});
