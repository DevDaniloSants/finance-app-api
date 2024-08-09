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
            return 'password_hasher';
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
});
