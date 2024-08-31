import { PasswordHasherAdapter } from './password-hasher';
import { faker } from '@faker-js/faker';

describe('PasswordHasherAdapter', () => {
    it('should return a hashed passowrd', async () => {
        //arrange
        const sut = new PasswordHasherAdapter();
        const passowrd = faker.internet.password();

        //act
        const result = await sut.execute(passowrd);

        //assert
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result).not.toBe(passowrd);
    });
});
