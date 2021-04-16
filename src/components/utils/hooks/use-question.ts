import { pick } from 'lodash';
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
import api from '../funcs/api';
import { useStruct, UseStruct } from './use-struct';

export function useQuestionUpdate(
  roomId: number,
  questionId: number,
  question: Question,
  autoSync = false,
): UseStruct<QuestionUpdate> {
  const states = {
    text: useState(question.text),
    answersFormat: useState(question.answersFormat),
    fixAnswers: useState(question.fixAnswers),
  };

  return useStruct<QuestionUpdate>({
    states,
    validator: (question: Question) => validateQuestionUpdate(question),
    remoteUpdate: (newQuestion: Question) =>
      api(
        'patch',
        `api/rooms/${roomId}/questions/${questionId}`,
        newQuestion,
      ).then((data) => {
        if (data) return data;
      }),
    autoSync,
    isEdit: true,
    initialValues: pick(question, 'text', 'answersFormat', 'fixAnswers'),
  });
}

export function useQuestionCreate(
  roomId: number,
  autoSync = false,
): UseStruct<QuestionCreate> {
  const initialValues: QuestionCreate = {
    text: '',
    answersFormat: 'free',
    fixAnswers: [{ text: '' }],
  };

  const states = {
    text: useState(initialValues.text),
    answersFormat: useState<AnswersFormat>(initialValues.answersFormat),
    fixAnswers: useState<FixAnswer[]>(initialValues.fixAnswers),
  };

  return useStruct<QuestionCreate>({
    states,
    validator: (question) => validateQuestionCreate(question),
    autoSync,
    initialValues,
    remoteUpdate: (newQuestion: Question) =>
      api<QuestionCreate>(
        'post',
        `api/rooms/${roomId}/questions`,
        newQuestion,
      ).then((data) => {
        if (data) return data;
      }),
  });
}
