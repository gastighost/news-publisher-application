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

describe("googleVerify", () => {
  const mockDone = jest.fn();
  const profile = {
    emails: [{ value: "test@example.com" }],
    name: { givenName: "Test", familyName: "User" },
    displayName: "testuser",
    photos: [{ value: "avatar.png" }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update and return existing user", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: 1,
      updated: true,
    });
    await googleVerify("a", "b", profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(null, { id: 1, updated: true });
  });

  it("should create and return new user if not found", async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 2 });
    await googleVerify("a", "b", profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(null, { id: 2 });
  });

  it("should handle errors", async () => {
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(new Error("fail"));
    await googleVerify("a", "b", profile, mockDone);
    expect(mockDone).toHaveBeenCalledWith(expect.any(Error), undefined);
  });
});
