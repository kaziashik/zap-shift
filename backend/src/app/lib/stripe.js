const stripe = require('stripe');
const config = require('../config');

const stripeClient = stripe(config.stripeSecretKey);

module.exports = stripeClient;
