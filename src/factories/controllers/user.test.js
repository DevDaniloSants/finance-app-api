import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controller';
import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user';

describe('User Controller Factories', () => {
    it('should return a valid MakeCreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
    });
    it('should return a valid MakeUpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController);
    });
    it('should return a valid MakeGetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        );
    });
});
