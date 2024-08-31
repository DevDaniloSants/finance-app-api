import { CreateUserController, UpdateUserController } from '../../controller';
import { makeCreateUserController, makeUpdateUserController } from './user';

describe('User Controller Factories', () => {
    it('should return a valid MakeCreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
    });
    it('should return a valid MakeUpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController);
    });
});
