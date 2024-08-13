import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';
describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);

        return { sut, getUserByIdRepository };
    };

    const userId = faker.string.uuid();

    it('should get user by id successfully ', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(userId);

        //assert
        expect(result).toEqual(user);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');

        //act
        await sut.execute(userId);

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
    it('should throw  if GetByUserIdRepository throws', async () => {
        // arrage
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );
        // act

        const promise = sut.execute(userId);

        // assert
        await expect(promise).rejects.toThrow();
    });
});