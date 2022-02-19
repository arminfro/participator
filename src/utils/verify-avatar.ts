// import { RcFile } from 'antd/lib/upload';

export function verifyAvatar(file: Express.Multer.File) {
  const [isJpgOrPng, isLt2M] = ((): [boolean, boolean] => {
    if ('type' in file) {
      // const f = <RcFile>file;
      // quickfix, RcFile has prop defintions for size, but tsc complains
      const f = <{ type: string; size: number }>(<unknown>file);
      return [
        f.type === 'image/jpeg' || f.type === 'image/png',
        f.size / 1024 / 1024 < 2,
      ];
    } else if ('mimetype' in file) {
      const f = <Express.Multer.File>file;
      return [
        f.mimetype === 'image/jpeg' || f.mimetype === 'image/png',
        f.size / 1024 / 1024 < 2,
      ];
    }
  })();
  return [
    !isJpgOrPng && 'You can only upload JPG/PNG file',
    !isLt2M && 'Image must be smaller than 2MB',
  ].filter((a) => a);
}
