import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { AnswerCreate } from '../../types/answer';
import { validateAnswerCreate } from '../../types/answer.validation';

// @Injectable()
// export class AnswerUpdatePipe
//   implements PipeTransform<AnswerUpdate, AnswerUpdate> {
//   transform(answer: AnswerUpdate): AnswerUpdate | never {
//     const [errors] = validateAnswerUpdate(answer);
//     if (errors) {
//       throw new HttpException(
//         errors.map((failure) => failure.message).join('. '),
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//     return answer;
//   }
// }

@Injectable()
export class AnswerCreatePipe
  implements PipeTransform<AnswerCreate, AnswerCreate> {
  transform(answer: AnswerCreate): AnswerCreate | never {
    const [errors] = validateAnswerCreate(answer);
    if (errors) {
      throw new HttpException(
        errors.map((failure) => failure.message).join('. '),
        HttpStatus.BAD_REQUEST,
      );
    }
    return answer;
  }
}
