import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../../utils/api';
import getInitialProps from '../../../../utils/get-initial-props';
import IQuestion from '../../../../../types/question';

interface Props {
  question: IQuestion;
}

export default function Question({ question }: Props): ReactElement {
  return (
    <>
      <h2>Das ist die Komponente für eine einzelne Umfrage</h2>
      <p>Hier sind folgende Dinge zu erleben:
        <ul>
          <li>Eine Umfrage wird angezeigt</li>
          <li>Alle Antwortmöglichkeiten sind sichtbar</li>
          <li>Antwortmöglichkeit(en) können ausgewählt werden</li>
          <li>Ergebnisse werden dargestellt -> Möglicherweise Auslagerung in eigene Komponente</li>
          <ul>
            <li>'free': Textblöcke</li>
            <li>'fixed'</li>
            <ul>
              <li>Antworten in der Reihenfolge wie sie eingepflegt wurden und unter jeder Antwort ein beschrifteter Prozentzahlbalken</li>
              <li>Antwort mit den meisten Antworten wird <em>dezent</em> hervorgehoben</li>
            </ul>
            <li>'range'</li>
          </ul>
        </ul>
      </p>
      {JSON.stringify(question)}
    </>
  );
}

Question.getInitialProps = async ({ req, query }: NextPageContext) => {
  const question = await getInitialProps<IQuestion>(req, query, {
    server: () => query.question,
    client: async () =>
      await api('get', `api/rooms/${query.id}/questions/${query.questionId}`),
  });
  return { question };
};
