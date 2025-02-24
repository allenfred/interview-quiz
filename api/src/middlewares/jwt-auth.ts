/* eslint-disable */

import {ResolverData} from '@loopback/graphql';
import {type MiddlewareFn} from 'type-graphql';
import {expressjwt} from 'express-jwt';

const jwtMiddleware = expressjwt({
  secret: 'test',
  algorithms: ['HS256'],
});

export const ResolveAuthMiddleware: MiddlewareFn<any> = async (
  {context}: ResolverData<any>,
  next,
) => {
  return new Promise((resolve, reject) => {
    jwtMiddleware(context.req, context.res, err => {
      if (err) {
        return reject(new Error('Invalid token'));
      }
      context.user = context.req.auth;
      resolve(next());
    });
  });
};
