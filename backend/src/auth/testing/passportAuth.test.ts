import { Request, Response } from "express";
import { Role } from "@prisma/client";

import { requireAuth, requireRole } from "../passportAuth";

describe("requireAuth middleware", () => {
  it("should call next() if the user is authenticated", () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(true),
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if the user is not authenticated", () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(false),
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireRole middleware", () => {
  it("should call next() if the user has the required role", () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      user: { type: Role.ADMIN },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    requireRole([Role.ADMIN])(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if the user does not have the required role", () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      user: { type: Role.READER },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    requireRole([Role.ADMIN])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Insufficient permissions",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if the user is not authenticated", () => {
    const req = {
      isAuthenticated: jest.fn().mockReturnValue(false),
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    requireRole([Role.ADMIN])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
