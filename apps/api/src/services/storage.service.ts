import path from 'path';
import fs from 'fs';
import { put, del } from '@vercel/blob';

export interface StorageProvider {
    upload(file: Express.Multer.File, folder?: string): Promise<string>;
    delete(url: string): Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
    private uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async upload(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
        // file.buffer is available since we're using memory storage in multer
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${name}-${uniqueSuffix}${ext}`;
        const filePath = path.join(this.uploadDir, filename);

        await fs.promises.writeFile(filePath, file.buffer);

        // Return relative URL that matches the static file serve setup
        return `/uploads/${filename}`;
    }

    async delete(url: string): Promise<void> {
        // url is like /uploads/filename.ext
        const filename = path.basename(url);
        const filePath = path.join(this.uploadDir, filename);

        try {
            await fs.promises.unlink(filePath);
        } catch (error) {
            console.error(`Failed to delete local file ${filePath}:`, error);
        }
    }
}

class VercelBlobStorageProvider implements StorageProvider {
    async upload(file: Express.Multer.File, folder: string = ''): Promise<string> {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${folder ? folder + '/' : ''}${name}-${uniqueSuffix}${ext}`;

        const blob = await put(filename, file.buffer, {
            access: 'public',
            contentType: file.mimetype,
        });

        return blob.url;
    }

    async delete(url: string): Promise<void> {
        try {
            await del(url);
        } catch (error) {
            console.error(`Failed to delete Vercel Blob ${url}:`, error);
        }
    }
}

// Factory to choose provider
// We use Vercel Blob if running on Vercel AND token is present
const isVercel = process.env.VERCEL === '1';
const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

export const storageService = (isVercel && hasBlobToken)
    ? new VercelBlobStorageProvider()
    : new LocalStorageProvider();
