import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import {
  validateQuestionUpdate,
  validateQuestionCreate,
} from '../../types/question.validation';

@Injectable()
export class QuestionUpdatePipe
  implements PipeTransform<QuestionUpdate, QuestionUpdate> {
  transform(question: QuestionUpdate): QuestionUpdate | never {
    const [errors] = validateQuestionUpdate(question);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return question;
  }
}

@Injectable()
export class QuestionCreatePipe
  implements PipeTransform<QuestionCreate, QuestionCreate> {
  transform(question: QuestionCreate): QuestionCreate | never {
    const [errors] = validateQuestionCreate(question);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return question;
  }
}
