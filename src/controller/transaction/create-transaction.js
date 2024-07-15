import validator from 'validator';

import {
    badRequest,
    created,
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    validateRequiredFields,
    requiredFieldIsMissingResponse,
} from '../helpers/index.js';

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ];

            const { ok: requiredFieldWasProvided, missingField } =
                validateRequiredFields(params, requiredFields);

            if (!requiredFieldWasProvided) {
                return requiredFieldIsMissingResponse(missingField);
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);

            if (!userIdIsValid) return invalidIdResponse();

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),

                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            );

            if (!amountIsValid)
                return badRequest({
                    message: 'The amount must be a valid currency',
                });

            const type = params.type.trim().toUpperCase();

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            );

            if (!typeIsValid)
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE of INVESTIMENT',
                });

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            });

            return created(transaction);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
