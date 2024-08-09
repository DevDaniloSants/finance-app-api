import { EmailIsAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
        this.idGeneratorAdapter = idGeneratorAdapter;
    }
    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email);

        if (userWithProvidedEmail) {
            throw new EmailIsAlreadyInUseError(createUserParams.email);
        }

        // criptografar senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        );

        // criar id do usuário
        const userId = await this.idGeneratorAdapter.execute();

        // inserir o usuário no banco

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        // chamar o repository

        const createdUser = await this.createUserRepository.execute(user);

        return createdUser;
    }
}
