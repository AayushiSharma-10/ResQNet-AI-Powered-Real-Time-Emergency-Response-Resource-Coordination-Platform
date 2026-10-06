import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { saveUploadedFile } from '../services/storage.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type.'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided.' });

    const fileInfo = await saveUploadedFile(req.file);
    const uploadRecord = await prisma.fileUpload.create({
      data: {
        filename: fileInfo.filename,
        originalName: fileInfo.originalName,
        mimeType: fileInfo.mimeType,
        sizeBytes: fileInfo.size,
        storageKey: fileInfo.path,
        uploadedById: req.user!.id,
      },
    });

    res.status(201).json({ upload: uploadRecord, path: fileInfo.path });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Upload failed.' });
  }
});

export default router;
