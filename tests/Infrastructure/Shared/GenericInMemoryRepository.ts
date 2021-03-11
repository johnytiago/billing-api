import NotFoundException from "Domain/Shared/Exceptions/NotFoundException";
import { ReadModel } from "hollywood-js";
import { inject, injectable } from "inversify";

@injectable()
export class GenericInMemoryRepository {
    constructor(
        @inject("infrastructure.test.inMemory.dbal") private readonly dbal: ReadModel.InMemoryReadModelRepository,
    ) {
    }

    public save(id: string, payload: any): void {
        this.dbal.save(id, payload);
    }

    public get(id: string): any {
        try {
            return this.dbal.oneOrFail(id);
        } catch (err) {
            throw new NotFoundException(err.message);
        }
    }
}
