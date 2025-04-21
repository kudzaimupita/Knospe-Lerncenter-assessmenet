import { NextFunction, Request, Response } from 'express';

import ApiError from '../utils/ApiError';
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import passport from 'passport';
import { roleRights } from '../config/roles';
import { userService } from '../services';

const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
  async (err: unknown, userDetails: User | false, info: unknown) => {
    if (err || info || !userDetails) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    const user = (await userService.getUserByEmail(userDetails.email)) as any;
    req.user = user;
    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        console.log(!hasRequiredRights, req.params.userId !== user.id, userDetails);
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
