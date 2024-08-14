import { faker } from '@faker-js/faker';
import { CreateTransactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/user';
describe('CreateTransactionUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    const createTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName,
        date: faker.date.anytime(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
        amount: faker.finance.amount(),
    };

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId };
        }
    }

    class IdGerenatorAdapterStub {
        async execute() {
            return 'random_id';
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const idGeretatorAdapter = new IdGerenatorAdapterStub();

        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeretatorAdapter,
        );

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeretatorAdapter,
        };
    };

    it('should create transaction successfully ', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            ...createTransactionParams,
            id: 'random_id',
        });

        //assert
        expect(result).toEqual({
            ...createTransactionParams,
            id: 'random_id',
        });
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        );
    });
    it('should call IdGeneratorAdapter', async () => {
        //arrage
        const { sut, idGeretatorAdapter } = makeSut();

        const executeSpy = jest.spyOn(idGeretatorAdapter, 'execute');
        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalled();
    });

    it('should call CreateTransactionRepository with correct params ', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut();
        const executeSpy = jest.spyOn(createTransactionRepository, 'execute');

        //act
        await sut.execute({ ...createTransactionParams, id: 'random_id' });

        //assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        });
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        );
    });

    it('should throw if CreateTransactionRepository throws', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut();

        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
    it('should throw if IdGeneratorAdapter throws', async () => {
        //arrange
        const { sut, idGeretatorAdapter } = makeSut();

        jest.spyOn(idGeretatorAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(createTransactionParams);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
