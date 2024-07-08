export class GetUserByIdUseCase {
    constructor(GetUserByIdRepository) {
        this.GetUserByIdRepository = GetUserByIdRepository;
    }
    async execute(userId) {
        const user = await this.GetUserByIdRepository.execute(userId);

        return user;
    }
}
