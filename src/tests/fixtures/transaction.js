import { faker } from '@faker-js/faker';

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    amount: +faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
};
