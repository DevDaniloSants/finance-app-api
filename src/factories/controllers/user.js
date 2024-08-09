import {
    IdGeneratorAdapter,
    PasswordHasherAdapter,
} from '../../adapters/index.js';

import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
} from '../../controller/index.js';

import {
    CreateUserRepository,
    GetUserByEmailRepository,
    GetUserByIdRepository,
    UpdateUserRepository,
    DeleteUserRepository,
    GetUserBalanceRepository,
} from '../../repositories/postgres/index.js';

import {
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
} from '../../use-cases/index.js';

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const createUserRepository = new CreateUserRepository();

    const passwordHasherAdapter = new PasswordHasherAdapter();
    const idGeneratorAdapter = new IdGeneratorAdapter();

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    );

    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
};

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const updateUserRepository = new UpdateUserRepository();

    const passwordHasherAdapter = new PasswordHasherAdapter();

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasherAdapter,
    );

    const updatedUserControler = new UpdateUserController(updateUserUseCase);

    return updatedUserControler;
};

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new GetUserByIdRepository();

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    return getUserByIdController;
};

export const makeDeleteUserController = () => {
    const deleteUserRepository = new DeleteUserRepository();

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);

    const deleteUserController = new DeleteUserController(deleteUserUseCase);

    return deleteUserController;
};

export const makeGetUserBalanceController = () => {
    const getUserBalanceRepository = new GetUserBalanceRepository();
    const getUserByIdRepository = new GetUserByIdRepository();

    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    );

    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    );

    return getUserBalanceController;
};
