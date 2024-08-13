import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailIsAlreadyInUseError } from '../../errors/user';

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

    it('should update user successfully (with password)', async () => {
        //arrange
        const { sut, passwordHasherAdapter } = makeSut();

        const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute');

        const password = faker.internet.password({ length: 6 });
        //act
        const result = await sut.execute(userId, {
            password,
        });

        //assert
        expect(executeSpy).toHaveBeenCalledWith(password);
        expect(result).toBe(user);
    });

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut();

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user);

        const email = faker.internet.email();
        //act
        const promise = sut.execute(userId, {
            email,
        });

        //assert
        await expect(promise).rejects.toThrow(
            new EmailIsAlreadyInUseError(email),
        );
    });

    it('should call UpdateUserRepository with correct params', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut();

        const executeSpy = jest.spyOn(updateUserRepository, 'execute');

        const updateUserParams = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password,
        };

        // act
        await sut.execute(userId, updateUserParams);

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId, {
            ...updateUserParams,
            password: 'hashed_password',
        });
    });

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut();

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // act
        const promise = sut.execute(userId, {
            email: user.email,
        });

        // assert
        await expect(promise).rejects.toThrow();
    });
});
