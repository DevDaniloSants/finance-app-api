import { faker } from '@faker-js/faker';
import { CreateUserUseCase } from './create-user';
import { EmailIsAlreadyInUseError } from '../../errors/user';

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'id_generator';
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const createUserRepository = new CreateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        );

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        };
    };

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
    };

    it('should successfully create a user', async () => {
        // arrange
        const { sut } = makeSut();

        //act
        const createdUser = await sut.execute(user);

        //assert
        expect(createdUser).toBeTruthy();
    });

    it('should throw an EmailIsAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        //arrange

        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        );

        //act
        const promise = sut.execute(user);

        //assert
        await expect(promise).rejects.toThrow(
            new EmailIsAlreadyInUseError(user.email),
        );
    });

    it('should call IdGeneratorAdaptar to generate a random id ', async () => {
        //arrange

        const { sut, idGeneratorAdapter, createUserRepository } = makeSut();

        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');

        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        );

        //act
        await sut.execute(user);

        //assert

        expect(idGeneratorSpy).toHaveBeenCalled();

        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            id: 'id_generator',
            password: 'hashed_password',
        });
    });

    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        //arrange

        const { sut, createUserRepository, passwordHasherAdapter } = makeSut();

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute');

        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        );

        //act
        await sut.execute(user);

        //assert

        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);

        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            id: 'id_generator',
            password: 'hashed_password',
        });
    });

    it('should throw if GetUserByEmailRepository throws', async () => {
        //arrange

        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(user);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if IdGeneratorAdapter throws', async () => {
        //arrange

        const { sut, idGeneratorAdapter } = makeSut();
        jest.spyOn(idGeneratorAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(user);

        //assert
        await expect(promise).rejects.toThrow();
    });

    it('should throw if PasswordHasherAdapter throws', async () => {
        //arrange

        const { sut, passwordHasherAdapter } = makeSut();
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        //act
        const promise = sut.execute(user);

        //assert
        await expect(promise).rejects.toThrow();
    });
});
