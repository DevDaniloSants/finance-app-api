import { faker } from '@faker-js/faker';

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName,
    date: faker.date.anytime(),
    type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    amount: faker.finance.amount(),
};
