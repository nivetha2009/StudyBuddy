import { Router } from 'express';
import { uploadSingleDocument } from '../middleware/upload.js';
import {
  uploadMaterial,
  listMaterials,
  getMaterial,
  deleteMaterial
} from '../controllers/materialController.js';

const router = Router();

router.post('/', uploadSingleDocument, uploadMaterial);
router.get('/', listMaterials);
router.get('/:id', getMaterial);
router.delete('/:id', deleteMaterial);

export default router;
