export const noop = () => {
  /* no-op */
};

export const chatMsgDeleted = '*Message got deleted*';

export const domain = process.env.domain || 'localhost';
export const port = process.env.port || 3000;
export const protocol = process.env.protocol || 'http';
export const url = `${domain}:${port}`;
export const urlWithProtocol = `${protocol}://${url}`;

// type SN = string | string[] | number;
// export const ressources = {
//   user: {
//     list: {
//       url: () => 'api/users',
//     },
//     detail: {
//       url: (userId) => `api/users/${userId}`,
//     },
//   },
//   rooms: {
//     list: {
//       url: () => 'api/rooms',
//     },
//     detail: {
//       url: (roomId: SN) => `api/rooms/${roomId}`,
//     },
//   },
//   questions: {
//     list: {
//       url: (roomId: SN) => `api/rooms/${roomId}/questions`,
//     },
//     detail: {
//       url: (roomId: SN, questionId: SN) =>
//         `api/rooms/${roomId}/questions/${questionId}`,
//     },
//   },
//   answers: {
//     list: {
//       url: (roomId: SN, questionId: SN) =>
//         `api/rooms/${roomId}/questions/${questionId}/answers`,
//     },
//     detail: {
//       url: (roomId: SN, questionId: SN, answerId: SN) =>
//         `api/rooms/${roomId}/questions/${questionId}/answers/${answerId}`,
//     },
//   },
// };
