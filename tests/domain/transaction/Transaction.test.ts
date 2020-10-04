import TransactionWasCreated from "domain/transaction/events/TransactionWasCreated";
import Transaction from "domain/transaction/Transaction";
import Price from "domain/transaction/valueObject/price";
import TransactionID from "domain/transaction/valueObject/transactionId";
import { Domain } from "hollywood-js";

describe("Transaction", () => {
    test("Create transaction", () => {
        const price = new Price(2, "EUR");
        const transactionID = new TransactionID("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
        const instance = Transaction.create(transactionID, "product", price);
        const stream = instance.getUncommittedEvents();

        expect(instance.getAggregateRootId()).toBe("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect((stream.events[0].event as TransactionWasCreated).product).toBe("product");
        expect((stream.events[0].event as TransactionWasCreated).price).toBe(price);
        expect(instance.version()).toBe(0);
    });
});
