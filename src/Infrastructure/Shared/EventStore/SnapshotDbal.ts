import type { Domain, EventStore } from "hollywood-js";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { Snapshots } from "./Mapping/Snapshots";

@injectable()
export default class PostgresEventStoreSnapshotDBAL implements EventStore.ISnapshotStoreDBAL {

    constructor(
        @inject(
            "infrastructure.eventStore.postgresSnapshotsConnection",
        ) private readonly repository: Repository<Snapshots>,
    ) { }

    public async get(uuid: string): Promise<any> {

        const snapshot = await this.repository.findOne(uuid);

        return (snapshot && snapshot.uuid) ? snapshot.aggregateRoot : null;
    }

    public async store(entity: Domain.AggregateRoot): Promise<void> {
        await this.repository.save(Snapshots.fromAggregateRoot(entity));
    }
}
