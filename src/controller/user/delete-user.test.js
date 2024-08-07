import { faker } from '@faker-js/faker';
import { DeleteUserController } from './delete-user';

describe('DeleteUserController ', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 6 }),
            };
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub();
        const sut = new DeleteUserController(deleteUserUseCase);

        return { sut, deleteUserUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 if user is deleted', async () => {
        //arrange
        const { sut } = makeSut();

        //act

        const result = await sut.execute(httpRequest);

        //assert

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if id is invalid', async () => {
        //arrange
        const { sut } = makeSut();

        //act

        const result = await sut.execute({ params: { userId: 'invalid_id' } });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('shoud return 404 if user is not found', async () => {
        //arrange

        const { sut, deleteUserUseCase } = makeSut();

        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null);

        //act

        const result = await sut.execute(httpRequest);

        //assert

        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if DeleteUserUseCase throws', async () => {
        //arrange
        const { sut, deleteUserUseCase } = makeSut();

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValue(new Error());

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });

    it('should call DeleteUserUseCase with correct params', async () => {
        //arrange
        const { sut, deleteUserUseCase } = makeSut();

        const execute = jest.spyOn(deleteUserUseCase, 'execute');

        //act
        await sut.execute(httpRequest);

        //assert
        expect(execute).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
