import { UserNotFoundError } from '../../errors/user.js';

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUserByIdRepository,
        idGeretatorAdapter,
    ) {
        this.createTransactionRepository = createTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
        this.idGeretatorAdapter = idGeretatorAdapter;
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id;

        const user = await this.getUserByIdRepository.execute(userId);

        if (!user) {
            return new UserNotFoundError(userId);
        }

        const transactionId = await this.idGeretatorAdapter.execute();

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        });

        return transaction;
    }
}
