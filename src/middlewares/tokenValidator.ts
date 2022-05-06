import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";

const MISSING_AUTH_MSG = "Missing authorization header";

export default function tokenValidator() {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: MISSING_AUTH_MSG });
      return;
    }

    const [, token] = authHeader.split(' ');

    try {
      const tokenPayload = verifyToken(token);
      req.user = tokenPayload;
    } catch {
      res.status(401).json({ message: MISSING_AUTH_MSG });
      return;
    }

    return next();
  };
}
