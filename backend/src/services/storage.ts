import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

const uploadRoot = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadRoot, { recursive: true });

export const saveUploadedFile = async (file: Express.Multer.File) => {
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = path.join(uploadRoot, `${Date.now()}-${safeName}`);
  await fs.promises.writeFile(filePath, file.buffer);
  return {
    path: filePath,
    filename: path.basename(filePath),
    originalName: safeName,
    mimeType: file.mimetype,
    size: file.size,
  };
};
