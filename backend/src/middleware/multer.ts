import multer from "multer";

export const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
