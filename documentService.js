import fs from 'node:fs/promises';
import path from 'node:path';
import { ApiError } from '../utils/ApiError.js';
import { normalizeText } from '../utils/text.js';
import { logger } from '../utils/logger.js';

/**
 * Document processing pipeline: receive -> extract -> normalize.
 * Each format has its own extractor so new formats can be added
 * without touching the rest of the application.
 */

async function extractPdf(filePath) {
  const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
  const buffer = await fs.readFile(filePath);
  const parsed = await pdfParse(buffer);
  return { text: parsed.text, pages: parsed.numpages };
}

async function extractDocx(filePath) {
  const { default: mammoth } = await import('mammoth');
  const { value } = await mammoth.extractRawText({ path: filePath });
  return { text: value };
}

async function extractPptx(filePath) {
  const { default: AdmZip } = await import('adm-zip');
  const zip = new AdmZip(filePath);

  const slideEntries = zip
    .getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
    .sort((a, b) => {
      const num = (name) => Number(name.match(/slide(\d+)\.xml/)[1]);
      return num(a.entryName) - num(b.entryName);
    });

  const slides = slideEntries.map((entry, index) => {
    const xml = entry.getData().toString('utf8');
    const runs = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((match) =>
      match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
    );
    return `--- Slide ${index + 1} ---\n${runs.join('\n')}`;
  });

  return { text: slides.join('\n\n'), pages: slides.length };
}

async function extractText(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return { text };
}

const extractors = {
  '.pdf': extractPdf,
  '.docx': extractDocx,
  '.pptx': extractPptx,
  '.txt': extractText,
  '.md': extractText
};

export async function extractDocumentText(filePath, originalName) {
  const ext = path.extname(originalName || filePath).toLowerCase();

  if (ext === '.doc' || ext === '.ppt') {
    throw ApiError.badRequest(
      'Older .doc and .ppt files cannot be read. Please save the file as .docx, .pptx or PDF and upload it again.',
      'LEGACY_OFFICE_FORMAT'
    );
  }

  const extractor = extractors[ext];
  if (!extractor) {
    throw ApiError.badRequest('Please upload a supported file: PDF, PPTX, DOCX, TXT or MD.', 'UNSUPPORTED_FILE_TYPE');
  }

  let result;
  try {
    result = await extractor(filePath);
  } catch (error) {
    if (error?.isApiError) throw error;
    logger.error('Extraction failed', error);
    throw ApiError.badRequest('Your file could not be processed. It may be scanned, protected or damaged.', 'EXTRACTION_FAILED');
  }

  const text = normalizeText(result.text || '');

  if (text.length < 40) {
    throw ApiError.badRequest(
      'We could not find readable text in that file. Scanned or image-only documents are not supported yet.',
      'NO_TEXT_FOUND'
    );
  }

  return { text, pages: result.pages || null };
}
