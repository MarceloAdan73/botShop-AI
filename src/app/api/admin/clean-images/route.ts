import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { readdir, unlink } from 'fs/promises';

const VALID_JPEG_HEADER = [0xFF, 0xD8];
const VALID_JPEG_FOOTER = [0xFF, 0xD9];
const VALID_PNG_HEADER = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

async function isValidImage(filePath: string): Promise<boolean> {
  try {
    const buffer = await readFile(filePath);
    const ext = filePath.toLowerCase();
    
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
      if (buffer.length < 3) return false;
      if (buffer[0] !== VALID_JPEG_HEADER[0] || buffer[1] !== VALID_JPEG_HEADER[1]) return false;
      if (buffer[buffer.length - 2] !== VALID_JPEG_FOOTER[0] || buffer[buffer.length - 1] !== VALID_JPEG_FOOTER[1]) return false;
      return true;
    }
    
    if (ext.endsWith('.png')) {
      if (buffer.length < 8) return false;
      for (let i = 0; i < VALID_PNG_HEADER.length; i++) {
        if (buffer[i] !== VALID_PNG_HEADER[i]) return false;
      }
      return true;
    }
    
    if (ext.endsWith('.gif')) {
      if (buffer.length < 6) return false;
      if (buffer[0] !== 0x47 || buffer[1] !== 0x49 || buffer[2] !== 0x46) return false;
      return true;
    }
    
    if (ext.endsWith('.webp')) {
      if (buffer.length < 12) return false;
      if (buffer[0] !== 0x52 || buffer[1] !== 0x49 || buffer[2] !== 0x46 || buffer[3] !== 0x46) return false;
      if (buffer[8] !== 0x57 || buffer[9] !== 0x45 || buffer[10] !== 0x42 || buffer[11] !== 0x50) return false;
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const productsDir = join(process.cwd(), 'public', 'productos');
    let files: string[] = [];
    
    try {
      files = await readdir(productsDir);
    } catch {
      return NextResponse.json({ deleted: [], message: 'No images found' });
    }
    
    const deleted: string[] = [];
    
    for (const file of files) {
      const filePath = join(productsDir, file);
      const isValid = await isValidImage(filePath);
      
      if (!isValid) {
        await unlink(filePath);
        deleted.push(file);
        console.log(`Deleted corrupted image: ${file}`);
      }
    }
    
    return NextResponse.json({ 
      deleted,
      message: deleted.length === 0 ? 'All images are valid' : `Deleted ${deleted.length} corrupted image(s)`
    });
  } catch (error) {
    console.error('Error cleaning images:', error);
    return NextResponse.json({ error: 'Error cleaning images' }, { status: 500 });
  }
}
