import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserController,
    UpdateTransactionController,
} from '../../controller/index.js';

import {
    DeleteTransactionRepository,
    GetTransactionsByUserIdRepository,
    GetUserByIdRepository,
    PostgresCreateTransactionRepository,
    UpdateTransactionRepository,
} from '../../repositories/postgres/index.js';

import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();

    const getUserByIdRepository = new GetUserByIdRepository();

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    );

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    );

    return createTransactionController;
};

export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserRepository =
        new GetTransactionsByUserIdRepository();
    const getUserByIdRepository = new GetUserByIdRepository();

    const getTransactionsByUserUseCase = new GetTransactionsByUserUseCase(
        getTransactionsByUserRepository,
        getUserByIdRepository,
    );

    const getTransactionsByUserController = new GetTransactionsByUserController(
        getTransactionsByUserUseCase,
    );

    return getTransactionsByUserController;
};

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository = new UpdateTransactionRepository();

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    );

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    );

    return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository = new DeleteTransactionRepository();
    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    );

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    );

    return deleteTransactionController;
};
