import ConflictException from "domain/shared/exceptions/ConflictException";
import Transaction from "domain/transaction/Transaction";
import { Application, EventStore } from "hollywood-js";
import Probe from "infrastructure/shared/audit/probe";
import { inject, injectable } from "inversify";
import type { Counter } from "prom-client";
import CreateCommand from "./Command";

@injectable()
export default class Create implements Application.ICommandHandler {
    private readonly conflicts: Counter<string>;
    private readonly error: Counter<string>;
    private readonly success: Counter<string>;

    constructor(
        @inject(
            "infrastructure.transaction.eventStore",
        ) private readonly writeModel: EventStore.EventStore<Transaction>,
    ) {
        this.error = Probe.counter({ name: "transaction_create_error", help: "Counter of the incremental transaction create errors"});
        this.conflicts = Probe.counter({ name: "transaction_create_conflict", help: "Counter of the incremental transaction create conflicts"});
        this.success = Probe.counter({ name: "transaction_create_success", help: "Counter of the incremental transaction create success"});
    }

    @Application.autowiring
    public async handle(command: CreateCommand): Promise<void | Application.IAppError> {

        try {
            await this.writeModel.load(command.uuid.toString());
            this.conflicts.inc(1);
            this.error.inc(1);
            throw new ConflictException("Already exists");
        } catch (err) {
            if (!(err instanceof EventStore.AggregateRootNotFoundException)) {
                this.error.inc(1);
                throw err;
            }
        }

        const transaction: Transaction = Transaction.create(
            command.uuid,
            command.product,
            command.price,
        );

        await this.writeModel.save(transaction);
        this.success.inc(1);
    }
}
