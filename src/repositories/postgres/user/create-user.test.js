import { prisma } from '../../../../prisma/prisma';
import { user } from '../../../tests';
import { CreateUserRepository } from './create-user';

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        //arrange
        const sut = new CreateUserRepository();

        //act
        const result = await sut.execute(user);

        //assert
        expect(result.id).toBe(user.id);
        expect(result.first_name).toBe(user.first_name);
        expect(result.last_name).toBe(user.last_name);
        expect(result.email).toBe(user.email);
        expect(result.password).toBe(user.password);
    });
    it('should call Prisma with correct params', async () => {
        //arrange
        const sut = new CreateUserRepository();
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'create');
        //act
        await sut.execute(user);

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({ data: user });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new CreateUserRepository();

        import.meta.jest
            .spyOn(prisma.user, 'create')
            .mockRejectedValueOnce(new Error());

        const promise = sut.execute(user);

        await expect(promise).rejects.toThrow();
    });
});
