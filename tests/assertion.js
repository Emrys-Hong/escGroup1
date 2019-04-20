var assert = require('assert');
const { expect } = require('chai');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    },
    it('should return true for the following assertions:', function() {
        expect(42).to.equal(42);
        expect("foo").to.be.a('string');
        expect([1, 2, 3]).to.have.lengthOf(3);
    }));
  });
});
