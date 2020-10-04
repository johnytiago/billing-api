import NotFoundException from "domain/shared/exceptions/NotFoundException";
import IRepository from "domain/transaction/Repository";
import { Application } from "hollywood-js";
import { EventStore } from "hollywood-js";
import { inject, injectable } from "inversify";
import GetOne from "./Query";

@injectable()
export default class Get implements Application.IQueryHandler {
    constructor(
        @inject("infrastructure.transaction.readModel.repository") private readonly repository: IRepository,
    ) {}

    @Application.autowiring
    public async handle(request: GetOne): Promise<Application.IAppResponse | Application.IAppError> {
        try {
            const transaction = await this.repository.get(request.uuid);

            return {
                data: transaction,
                meta: [],
            };

        } catch (err) {
            if (err instanceof EventStore.AggregateRootNotFoundException) {
                throw new NotFoundException();
            }

            throw err;
        }
    }
}
