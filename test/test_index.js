
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import { handler } from '../src';
import testEnv from '../src/test-env-config';
import mockPlaying from './mock/local/spotify/api/playing.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;


const mockSlackBody = (token, user, text, command) =>
    `token=${token}&command=${encodeURIComponent(command)}` +
    `&user_name=${user}&text=${encodeURIComponent(text)}`;

describe('The Spotify Slack Lambda index.handler', () => {

    context('with a POST request', () => {

        const user = 'test';

        context('with a valid token', () => {

            const token = testEnv.SLACK_TOKEN;

            context('with a /playing command', () => {

                beforeEach((done) => {
                    sinon
                        .stub(request, 'get')
                        .returns(Promise.resolve(mockPlaying));
                    done();
                });

                afterEach((done) => {
                    request.get.restore();
                    done();
                });

                const command = '/playing';
                const text = '';
                const body = mockSlackBody(token, user, text, command);
                const event = { body };

                it('responds with a 200', (done) => {
                    handler(event, {}, (err, resp) => {
                        try {
                            expect(resp.statusCode)
                                .to.eq(200);
                            done()
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });

            context('with an invalid command', () => {

                const command = '/foo';
                const text = '';
                const body = mockSlackBody(token, user, text, command);
                const event = { body };

                it('responds with a 400', (done) => {
                    handler(event, {}, (err, resp) => {
                        try {
                            expect(resp.statusCode)
                                .to.eq(400);
                            done()
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });

        context('with an invalid token', () => {

            const token = 'bar';
            const command = '/playing';
            const text = '';
            const body = mockSlackBody(token, user, text, command);
            const event = { body };

            it('responds with a 401', (done) => {
                handler(event, {}, (err, resp) => {
                    try {
                        expect(resp.statusCode)
                            .to.eq(401);
                        done()
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });

        context('with no body', () => {

            const event = { };

            it('responds with a 401', (done) => {
                handler(event, {}, (err, resp) => {
                    try {
                        expect(resp.statusCode)
                            .to.eq(401);
                        done()
                    } catch (err) {
                        done(err);
                    }
                });
            });
        });
    });
});
