const {describe, it} = require('mocha');
const { expect, config } = require('chai');
const { extractFromUri } = require('../../src/util/parse');

const context = describe;


describe('#util.parse.extractFromUri', () => {
    context('With a link to a playlist', () => {

        const uri = 'spotify:user:awpoops:playlist:5PP1I2m0uxEBb3VKLhI7bP';

        it('can extract the playlist id', () => {
            const playlistId = extractFromUri(uri, 'playlist');
            expect(playlistId).to.eq('5PP1I2m0uxEBb3VKLhI7bP');
        });

        it('can extract the user id', () => {
            const userId = extractFromUri(uri, 'user');
            expect(userId).to.eq('awpoops');
        });
    });

    context('with an invalid string', () => {
        const uri = 'foo:bar:baz';

        it('returns an undefined for playlist', () => {
            const playlistId = extractFromUri(uri, 'playlist');
            expect(playlistId).to.eq(undefined);
        });
    });

    context('with an empty string', () => {
        const uri = '';

        it('returns an undefined for playlist', () => {
            const playlistId = extractFromUri(uri, 'playlist');
            expect(playlistId).to.eq(undefined);
        });
    });
});
