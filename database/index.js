const Knex = require('knex');
const knexfile = require('../knexfile');

const Objection = require('objection');
const Poll = require('./models/Poll');
const Choice = require('./models/Choice');

const knexEnv = process.env.DB_ENV || 'development';
const knex = Knex(knexfile[knexEnv]);

Objection.Model.knex(knex);

exports.Objection = Objection;
exports.Poll = Poll;
exports.Choice = Choice;
