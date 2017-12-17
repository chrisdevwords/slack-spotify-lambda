const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const { PL_PENDING } = require('../../src/slack-resp');
const radio = require('../../src/radio');
const aws = require('../../src/aws');

const context = describe;

describe('#The radio.createStation method', () => {

    context('With a valid access token and valid track uri', () => {

        const trackName = 'Skin Tight';
        const artist = 'Ohio Players';
        const text = 'spotify:track:5zOzLQX0cfWFVmMevcvYBD';
        const response_url = 'http://foo.bar.com';

        beforeEach(() => {

            sinon
                .stub(radio, 'getTrackInfo')
                .resolves({
                    artist,
                    name: trackName
                });

            sinon
                .stub(aws, 'invokeLambda')
                .resolves({})
        });

        afterEach(() => {
            radio.getTrackInfo.restore();
            aws.invokeLambda.restore();
        });

        it('resolves with a message for slack', (done) => {
            radio.createRadioStation(text, response_url)
                .then(message => {
                    expect(message)
                        .to.eq(PL_PENDING({ name: trackName, artist}));
                    done();
                })
                .catch(done);
        });
    });

    context('With a valid access token but invalid track uri', () => {
        beforeEach(() => {
            sinon
                .stub(radio, 'getTrackInfo')
                .rejects({
                    message: radio.ERROR_INVALID_TRACK_URI
                })
        });

        afterEach(() => {
            radio.getTrackInfo.restore();
        });

        it('Rejects with a message for slack', (done) => {
            radio.createRadioStation('')
                .then(() => {
                    done(Error('Promise should be rejected.'));
                })
                .catch(({ message }) => {
                    expect(message)
                        .to.eq(radio.ERROR_INVALID_TRACK_URI);
                    done();
                })
                .catch(done);
        });
    });

    context('With an invalid access token', () => {
        beforeEach(() => {
            sinon
                .stub(radio, 'getTrackInfo')
                .rejects({
                    message: radio.ERROR_EXPIRED_TOKEN
                })
        });

        afterEach(() => {
            radio.getTrackInfo.restore();
        });

        it('Rejects with a message for slack', (done) => {
            radio.createRadioStation('')
                .then(() => {
                    done(Error('Promise should be rejected.'));
                })
                .catch(({ message }) => {
                    expect(message)
                        .to.eq(radio.ERROR_EXPIRED_TOKEN);
                    done();
                })
                .catch(done);
        });
    });

    context('When an error occurs invoking the lambda', () => {
        beforeEach(() => {

            const trackName = 'Skin Tight';
            const artist = 'Ohio Players';

            sinon
                .stub(radio, 'getTrackInfo')
                .resolves({
                    artist,
                    name: trackName
                });

            sinon
                .stub(aws, 'invokeLambda')
                .rejects(new Error('AWS is busted.'))

        });

        afterEach(() => {
            radio.getTrackInfo.restore();
            aws.invokeLambda.restore();
        });

        it('sends the error message to slack', (done) => {
            radio
                .createRadioStation('')
                .then(() => {
                    done(Error('Promise should be rejected.'));
                })
                .catch(({ message }) => {
                    expect(message)
                        .to.eq('AWS is busted.');
                    done();
                })
                .catch(done);
        });
    });
});
