
import mocha from 'mocha';
import chai from 'chai';
// import request from 'request-promise-native';
// import sinon from 'sinon';

import { handler } from '../src';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('The Index Lambda Handler', () => {
    context('with a valid POST request', () => {
        it.skip('sends a response', (done) => {
            done(Error('test not complete'));
        });

        it.skip('sends 200', (done) => {
            done(Error('test not complete'));
        });
    });

    context('with an invalid POST request', () => {

        it.skip('sends a response', (done) => {
            done(Error('test not complete'));
        });

        it.skip('sends a 400', (done) => {
            done(Error('test not complete'));
        });
    });
});
