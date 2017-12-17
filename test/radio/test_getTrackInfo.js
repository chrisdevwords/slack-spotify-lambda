const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const radio = require('../../src/radio');

const context = describe;

describe('The radio.getTrackInfo method', () => {

    context('With a valid access token', () => {

        const token = 'valid_token';

        context('With a valid track id', () => {

            const trackId = '6uVE8zYCeQBkfWOSpcGKMM';

            beforeEach(() => {
                sinon
                    .stub(request, 'get')
                    .resolves({
                        name: 'Thoughts On Outer Space',
                        popularity: 21,
                        artists: [
                            {
                                id: '4ny5u89tQVgw6OmFkj454M',
                                name: 'Dick Gregory',
                            }
                        ]
                    })
            });

            afterEach(() => {
                request.get.restore();
            });

            it('resolves a promise with track info', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then((trackInfo) => {
                        expect(trackInfo).to.be.an('object');
                        expect(trackInfo).to.not.be.empty;
                        done();
                    })
                    .catch(done);
            });

            it('resolves a promise with the track name', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(({ name }) => {
                        expect(name).to.equal('Thoughts On Outer Space');
                        done();
                    })
                    .catch(done);
            });

            it('resolves a promise with the artist name', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(({ artist }) => {
                        expect(artist).to.equal('Dick Gregory');
                        done();
                    })
                    .catch(done);
            });

            it('resolves a promise with an array of artist ids', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(({ artistIds }) => {
                        expect(artistIds).to.be.an('array');
                        expect(artistIds).to.have.lengthOf(1);
                        expect(artistIds).to.contain('4ny5u89tQVgw6OmFkj454M');
                        done();
                    })
                    .catch(done);
            });

             it('resolves a promise with the track popularity ranking', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(({ popularity }) => {
                        expect(popularity).to.equal(21);
                        done();
                    })
                    .catch(done);
            });

        });

        context('With an invalid track id', () => {

            const trackId = 'bloop';

            beforeEach(() => {
                sinon
                    .stub(request, 'get')
                    .rejects({
                        statusCode: 400,
                        error: {
                            error: {
                                message: 'Bad track id or something.'
                            }
                        }
                    })
            });

            afterEach(() => {
                request.get.restore();
            });

            it('rejects a promise with an error message', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(() => {
                        done(Error('This promise should be rejected.'))
                    })
                    .catch(({ message }) => {
                        expect(message).to.equal(radio.ERROR_INVALID_TRACK_URI);
                        done();
                    })
                    .catch(done);
            });

            it('rejects a promise with an statusCode 400', (done) => {
                 radio
                    .getTrackInfo(trackId)
                    .then(() => {
                        done(Error('This promise should be rejected.'))
                    })
                    .catch(({ statusCode }) => {
                        expect(statusCode).to.equal(400);
                        done();
                    })
                    .catch(done);
            });
        });

        context('With an track id not found', () => {

            const trackId = '4ny5u89tQVgw6OmFkjxxxx';

            beforeEach(() => {
                sinon
                    .stub(request, 'get')
                    .rejects({
                        statusCode: 404,
                        error: {
                            error: {
                                message: 'Bad track id or something.'
                            }
                        }
                    })
            });

            afterEach(() => {
                request.get.restore();
            });

            it('rejects a promise with an error message', (done) => {
                radio
                    .getTrackInfo(trackId)
                    .then(() => {
                        done(Error('This promise should be rejected.'))
                    })
                    .catch(({ message }) => {
                        expect(message).to.equal(radio.ERROR_INVALID_TRACK_URI);
                        done();
                    })
                    .catch(done);
            });

            it('rejects a promise with an statusCode 404', (done) => {
                 radio
                    .getTrackInfo(trackId)
                    .then(() => {
                        done(Error('This promise should be rejected.'))
                    })
                    .catch(({ statusCode }) => {
                        expect(statusCode).to.equal(404);
                        done();
                    })
                    .catch(done);
            });

        });
    });

    context('With an invalid access token', () => {
        const token = 'foo-bar-baz';
        const trackId = '6uVE8zYCeQBkfWOSpcGKMM';

        beforeEach(() => {
            sinon
                .stub(request, 'get')
                .rejects({
                    statusCode: 401,
                    error: {
                        error: {
                            message: 'Bad token or something.'
                        }
                    }
                })
        });

        afterEach(() => {
            request.get.restore();
        });

        it('rejects a promise with an error message', (done) => {
            radio
                .getTrackInfo(trackId)
                .then(() => {
                    done(Error('This promise should be rejected.'))
                })
                .catch(({ message }) => {
                    expect(message).to.equal(radio.ERROR_EXPIRED_TOKEN);
                    done();
                })
                .catch(done);
        });

        it('rejects a promise with an statusCode 401', (done) => {
             radio
                .getTrackInfo(trackId)
                .then(() => {
                    done(Error('This promise should be rejected.'))
                })
                .catch(({ statusCode }) => {
                    expect(statusCode).to.equal(401);
                    done();
                })
                .catch(done);
        });
    });

    context('With some other spotify type of spotify error', () => {
        const token = 'foo-bar-baz';
        const trackId = '6uVE8zYCeQBkfWOSpcGKMM';
        const apiErrorMessage = 'Something is wrong with Spotify.';

        beforeEach(() => {
            sinon
                .stub(request, 'get')
                .rejects({
                    statusCode: 503,
                    error: {
                        error: {
                            message: apiErrorMessage
                        }
                    }
                })
        });

        afterEach(() => {
            request.get.restore();
        });

        it('rejects a promise with the api error message', (done) => {
            radio
                .getTrackInfo(trackId)
                .then(() => {
                    done(Error('This promise should be rejected.'));
                })
                .catch(({ message }) => {
                    expect(message).to.equal(apiErrorMessage);
                    done();
                })
                .catch(done);
        });

        it('rejects a promise with the api statusCode', (done) => {
             radio
                .getTrackInfo(trackId)
                .then(() => {
                    done(Error('This promise should be rejected.'));
                })
                .catch(({ statusCode }) => {
                    expect(statusCode).to.equal(503);
                    done();
                })
                .catch(done);
        });
    });

    context('With some other error', () => {

        const token = 'foo-bar-baz';
        const trackId = '6uVE8zYCeQBkfWOSpcGKMM';
        const internalErrorMessage = 'Somethings wrong with the code.';
        const internalError = new Error(internalErrorMessage);

        beforeEach(() => {

            sinon
                .stub(request, 'get')
                .rejects(internalError);
        });

        afterEach(() => {
            request.get.restore();
        });

        it('rejects a promise with the error', (done) => {
            radio
                .getTrackInfo(trackId)
                .then(() => {
                    done(Error('This promise should be rejected.'));
                })
                .catch((error) => {
                    expect(error).to.equal(internalError);
                    done();
                })
                .catch(done);
        });
    });

});
