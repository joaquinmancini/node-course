const sinon = require("sinon"),
  expect = require("chai").expect,
  testObject = {
    salute: (name) => {
      return `Hola ${name}!`;
    },
    execute: (fn, param) => {
      return fn(param);
    }
  };

describe("Sinon tests", () => {

  before(() => {
    // Code to be executed before ALL tests (just once)
    // Used to set tests initial values and/or modules instantiation
  });
  after(() => {
    // Code to be executed after ALL tests (just once)
    // Used to clean up all tests results (possible leftovers or garbage)
    sinon.restore();
  });
  beforeEach(() => {
    // Code to be executed before EACH tests (once per test)
    // Same as before() but for each runned test
  });
  afterEach(() => {
    // Code to be executed after EACH test (once per test)
    // Same as after() but for each runned test
  });

  describe("sinon.spy()", () => {

    it("testObject.execute() should call the given function", () => {
      const spy = sinon.spy();

      testObject.execute(spy, "Diego");

      expect(spy.calledOnce).to.eql(true);
      expect(spy.getCall(0).args[0]).to.eql("Diego");
    });

    it("testObject.salute() should be called twice", () => {
      const spy = sinon.spy(testObject, "salute");

      testObject.salute("Diego");
      testObject.execute(testObject.salute, "Manuel");

      testObject.salute.restore();
      expect(spy.calledTwice).to.eql(true);
      expect(spy.withArgs("Diego").calledOnce).to.eql(true);
      expect(spy.withArgs("Manuel").calledOnce).to.eql(true);
      expect(spy.getCall(0).args[0]).to.eql("Diego");
      expect(spy.getCall(1).args[0]).to.eql("Manuel");
    });

  });

  describe("sinon.stub()", () => {

    it("testObject.execute() should return the value given at stub().returns()", () => {
      const stub = sinon.stub().returns(22),
        result = testObject.execute(stub, "Diego");

      expect(result).to.eql(22);
      expect(stub.calledOnce).to.eql(true);
      expect(stub.getCall(0).args[0]).to.eql("Diego");
    });

    it("testObject.execute() should return different values on consecutive calls", () => {
      const stub = sinon.stub();

      stub.onCall(0).returns(11);
      stub.onCall(1).returns(22);
      stub.returns(33);

      expect(testObject.execute(stub, "something")).to.eql(11);
      expect(testObject.execute(stub, "whatever")).to.eql(22);
      expect(testObject.execute(stub, "anything")).to.eql(33);
      expect(testObject.execute(stub, "nothing")).to.eql(33);
      expect(stub.callCount).to.eql(4);
    });

    it("testObject.salute() should call the function defined at stub().callsFake()", () => {
      const stub = sinon.stub(testObject, "salute").callsFake((name) => {
          return `Chau ${name}!`;
        }),
        result1 = testObject.salute("Diego"),
        result2 = testObject.execute(testObject.salute, "Manuel");

      testObject.salute.restore();
      expect(result1).to.eql("Chau Diego!");
      expect(result2).to.eql("Chau Manuel!");
      expect(stub.calledTwice).to.eql(true);
      expect(stub.withArgs("Diego").calledOnce).to.eql(true);
      expect(stub.withArgs("Manuel").calledOnce).to.eql(true);
      expect(stub.getCall(0).args[0]).to.eql("Diego");
      expect(stub.getCall(1).args[0]).to.eql("Manuel");
    });

  });

  describe("sinon.mock()", () => {

    it("testObject.salute() should be called twice", () => {
      const mock = sinon.mock(testObject);

      mock.expects("salute").twice().returns(22);
      mock.expects("execute").once().callsFake((fn) => {
        fn();
      });

      testObject.salute("Diego");
      testObject.execute(testObject.salute, "Manuel");

      mock.verify();
    });

  });

  describe("sinon.fake()", () => {

    it("testObject.execute() should return the value given at sinon.fake.returns()", () => {
      const fake = sinon.fake.returns(22),
        result = testObject.execute(fake, "Diego");
      
      expect(result).to.eql(22);
      expect(fake.calledOnce).to.eql(true);
      expect(fake.getCall(0).args[0]).to.eql("Diego");
    });

    it("testObject.salute() should return the value given at sinon.fake.returns() using sinon.replace()", () => {
      const fake = sinon.fake.returns(22);
      sinon.replace(testObject, "salute", fake);
      
      expect(testObject.salute("Diego")).to.eql(22);
      expect(fake.calledOnce).to.eql(true);
      expect(fake.getCall(0).args[0]).to.eql("Diego");
    });

    it("testObject.execute() should return the error given at sinon.fake.throws()", () => {
      const error = new Error("ups!"),
        fake = sinon.fake.throws(error);
      
      try {
        testObject.execute(fake);
        throw new Error("Should be failed!");
      } catch (err) {
        expect(err).to.eql(error);
        expect(fake.calledOnce).to.eql(true);
      }
    });

    it("testObject.execute() should return the value given at sinon.fake()", () => {
      const fake = sinon.fake(() => {
          return 22;
        }),
        result = testObject.execute(fake, "Diego");
      
      expect(result).to.eql(22);
      expect(fake.calledOnce).to.eql(true);
      expect(fake.getCall(0).args[0]).to.eql("Diego");
    });

  });

});
