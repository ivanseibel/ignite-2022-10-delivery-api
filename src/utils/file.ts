import fs from 'fs';

async function deleteFile(fileName: string) {
  try {
    await fs.promises.stat(fileName);
    await fs.promises.unlink(fileName);
  } catch (err) {
    console.log(err);
  }
}

export { deleteFile };
