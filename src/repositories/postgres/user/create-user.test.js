import { user } from '../../../tests';
import { CreateUserRepository } from './create-user';

describe('CreateUserRepository', () => {
    it('should successfully create an user', async () => {
        //arrange
        const sut = new CreateUserRepository();

        //act
        const result = await sut.execute(user);

        //assert
        expect(result).not.toBeNull();
    });
});
