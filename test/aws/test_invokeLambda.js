const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const sinon = require('sinon');
const aws = require('../../src/aws');

const context = describe;

describe('The aws.invokeLambda method', () => {
    context('when successful', () => {

        const successResp = {
            StatusCode: 202,
            Payload: ''
        };

        beforeEach(() => {
            aws.getLambdaClient({
                region: 'us-east-1'
            });
            sinon.stub(aws.lambdaClient, 'invoke', (params, cb) => {
                cb(null, successResp);
            });
        });

        afterEach(() => {
            aws.lambdaClient.invoke.restore();
            delete aws.lambdaClient;
        });

        it('resolves a promise with response data', (done) => {
           const params = {
               FunctionName: 'arn:aws:lambda:us-east-1:0000000:function:testInvokeFunctioInvokee',
               InvocationType: 'Event',
               LogType: 'Tail'
           };
           aws.invokeLambda(params)
               .then((resp) => {
                   expect(resp).to.eq(successResp);
                   done();
               })
               .catch(done);
        });
    });

    context('when unsuccessful', () => {

        const expectedError = new Error('Something happened.');
        expectedError.code = 403;

        beforeEach(() => {
            aws.getLambdaClient({
                region: 'us-east-1'
            });
            sinon.stub(aws.lambdaClient, 'invoke', (params, cb) => {
                cb(expectedError);
            });
        });

        afterEach(() => {
            aws.lambdaClient.invoke.restore();
            delete aws.lambdaClient;
        });

        it('resolves a promise with response data', (done) => {
           const params = {
               FunctionName: 'arn:aws:lambda:us-east-1:000000000000:function:testInvokeFunctioInvokee',
               InvocationType: 'Event',
               LogType: 'Tail'
           };
           aws.invokeLambda(params)
               .then(() => {
                   done(Error('This promise should not resolve.'));
               })
               .catch((err) => {
                    expect(err).to.equal(expectedError);
                    done();
               })
               .catch(done);
        });
    });
});
