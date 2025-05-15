import upload, { storage } from "../multer";

describe("multer middleware", () => {
  it("should export a multer instance with memory storage", () => {
    expect(typeof upload.single).toBe("function");
    expect(storage.constructor.name).toBe("MemoryStorage");
  });

  it("should allow req.file to be mocked in downstream tests", () => {
    const req = {
      file: { originalname: "test.txt", buffer: Buffer.from("abc") },
    };
    expect(req.file.originalname).toBe("test.txt");
    expect(Buffer.isBuffer(req.file.buffer)).toBe(true);
  });
});
