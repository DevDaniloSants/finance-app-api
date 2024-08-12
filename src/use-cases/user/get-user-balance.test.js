import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';

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
});
