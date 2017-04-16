import fs from 'fs';
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import { exec, setAPIRoot } from '../src/commands';
import {
    NOW_PLAYING,
    SHUFFLING,
    NOT_SHUFFLING
} from '../src/slack-resp';
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
                    // todo i think this needs to actually throw an error
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

    describe('the /playing command', () => {
        const command = '/playing';

        context('when the spotify local server is running', () => {
            beforeEach((done) => {
                sinon.stub(request, 'get')
                    .callsFake(() =>
                        openMock('local/spotify/api/playing')
                    );
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('resolves with text for slack', (done) => {
                exec({ command })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(NOW_PLAYING({
                            name: 'Sax Attack',
                            artist: 'Kenny G',
                            requestedBy: 'Default Playlist'
                        }));
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('the /shuffle command', () => {

        const command = '/shuffle';

        context('when the player is shuffling', () => {

            beforeEach((done) => {
                sinon.stub(request, 'post')
                    .callsFake(() =>
                        openMock('local/spotify/api/shuffle/true')
                    );
                done();
            });

            afterEach((done) => {
                request.post.restore();
                done();
            });

            it('resolves with text for slack', (done) => {
                exec({ command })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(SHUFFLING);
                        done();
                    })
                    .catch(done);
            });
        });

        context('when the player is not shuffling', () => {

            beforeEach((done) => {
                sinon.stub(request, 'post')
                    .callsFake(() =>
                        openMock('local/spotify/api/shuffle/false')
                    );
                done();
            });

            afterEach((done) => {
                request.post.restore();
                done();
            });

            it('resolves with text for slack', (done) => {
                exec({ command })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(NOT_SHUFFLING);
                        done();
                    })
                    .catch(done);
            });
        });
    });
});
