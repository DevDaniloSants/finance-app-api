import { CreateTransactionController } from '../../controller/index.js';
import {
    GetUserByIdRepository,
    PostgresCreateTransactionRepository,
} from '../../repositories/postgres/index.js';
import { CreateTransactionUseCase } from '../../use-cases/index.js';

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
