import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import QuestionCreate from '../../../../components/question/create';

export default function QuestionNew(): ReactElement {
  const { id } = useRouter().query;
  return <QuestionCreate roomId={Number(id)} />;
}
