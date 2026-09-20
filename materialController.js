import { asyncHandler } from '../middleware/validate.js';
import { ApiError } from '../utils/ApiError.js';
import { extractDocumentText } from '../services/documentService.js';
import { materialStore } from '../services/materialStore.js';

export const uploadMaterial = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please choose a file to upload.', 'NO_FILE');
  }

  const { text, pages } = await extractDocumentText(req.file.path, req.file.originalname);

  const material = materialStore.create({
    name: req.file.originalname,
    type: req.file.mimetype,
    sizeBytes: req.file.size,
    storedPath: req.file.path,
    text,
    pages
  });

  res.status(201).json({ ok: true, data: material });
});

export const listMaterials = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: materialStore.list() });
});

export const getMaterial = asyncHandler(async (req, res) => {
  const material = materialStore.require(req.params.id);
  res.json({ ok: true, data: materialStore.toPublic(material) });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const removed = await materialStore.remove(req.params.id);
  if (!removed) throw ApiError.notFound();
  res.json({ ok: true, data: { id: req.params.id } });
});
