const { describe, it } = require('mocha');
const { expect, config } = require('chai');

const{ parseFormString } = require('../../src/util/parse');

const context = describe;


config.includeStack = true;

describe('The Parse Utils', () => {

    describe('#parseFormString', () => {

        const str = 'token=D8B7E8A429E&command=%2Ftest&' +
            'text=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F4o5jtBnLWT8OFkWNM2otW1';
        const testText = 'https://open.spotify.com/track/4o5jtBnLWT8OFkWNM2otW1';
        const testToken = 'D8B7E8A429E';
        const testCommand = '/test'

        context('with a form string', () => {
            it('extracts the token', (done) => {
                const { token } = parseFormString(str);
                expect(token).to.eq(testToken);
                done();
            });

            it('extracts a command value', (done) => {
                const { command } = parseFormString(str);
                expect(command).to.eq(testCommand);
                done();
            });

            it('can extract a url', (done) => {
                const { text } = parseFormString(str);
                expect(text).to.eq(testText);
                done();
            })
        });

        context('with an undefined string', () => {
            it('doesn\'t throw an error', () => {
                const obj = parseFormString();
                expect(obj).to.be.an('Object');
            });
        });
    });
});
