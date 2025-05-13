import { googleVerify } from "../passportAuth";
import prisma from "../../prisma/prisma_config";

jest.mock("../../prisma/prisma_config", () => ({
  user: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

describe("GoogleStrategy verify function", () => {
  const mockDone = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle errors during database operations", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const mockProfile = {
      emails: [{ value: "erroruser@example.com" }],
    };

    await googleVerify("accessToken", "refreshToken", mockProfile, mockDone);

    expect(mockDone).toHaveBeenCalledWith(expect.any(Error), undefined);
  });
});
