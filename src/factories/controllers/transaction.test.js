import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '../../controller';
import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
} from './transaction';

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        );
    });
    it('should return a valid GetTransactionsByUserIdController instance', () => {
        expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        );
    });
});
