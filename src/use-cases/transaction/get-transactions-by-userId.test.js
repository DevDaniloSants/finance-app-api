import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-userId';
import { UserNotFoundError } from '../../errors/user';
describe('GetTransactionsByUserId', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName,
        date: faker.date.anytime(),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
        amount: faker.finance.amount(),
    };

    class GetTransactionsByUserRepositoryStub {
        async execute() {
            return transaction;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId };
        }
    }

    const makeSut = () => {
        const getTransactionsByUserRepository =
            new GetTransactionsByUserRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserRepository,
            getUserByIdRepository,
        );

        return { sut, getTransactionsByUserRepository, getUserByIdRepository };
    };

    it('should get transactions by userId successfully', async () => {
        //arrage
        const { sut } = makeSut();

        //act
        const result = await sut.execute(user.id);

        //assert
        expect(result).toEqual(transaction);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
        //act
        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });
    it('should call GetTransactionsByUserRepository with correct params', async () => {
        //arrage
        const { sut, getTransactionsByUserRepository } = makeSut();

        const executeSpy = jest.spyOn(
            getTransactionsByUserRepository,
            'execute',
        );
        //act
        await sut.execute(user.id);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.id);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrage
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(user.id);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
