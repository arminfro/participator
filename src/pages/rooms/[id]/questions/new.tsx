

import { text } from 'express';
import React from 'react';
import QuestionForm from './form';

export default function QuestionCreate() {
  return (
    <QuestionForm
      text=""
      answersFormat="fix"
      fixAnswers={['']}
      isEdit={false}
    />
  );
}