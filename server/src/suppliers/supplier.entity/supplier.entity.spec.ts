import { Supplier } from "./supplier.entity";

describe('Supplier', () => {
  it('should be defined', () => {
    expect(new Supplier()).toBeDefined();
  });
});
