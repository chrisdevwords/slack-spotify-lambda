
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';
import dotenv from 'dotenv';

import { exec, setAPIRoot } from '../src/commands';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;
const context = describe;

config.includeStack = true;

describe('The Slack commands for Spotify Local ', () => {

    beforeEach((done) => {
        // todo this will all be mocks
        setAPIRoot('http://localhost:5000');
        done();
    });

    describe('the /shuffle command', () => {

        const command = '/shuffle';

        context('when the player is shuffling', () => {

            it.skip('resolves with text for slack', (done) => {

                done();
            });
        });

        context('when the player is not shuffling', () => {

            it.skip('resolves with text for slack', (done) => {

                done();
            });
        });
    });
});
