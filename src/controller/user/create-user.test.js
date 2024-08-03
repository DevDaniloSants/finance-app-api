import { faker } from '@faker-js/faker';

import { CreateUserController } from './create-user';

describe('create user controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const sut = new CreateUserController(createUserUseCase);

        return { sut, createUserUseCase };
    };

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 6 }),
        },
    };

    it('should return 201 when creating a user successfully', async () => {
        // arrange
        const { sut } = makeSut();

        // act

        const result = await sut.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(httpRequest.body);
        expect(result.body).not.toBeUndefined();
    });

    it('should return 400 if first_name is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        // act

        const result = await sut.execute({
            body: { ...httpRequest.body, first_name: undefined },
        });

        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.first_name).toBeUndefined();
    });
    it('should return 400 if last_name is not provided', async () => {
        //arrange

        const { sut } = makeSut();

        // act

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.last_name).toBeUndefined();
    });
    it('should return 400 if email is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        });
        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.email).toBeUndefined();
    });

    it('should return 400 if email is not valid', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                email: 'email_is_not_valid',
            },
        });
        //assert

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        // act

        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        });
        //assert
        expect(result.statusCode).toBe(400);
        expect(result.body.password).toBeUndefined();
    });
    it('should return 400 if password is less than 6 characters', async () => {
        // arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest,
                password: faker.internet.password({ length: 3 }),
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct params', async () => {
        //arrange

        const { sut, createUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        //act

        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 500 if CreateUserUseCase throws', async () => {
        //arrange
        const { sut, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error();
        });

        //act

        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
});
