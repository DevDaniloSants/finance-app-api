import { GetUserBalanceController } from './get-user-balance';
import { faker } from '@faker-js/faker';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return {
                earnings: `${faker.number.int()}`,
                expenses: `${faker.number.int()}`,
                investiments: `${faker.number.int()}`,
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
        const sut = new GetUserBalanceController(getUserBalanceUseCase);

        return { sut, getUserBalanceUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 when getting user balance', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });
});
