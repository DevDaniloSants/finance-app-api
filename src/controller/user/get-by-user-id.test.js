import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-by-user-id';

describe('GetByUserIdController', () => {
    class GetByUserIdUseCaseStub {
        async execute() {
            return {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 6 }),
            };
        }
    }

    const makeSut = () => {
        const getByUserIdUseCase = new GetByUserIdUseCaseStub();
        const sut = new GetUserByIdController(getByUserIdUseCase);

        return { sut, getByUserIdUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
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
});
