import { CreateUserController } from '../../controller';
import { makeCreateUserController } from './user';

describe('User Controller Factories', () => {
    it('should return a valid MakeCreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
    });
});
