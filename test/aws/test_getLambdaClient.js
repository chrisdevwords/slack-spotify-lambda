const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect } = require('chai');
const aws = require('../../src/aws');

const context = describe;

describe('The aws.getLambdaClient method', () => {

    context('with a config', () => {

        afterEach(() => {
            delete aws.lambdaClient;
        });

        const awsConfig = {
            region: 'us-east-1'
        };

        it('creates a lambda client for the module', (done) => {
            expect(aws.lambdaClient).to.be.undefined;
            const client = aws.getLambdaClient(awsConfig);
            expect(client).to.equal(aws.lambdaClient);
            expect(aws.lambdaClient).to.not.be.undefined;
            done();
        });
    });

    context('without a config', () => {

        afterEach(() => {
            delete aws.lambdaClient;
        });

        it('creates a lambda client for the module', (done) => {
            const client = aws.getLambdaClient();
            expect(client).to.equal(aws.lambdaClient);
            done();
        });

        it('creates the lambda client only once ', (done) => {
            const client = aws.getLambdaClient();
            const client2 = aws.getLambdaClient();
            expect(client2).to.equal(client);
            done();
        });
    });
});
