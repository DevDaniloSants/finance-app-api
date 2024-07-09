export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository;
    }
    async execute(userId) {
        const user = await this.deleteUserRepository.execute(userId);

        return user;
    }
}
