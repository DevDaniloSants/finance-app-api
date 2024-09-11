import { DeleteTransactionController } from './delete-transaction';
import { TransactionNotFoundError } from '../../errors/transaction';
import { transaction } from '../../tests';

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction;
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
        const sut = new DeleteTransactionController(deleteTransactionUseCase);

        return { sut, deleteTransactionUseCase };
    };

    const httpRequest = {
        params: {
            transactionId: transaction.id,
        },
    };

    it('should return 200 when deleting a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut();
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when transaction id is invalid', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            params: { transactionId: 'invalid_id' },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 404 when transaction is not found', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError());
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });
    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error());
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
    it('should call DeleteTransactionUseCase with correct params', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        );
        //act
        await sut.execute(httpRequest);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        );
    });
    it('should return 404 if DeleteTransactionUseCase throws TransactionNotFoundError', async () => {
        //arrage
        const { sut, deleteTransactionUseCase } = makeSut();

        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError());
        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });
});
