import typeOf from 'type-of';
import assert from './assert';

/**
 * Validation rules.
 */
const rules = [
  {
    name: 'anonymousId',
    types: ['string', 'number'],
  },
  {
    name: 'category',
    types: 'string',
  },
  {
    name: 'context',
    types: 'object',
  },
  {
    name: 'properties',
    types: 'object',
  },
  {
    name: 'traits',
    types: 'object',
  },
  {
    name: 'integrations',
    types: 'object',
  },
  {
    name: 'event',
    types: 'string',
  },
  {
    name: 'groupId',
    types: ['string', 'number'],
  },
  {
    name: 'name',
    types: 'string',
  },
  {
    name: 'previousId',
    types: ['string', 'number'],
  },
  {
    name: 'timestamp',
    types: 'date',
  },
  {
    name: 'userId',
    types: ['string', 'number'],
  },
];

/**
 * Validate an options `obj`.
 *
 * @param {Object} obj
 */
export default function validate(obj) {
  assert(typeOf(obj) === 'object', 'You must pass a message object.');

  rules.forEach((rule) => {
    if (obj[rule.name]) {
      const types = [].concat(rule.types);

      assert(
        types.some(type => typeOf(obj[rule.name]) === type),
        `"${rule.name}" must be ${types.join(' or ')}.`
      );
    }
  });
}
