import { GetUserByIdController } from './get-user-by-id';
import { user } from '../../tests/fixtures/user';

describe('GetUserByIdController', () => {
    class GetUserByIdUseCase {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCase();
        const sut = new GetUserByIdController(getUserByIdUseCase);

        return { sut, getUserByIdUseCase };
    };

    const httpRequest = {
        params: {
            userId: user.id,
        },
    };

    it('should return 200 if a user is found', async () => {
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

    it('should return 404 if user not found', async () => {
        //arrange

        const { sut, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null);
        //act

        const result = await sut.execute(httpRequest);

        //assert

        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        //arrange

        const { sut, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // act

        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });

    it('should call GetUserByIdUseCase with correct params', async () => {
        //arrange

        const { sut, getUserByIdUseCase } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute');
        // act

        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
