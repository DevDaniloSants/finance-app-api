import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
    DeleteUserController,
} from '../../controller/index.js';

import {
    CreateUserRepository,
    GetUserByEmailRepository,
    GetUserByIdRepository,
    UpdateUserRepository,
    DeleteUserRepository,
} from '../../repositories/postgres/index.js';

import {
    CreateUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
} from '../../use-cases/index.js';

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const createUserRepository = new CreateUserRepository();

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
    );

    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
};

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository();

    const updateUserRepository = new UpdateUserRepository();

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
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
