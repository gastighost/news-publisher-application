import { localStrategy } from "../passportAuth";
import { loginUser } from "../../services/userService";

jest.mock("../../services/userService");

describe("Passport Local Strategy", () => {
  const mockDone = jest.fn();
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should call done with the user when login is successful", async () => {
    const mockUser = {
      id: 1,
      email: "testuser@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      type: "READER",
    };

    (loginUser as jest.Mock).mockResolvedValue(mockUser);

    const verifyFunction = (localStrategy as any)._verify;

    await verifyFunction("testuser@example.com", "password123", mockDone);

    expect(loginUser).toHaveBeenCalledWith(
      "testuser@example.com",
      "password123"
    );
    expect(mockDone).toHaveBeenCalledWith(null, mockUser);
  });

  it("should call done with false when login fails due to invalid credentials", async () => {
    (loginUser as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );

    const verifyFunction = (localStrategy as any)._verify;

    await verifyFunction("testuser@example.com", "wrongpassword", mockDone);

    expect(loginUser).toHaveBeenCalledWith(
      "testuser@example.com",
      "wrongpassword"
    );
    expect(mockDone).toHaveBeenCalledWith(new Error("Invalid credentials"));
  });

  it("should call done with an error if loginUser throws an unexpected error", async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const verifyFunction = (localStrategy as any)._verify;

    await verifyFunction("testuser@example.com", "password123", mockDone);

    expect(loginUser).toHaveBeenCalledWith(
      "testuser@example.com",
      "password123"
    );
    expect(mockDone).toHaveBeenCalledWith(new Error("Unexpected error"));
  });
});
