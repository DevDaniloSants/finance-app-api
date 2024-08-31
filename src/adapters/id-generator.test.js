import { IdGeneratorAdapter } from './id-generator';

describe('IdGeneratorAdapter', () => {
    it('should return a random id', async () => {
        //arrange
        const sut = new IdGeneratorAdapter();
        const uuiRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i;

        //act
        const result = await sut.execute();

        //assert
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result).toMatch(uuiRegex);
    });
});
