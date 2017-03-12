
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';
import dotenv from 'dotenv';

import { handler } from '../src';
import mockPlaying from './mock/local/spotify/api/playing.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

dotenv.config({
    path: PATH.resolve( __dirname, '../', 'test/.env')
});

const mockSlackBody = (token, user, text, command) =>
    `token=${token}&command=${encodeURIComponent(command)}` +
    `&user_name=${user}&text=${encodeURIComponent(text)}`;

describe('The Spotify Slack Lambda index.handler', () => {

    context('with a POST request', () => {

        const user = 'test';

        context('with a valid token', () => {

            const token = process.env.SLACK_TOKEN;

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

        context('with an unexpected body', () => {

            const body = JSON.stringify({
                token: process.env.SLACK_TOKEN,
                user_name: user,
                stuff : [1, 2, 3]
            });
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
    });
});
