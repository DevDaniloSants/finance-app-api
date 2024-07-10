import { v4 as uuidv4 } from 'uuid';

import { UserNotFoundError } from '../../errors/user';

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id;

        const user = await this.getUserByIdRepository.execute(userId);

        if (!user) {
            return new UserNotFoundError(userId);
        }

        const transactionId = uuidv4();

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        });

        return transaction;
    }
}
