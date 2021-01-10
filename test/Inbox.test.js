const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts, inbox;
const INITIAL_MESSAGE = "Hello Ethereum Network";

beforeEach(async () => {
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    //Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: '1000000' })

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
        console.log(inbox.options.address)
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, INITIAL_MESSAGE);
        console.log(message);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('Change the world')
            .send({from: accounts[0] });
        const message = await inbox.methods.message().call();
        console.log(message);
        assert.strictEqual(message, 'Change the world');
    });
});

/* class Car {
    park(){
        return "stopped";
    }

    drive(){
        return "asd";
    }
}

let car;

beforeEach(() => {
    car = new Car();
});

describe('Car', () => {
    it('can park', () => {
        //const car = new Car();
        assert.strictEqual(car.park(), 'stopped');
    });

    it('can drive', () => {
        //const car = new Car();
        assert.strictEqual(car.drive(), 'asd');
    });
}); */