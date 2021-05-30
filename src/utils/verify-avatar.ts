import { RcFile } from 'antd/lib/upload';

export function verifyAvatar(file: Express.Multer.File | RcFile) {
  const type = ((): string => {
    if ('type' in file) {
      return file.type;
    } else if ('mimetype' in file) {
      return file.mimetype;
    }
  })();
  const isJpgOrPng = type === 'image/jpeg' || type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;
  return [
    !isJpgOrPng && 'You can only upload JPG/PNG file',
    !isLt2M && 'Image must be smaller than 2MB',
  ].filter((a) => a);
}
