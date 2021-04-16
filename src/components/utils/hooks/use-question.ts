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
import { SetCallback, useStruct, UseStruct } from './use-struct';

export function useQuestionUpdate(
  roomId: number,
  questionId: number,
  question: Question,
  autoValidate = false,
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
    autoValidate,
  });
}

export function useQuestionCreate(
  roomId: number,
  autoValidate = false,
  autoSync = false,
): UseStruct<QuestionCreate> {
  const states = {
    text: useState(''),
    answersFormat: useState<AnswersFormat>('free'),
    fixAnswers: useState<FixAnswer[]>([{ text: '' }, { text: '' }]),
  };

  return useStruct<QuestionCreate>({
    states,
    autoValidate,
    validator: (question) => validateQuestionCreate(question),
    autoSync,
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
