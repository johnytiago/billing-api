import NotFoundException from "domain/shared/exceptions/NotFoundException";
import IRepository from "domain/transaction/Repository";
import TransactionID from "domain/transaction/valueObject/transactionId";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { Transactions } from "../mapping/transactions";

@injectable()
export default class PostgresRepository implements IRepository {
    constructor(
        @inject("infrastructure.transaction.readModel.dbal") private readonly connection: Repository<Transactions>,
     ) {}

     public async save(transaction: Transactions): Promise<void> {
        await this.connection.save(transaction);
    }

    public async get(id: TransactionID): Promise<Transactions> {
        try {
            return await this.connection.findOneOrFail(id.toString(), { cache: 60000 } );
        } catch (err) {

            if (err instanceof EntityNotFoundError) {
                throw new NotFoundException("Transaction not found");
            }

            throw err;
        }
    }
}
