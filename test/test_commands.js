const PATH = require('path');
const fs = require('fs');
const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');

const { exec, setAPIRoot } = require('../src/commands');
const {
    ALBUM_ADDED,
    NOW_PLAYING,
    PL_SET,
    CURRENT_PL,
    SHUFFLING,
    NOT_SHUFFLING,
    PAUSED,
    RESUMED
} = require('../src/slack-resp');

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

    describe('the /play command', () => {
        const command = '/play';

        context('with a link to a spotify track', () => {

            const id = '0Q7aj2T90BmSCv2fLyUkTJ';
            const text = `spotify:track:${id}`;
            const user_name = 'Donald';

            beforeEach((done) => {
                const mock = `local/spotify/api/play/${id}`;
                sinon.stub(request, 'post')
                    .callsFake(() =>
                        openMock(mock)
                    );
                done();
            });

            afterEach((done) => {
                request.post.restore();
                done();
            });

            it('resolves with text for slack', (done) => {

                const expectedText = NOW_PLAYING(
                    {
                        name: 'Dancing In the Sheets',
                        artist: 'Shalamar',
                        requestedBy: user_name
                    }
                );

                exec({ command, text, user_name })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(expectedText);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('the /add command', () => {
        const command = '/add';

        context('with a link to a spotify album', () => {

            const id = '51XjnQQ9SR8VSEpxPO9vrW'
            const text = `spotify:album:${id}`;
            const user_name = 'Donald';

            beforeEach((done) => {
                const mock = `local/spotify/api/queue/album/${id}`;
                sinon.stub(request, 'post')
                    .callsFake(() =>
                        openMock(mock)
                    );
                done();
            });

            afterEach((done) => {
                request.post.restore();
                done();
            });

            it('resolves with text for slack', (done) => {

                const expectedText = ALBUM_ADDED(
                    1,
                    { name: 'Aja',  artist: 'Steely Dan'},
                    user_name
                );

                exec({ command, text, user_name })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(expectedText);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('the /playlist command', () => {

        const command = '/playlist';
        const id = '37i9dQZF1DX0uqkwkR49kK';
        const title = 'Prog Rock Monsters';
        const mock = `local/spotify/api/playlist/${id}`;

        context('with a playlist uri', () => {

            const text = `spotify:user:spotify:playlist:${id}`;
            const expectedResp = PL_SET({ title });

            beforeEach((done) => {
                sinon.stub(request, 'post')
                    .callsFake(() =>
                        openMock(mock)
                    );
                done();
            });

            afterEach((done) => {
                request.post.restore();
                done();
            });

            it('resolves with text for slack', (done) => {
                exec({ command, text })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(expectedResp);
                        done();
                    })
                    .catch(done);
            });
        });

        context('with an empty text message', () => {

            const text = '';
            const expectedResp = CURRENT_PL({ title });

            beforeEach((done) => {
                sinon.stub(request, 'get')
                    .callsFake(() =>
                        openMock(mock)
                    );
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('resolves with text for slack', (done) => {
                exec({ command, text })
                    .then((text) => {
                        expect(text).to.be.a('string');
                        expect(text).to.eq(expectedResp);
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

    describe('the /pause command', () => {

        const command = '/pause';

        beforeEach((done) => {
            sinon.stub(request, 'get')
                .callsFake(() =>
                    openMock('local/spotify/api/playing')
                );
            sinon.stub(request, 'post')
                .resolves({ paused: true });
            done();
        });

        afterEach((done) => {
            request.get.restore();
            request.post.restore();
            done();
        });

        it('resolves with text for slack', (done) => {
            exec({ command })
                .then((text) => {
                    expect(text).to.be.a('string');
                    expect(text).to.eq(PAUSED({
                        name: 'Sax Attack',
                        artist: 'Kenny G',
                        requestedBy: 'Default Playlist'
                    }));
                    done();
                })
                .catch(done);
        });
    });

    describe('the /resume command', () => {

        const command = '/resume';

        beforeEach((done) => {
            sinon.stub(request, 'get')
                .callsFake(() =>
                    openMock('local/spotify/api/playing')
                );
            sinon.stub(request, 'post')
                .resolves({ paused: false });
            done();
        });

        afterEach((done) => {
            request.get.restore();
            request.post.restore();
            done();
        });

        it('resolves with text for slack', (done) => {
            exec({ command })
                .then((text) => {
                    expect(text).to.be.a('string');
                    expect(text).to.eq(RESUMED({
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
