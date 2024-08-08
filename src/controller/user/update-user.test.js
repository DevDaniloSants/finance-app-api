import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';
import { EmailIsAlreadyInUseError } from '../../errors/user';

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user;
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub();
        const sut = new UpdateUserController(updateUserUseCase);

        return { sut, updateUserUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 6 }),
        },
    };

    it('should return 200 when updating a user successfully', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute(httpRequest);
        //assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if userId is invalid', async () => {
        //arrange

        const { sut } = makeSut();

        //act
        const result = await sut.execute({ params: { userId: 'invalid_id' } });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when invalid email is provided', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, email: 'invalid_email' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when invalid password is provided', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when an unallowed field is provided', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowed_field: 'unallowed_field',
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });

    it('should return 400 if UpdateUserUseCase throws EmailIsAlreadyInUseError', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailIsAlreadyInUseError(httpRequest.body.email),
        );
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should call UpdateUserUseCase with correct params', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(updateUserUseCase, 'execute');
        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        );
    });
});
