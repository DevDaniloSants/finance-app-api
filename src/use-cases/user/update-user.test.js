import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailIsAlreadyInUseError } from '../../errors/user';
import { user } from '../../tests/';

describe('UpdateUserUseCase', () => {
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

    it('should update user successfully (without email and password', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(user.id, {
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
        const result = await sut.execute(user.id, {
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
        const result = await sut.execute(user.id, {
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

        const id = faker.string.uuid();
        //act
        const promise = sut.execute(id, {
            email: user.email,
        });

        //assert
        await expect(promise).rejects.toThrow(
            new EmailIsAlreadyInUseError(user.email),
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
        await sut.execute(user.id, updateUserParams);

        // assert
        expect(executeSpy).toHaveBeenCalledWith(user.id, {
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
        const promise = sut.execute(user.id, {
            email: user.email,
        });

        // assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut();

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // act
        const promise = sut.execute(user.id, {
            password: user.password,
        });

        // assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if UpdateUserRepository throws', async () => {
        // arrange
        const { sut, updateUserRepository } = makeSut();

        jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const updateUserParams = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password,
        };

        // act
        const promise = sut.execute(user.id, updateUserParams);

        // assert
        await expect(promise).rejects.toThrow();
    });
});
