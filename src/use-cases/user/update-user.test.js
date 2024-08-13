import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const updateUserRepository = new UpdateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        );

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        };
    };

    const userId = faker.string.uuid();

    it('should update user successfully (without email and password', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(userId, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        });

        //assert
        expect(result).toBe(user);
    });
    it('should update user successfully (with email)', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut();

        const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute');

        const email = faker.internet.email();
        //act
        const result = await sut.execute(userId, {
            email,
        });

        //assert
        expect(executeSpy).toHaveBeenCalledWith(email);
        expect(result).toBe(user);
    });
});
