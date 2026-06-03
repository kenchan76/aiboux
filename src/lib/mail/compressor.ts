const MIN_GZIP_SIZE_BYTES = 2 * 1024 * 1024;

const COMPRESSIBLE_MIME_TYPES = new Set([
  'application/csv',
  'application/json',
  'application/javascript',
  'application/ld+json',
  'application/sql',
  'application/typescript',
  'application/xml',
  'image/svg+xml',
  'text/calendar',
  'text/css',
  'text/csv',
  'text/html',
  'text/javascript',
  'text/markdown',
  'text/plain',
  'text/tab-separated-values',
  'text/xml',
  'application/x-ndjson',
  'application/x-sql',
]);

const COMPRESSIBLE_EXTENSIONS = new Set([
  '.csv',
  '.json',
  '.jsonl',
  '.log',
  '.md',
  '.ndjson',
  '.sql',
  '.svg',
  '.tsv',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);

const ALREADY_COMPRESSED_EXTENSIONS = new Set([
  '.7z',
  '.avif',
  '.br',
  '.bz2',
  '.gz',
  '.heic',
  '.jpeg',
  '.jpg',
  '.mp3',
  '.mp4',
  '.pdf',
  '.png',
  '.rar',
  '.webm',
  '.webp',
  '.xz',
  '.zip',
]);

type CompressionStreamConstructor = new (format: 'gzip' | 'deflate') => CompressionStream;

interface WindowWithCompressionStream extends Window {
  CompressionStream?: CompressionStreamConstructor;
}

function getLowerFileName(fileName: string): string {
  return fileName.trim().toLowerCase();
}

function getExtension(fileName: string): string {
  const lowerFileName = getLowerFileName(fileName);
  const dotIndex = lowerFileName.lastIndexOf('.');

  return dotIndex >= 0 ? lowerFileName.slice(dotIndex) : '';
}

function isAlreadyCompressed(file: File): boolean {
  const extension = getExtension(file.name);

  if (ALREADY_COMPRESSED_EXTENSIONS.has(extension)) {
    return true;
  }

  return /^(audio|image|video)\//.test(file.type) && file.type !== 'image/svg+xml';
}

function isCompressible(file: File): boolean {
  if (file.size < MIN_GZIP_SIZE_BYTES || isAlreadyCompressed(file)) {
    return false;
  }

  if (file.type.startsWith('text/') || COMPRESSIBLE_MIME_TYPES.has(file.type)) {
    return true;
  }

  return COMPRESSIBLE_EXTENSIONS.has(getExtension(file.name));
}

function supportsNativeGzip(): boolean {
  return typeof window !== 'undefined' && typeof (window as WindowWithCompressionStream).CompressionStream === 'function';
}

function toGzipFileName(fileName: string): string {
  return fileName.endsWith('.gz') ? fileName : `${fileName || 'aiboux-file'}.gz`;
}

async function gzipFile(file: File): Promise<File> {
  const CompressionStreamApi = (window as WindowWithCompressionStream).CompressionStream;

  if (!CompressionStreamApi) {
    return file;
  }

  const compressedStream = file.stream().pipeThrough(new CompressionStreamApi('gzip'));
  const compressedBlob = await new Response(compressedStream).blob();

  if (compressedBlob.size <= 0 || compressedBlob.size >= file.size) {
    return file;
  }

  return new File([compressedBlob], toGzipFileName(file.name), {
    type: 'application/gzip',
    lastModified: Date.now(),
  });
}

export async function compressFile(file: File): Promise<File> {
  if (!supportsNativeGzip() || !isCompressible(file)) {
    return file;
  }

  try {
    return await gzipFile(file);
  } catch {
    return file;
  }
}
