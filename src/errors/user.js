export class EmailIsAlreadyInUseError extends Error {
    constructor(email) {
        super(`The e-mail ${email} is already in use.`);
        this.name = 'EmailIsAlreadyInUseError';
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with id ${userId} not found.`);
        this.name = 'UserNotFoundError ';
    }
}
