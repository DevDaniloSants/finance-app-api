import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';

describe('GetUserBalance', () => {
    const balance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investiments: faker.finance.amount(),
        balance: faker.finance.amount(),
    };

    class GetUserBalanceRepositoryStub {
        async execute() {
            return balance;
        }
    }

    class GetUserByIdRepositoryStub {
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
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();

        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return { sut, getUserBalanceRepository, getUserByIdRepository };
    };

    const userId = faker.string.uuid();

    it('should get user balance successfully', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(userId);

        //assert
        expect(result).toEqual(balance);
    });
    it('should throw UserNotFoundError if GetUserByIdRepository returns null ', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        //act
        const promise = sut.execute(userId);

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });

    it('should call GetUserByIdRepository with correct params ', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');

        //act
        await sut.execute(userId);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it('should call GetUserBalanceRepository with correct params ', async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute');

        //act
        await sut.execute(userId);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
    it('should throw if GetUserByIdRepository throws ', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(userId);

        //assert
        await expect(promise).rejects.toThrow();
    });
    it('should throw if GetUserBalanceRepository throws ', async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut();

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(userId);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
