
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


const openMock = (filePath) => {

    const ROOT = '../';
    const file = PATH.resolve(__dirname, ROOT, `test/mock/${filePath}.json`)

    return new Promise((resolve, reject) => {
        fs.readFile(file, (error, data) => {
            if(error) {
                reject(error);
            } else {
                const json = JSON.parse(data.toString());
                if (json.error) {
                    reject({
                        error: {
                            error: json.error
                        },
                        statusCode : json.error.status
                    });
                } else {
                    resolve(json);
                }
            }
        });
    });
};

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
