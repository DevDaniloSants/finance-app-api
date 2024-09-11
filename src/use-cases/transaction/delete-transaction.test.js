import { transaction } from '../../tests';
import { DeleteTransactionUseCase } from './delete-transaction';

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction;
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub();
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

        return { sut, deleteTransactionRepository };
    };

    it('should successfully delete a transaction', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(transaction.id);

        //assert
        expect(result).toEqual(transaction);
    });

    it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut();

        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        );
        // act
        await sut.execute(transaction.id);

        // assert
        expect(executeSpy).toHaveBeenCalledWith(transaction.id);
    });

    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        const { sut, deleteTransactionRepository } = makeSut();

        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error());
        // act
        const promise = sut.execute(transaction.id);

        // assert
        await expect(promise).rejects.toThrow();
    });
});
