import errorHandler from "./errorHandler";
import { CustomError } from "./CustomError";

describe("errorHandler", () => {
  const mockReq = {} as any;
  const mockNext = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("handles CustomError", () => {
    const err = new CustomError("Custom error", 400);
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Custom error" });
  });

  it("handles generic Error", () => {
    const err = new Error("Generic error");
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("An unexpected error occurred"),
        err,
      })
    );
  });
});
