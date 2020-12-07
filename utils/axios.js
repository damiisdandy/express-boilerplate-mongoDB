const axios = require('axios').default;
const { paystack } = require('../config');

const instance = axios.create({
  baseURL: 'https://api.paystack.co',
});

instance.defaults.headers.common.authorization = `Bearer ${paystack.api_key}`;

module.exports = instance;
