// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

module.exports = {

    getLambdaClient(config = {}) {
        if (!this.lambdaClient) {
            this.lambdaClient = new AWS.Lambda(config)
        }
        return this.lambdaClient;
    },

    invokeLambda(params) {
        const lambdaClient = this.getLambdaClient();
        return new Promise((resolve, reject) => {
            lambdaClient.invoke(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
};
