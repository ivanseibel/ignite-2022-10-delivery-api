import fs from 'fs';
import path from 'path';

import upload from '@config/upload';

import { IStorageProvider } from '../IStorageProvider';

class LocalStorageProvider implements IStorageProvider {
  async saveFile(file: string, folder: string): Promise<string> {
    fs.promises.rename(
      path.resolve(upload.tmpFolder, file),
      path.resolve(upload.tmpFolder, folder, file)
    );

    return file;
  }
  async deleteFile(file: string, folder: string): Promise<void> {
    const filePath = path.resolve(upload.tmpFolder, folder, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.log(err);
    }
  }
}

export { LocalStorageProvider };
