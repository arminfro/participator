import { useState } from 'react';
import {
  AnswersFormat,
  FixAnswer,
  Question,
  QuestionCreate,
  QuestionUpdate,
} from '../../../types/question';
import {
  validateQuestionCreate,
  validateQuestionUpdate,
} from '../../../types/question.validation';
import api from '../api';
import { SetCallback, useStruct, UseStructWithValidation } from './use-struct';

export function useQuestionUpdate(
  questionId: number,
  question: Question,
  autoValidate = false,
  autoSync = false,
): UseStructWithValidation<QuestionUpdate> {
  const states = {
    text: useState(question.text),
    answersFormat: useState(question.answersFormat),
    fixAnswers: useState(question.fixAnswers),
  };

  return useStruct<QuestionUpdate>({
    states,
    validator: (question: Question) => validateQuestionUpdate(question),
    update: (callback: SetCallback<QuestionUpdate>, newQuestion: Question) =>
      api('patch', `api/questions/${questionId}`, callback, newQuestion),
    autoSync,
    autoValidate,
  });
}

export function useQuestionCreate(
  autoValidate = false,
  autoSync = false,
): UseStructWithValidation<QuestionCreate> {
  const states = {
    text: useState(''),
    answersFormat: useState<AnswersFormat>('free'),
    fixAnswers: useState<FixAnswer[]>([{ answer: '' }]),
  };

  return useStruct<QuestionCreate>({
    states,
    autoValidate,
    validator: (question) => validateQuestionCreate(question),
    autoSync,
    update: (callback: SetCallback<QuestionCreate>, newQuestion: Question) =>
      api<QuestionCreate>('post', `api/questions`, callback, newQuestion),
  });
}
