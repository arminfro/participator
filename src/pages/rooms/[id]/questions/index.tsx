import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import api from '../../../utils/api';
import getInitialProps from '../../../utils/get-initial-props';
import Question from '../../../../types/question';

interface Props {
  questions: Question[];
}

export default function Questions({ questions }: Props): ReactElement {
  return (
    <>
      <h2>Hier werden alle Umfragen gelistet</h2>
      <p>Diese Seite hat folgenden Leistungsumfang
        <ul>
          <li>Auflistung aller Umfragen</li>
          <li>Öffnen jeder einzelnen Umfrage via Accordeon</li>
          <li>Im Accordeon Darstellung von</li>
          <ul>
            <li>Urheber*in der Frage</li>
            <li>Umfrage</li>
            <li>Antwortmöglichkeiten</li>
            <li>Ergebnissen</li>
            <li>die gesamte questions/[id]/index-Komponente</li>
          </ul>
          <li>Im Accordeon kann die Umfrage beantwortet werden</li>
          <li>Benötigen wir eine einzelne Seite für die questions/[id]/index-Komponente? Vermutlich nicht</li>
        </ul>
      </p>
      {JSON.stringify(questions)}
    </>
  );
}

Questions.getInitialProps = async ({ req, query }: NextPageContext) => {
  const questions = await getInitialProps<Question>(req, query, {
    server: () => query.questions,
    client: async () => await api('get', `api/rooms/${query.id}/questions`),
  });
  return { questions };
};
