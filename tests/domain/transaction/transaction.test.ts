import Transaction from 'domain/transaction/transaction';
import { Container } from 'inversify';
import { Domain } from 'hollywood-js';
import TransactionWasCreated from 'domain/transaction/events/transactionWasCreated';
import Price from 'domain/transaction/valueObject/price';
import TransactionID from 'domain/transaction/valueObject/transactionId';

describe("Transaction", () => {
    test("Create transaction", () => {
        const price = new Price(2, 'EUR');
        const instance = Transaction.create(new TransactionID("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7"), "product", price);
        const stream = instance.getUncommitedEvents();

        expect(instance.getAggregateRootId()).toBe("ae081e7a-ec8c-4ff1-9de5-f70383fe03a7");
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect((stream.events[0].event as TransactionWasCreated).product).toBe('product');
        expect((stream.events[0].event as TransactionWasCreated).price).toBe(price);
        expect(instance.version()).toBe(0);
    });
});