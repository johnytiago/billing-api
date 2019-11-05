import Transaction from '../../../../src/domain/transaction/transaction';
import { Container } from 'inversify';
import { Domain } from 'hollywood-js';
import TransactionWasCreated from '../../../../src/domain/transaction/events/transactionWasCreated';

describe("Transaction", () => {
    test("Create transaction", () => {
        const instance = Transaction.create("111", "product", "price");
        const stream = instance.getUncommitedEvents();

        expect(instance.getAggregateRootId()).toBe("111");
        expect(stream.events[0]).toBeInstanceOf(Domain.DomainMessage);
        expect((stream.events[0].event as TransactionWasCreated).product).toBe('product');
        expect((stream.events[0].event as TransactionWasCreated).price).toBe('price');
        expect(instance.version()).toBe(0);
    });
});