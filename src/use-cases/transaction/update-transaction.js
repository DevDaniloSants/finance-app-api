export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
    }

    async execute(transactionId, updateTransactionParams) {
        const transaction = this.updateTransactionRepository.execute(
            transactionId,
            updateTransactionParams,
        );

        return transaction;
    }
}
