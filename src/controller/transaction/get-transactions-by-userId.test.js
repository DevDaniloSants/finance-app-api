import { GetTransactionsByUserIdController } from './get-transactions-by-userId';
import { UserNotFoundError } from '../../errors/user';
import { transaction, user } from '../../tests';

describe('GetTransactionsByUserId', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction];
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        );

        return { sut, getTransactionsByUserIdUseCase };
    };

    const httpRequest = {
        query: {
            userId: user.id,
        },
    };

    it('should return 200 when finding transactions by user id successfully ', async () => {
        //arrange

        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when missing userId param', async () => {
        // arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({ query: { userId: undefined } });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 400 when userId param is invalid', async () => {
        // arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute({ query: { userId: 'invalid_id' } });

        //assert
        expect(result.statusCode).toBe(400);
    });
    it('should return 404 when GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError());

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });
    it('should return 500 when GetTransactionsByUserIdUseCase throws generic error', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error());

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        // arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();

        const executeSpy = jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        );

        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId);
    });
});
