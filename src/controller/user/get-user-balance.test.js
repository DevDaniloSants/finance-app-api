import { faker } from '@faker-js/faker';

import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
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

    it('should return 400 when userId is invalid', async () => {
        // arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({ params: { userId: 'invalid_id' } });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        //arrange
        const { sut, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValue(
            new Error(),
        );
        //act

        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
});
