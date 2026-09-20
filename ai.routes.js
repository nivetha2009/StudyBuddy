import { Router } from 'express';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  getStatus,
  chat,
  generateNotes,
  generateSummary,
  generateMcqs,
  generateFlashcards,
  generateExamPack
} from '../controllers/aiController.js';

const router = Router();

router.get('/status', getStatus);
router.post('/chat', aiLimiter, chat);
router.post('/notes', aiLimiter, generateNotes);
router.post('/summary', aiLimiter, generateSummary);
router.post('/mcqs', aiLimiter, generateMcqs);
router.post('/flashcards', aiLimiter, generateFlashcards);
router.post('/exam-pack', aiLimiter, generateExamPack);

export default router;
