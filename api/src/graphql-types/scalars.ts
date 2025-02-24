import {GraphQLScalarType, Kind} from 'graphql';
// import {ObjectId} from 'mongodb';
const {ObjectId} = require('mongodb');

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  parseValue(value: string) {
    return new Date(value); // value from the client input variables
  },
  serialize(value: Date) {
    return value instanceof Date ? value.toISOString() : null; // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // value from the client query
    }
    return null;
  },
});

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Custom ObjectId scalar type',
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: string) {
    return value.toString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});
