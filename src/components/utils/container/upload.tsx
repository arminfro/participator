import { LoadingOutlined } from '@ant-design/icons';
import { message, Upload as AntdUpload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import React, { ReactElement, useState } from 'react';
import { verifyAvatar } from '../../../utils/verify-avatar';
import { getToken } from '../../utils/funcs/token';

interface Props {
  uploadUrl: string;
  previewImgUrl?: string;
  onDone?: (fileUrl: string) => void;
  children: ReactElement;
}

export default function Upload({
  uploadUrl,
  previewImgUrl,
  onDone,
  children,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(previewImgUrl);

  const onChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      message.success('Avatar uploaded!');
      setImageUrl(`/${info.file.xhr.responseText}`);
      onDone && onDone(`/${info.file.xhr.responseText}`);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const errors = verifyAvatar(file);
    if (errors.length === 0) {
      return true;
    } else {
      message.error(errors.join('. '));
      return false;
    }
  };

  return (
    <AntdUpload
      name="avatar"
      listType="picture-card"
      showUploadList={false}
      action={uploadUrl}
      beforeUpload={beforeUpload}
      onChange={onChange}
      headers={{
        Authorization: `bearer ${getToken()}`,
      }}
    >
      {loading ? <LoadingOutlined /> : imageUrl && children}
    </AntdUpload>
  );
}
