import passport from "../passportAuth";
import prisma from "../../prisma/prisma_config";

jest.mock("../../prisma/prisma_config", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

describe("passport.serializeUser", () => {
  it("should call done with user id", () => {
    const done = jest.fn();
    (passport as any)._serializers[0]({ id: 42 }, done);
    expect(done).toHaveBeenCalledWith(null, 42);
  });
});

describe("passport.deserializeUser", () => {
  const done = jest.fn();

  it("should call done with user when found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    await (passport as any)._deserializers[0](1, done);
    expect(done).toHaveBeenCalledWith(null, { id: 1 });
  });

  it("should call done with error when there is an error", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("fail"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await (passport as any)._deserializers[0](1, done);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error in deserializeUser:",
      expect.any(Error)
    );
    expect(done).toHaveBeenCalledWith(expect.any(Error), null);
    consoleSpy.mockRestore();
  });
});
