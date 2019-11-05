import { Application } from "hollywood-js";
import { inject, injectable } from "inversify";
import IRepository from "../../../domain/transaction/repository";
import Transaction from "../../../domain/transaction/transaction";
import Log from "../../../infrastructure/shared/audit/logger";
import CreateCommand from "./command";

@injectable()
export default class Create implements Application.ICommandHandler {
    constructor(
        @inject("logger") private readonly logger: Log,
        @inject("domain.transaction.repository") private readonly repository: IRepository,
    ) {}

    @Application.autowiring
    public async handle(command: CreateCommand): Promise<void | Application.IAppError> {
        const transaction: Transaction = Transaction.create(
            command.uuid,
            command.product,
            command.price,
        );

        await this.repository.save(transaction);
    }
}