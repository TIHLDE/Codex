'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';

export interface Question {
  question: string;
  answers: string[];
  answerIdx: number;
}

export function Quiz({ questions }: { questions: Question[] }) {
  const [currentQuestionIdx, setcurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(-1),
  );
  const [showCurrent, setShowCurrent] = useState(false);

  if (currentQuestionIdx >= questions.length) {
    return (
      <div className="w-[500px] overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm/6 font-semibold text-gray-900">
            Din score er {computeScore(questions, answers)} av{' '}
            {questions.length}
          </p>
          <button
            type="button"
            className="mt-2 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => {
              setcurrentQuestion(0);
              setAnswers(Array(questions.length).fill(-1));
              setShowCurrent(false);
            }}
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[500px] overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <ProgressBar total={questions.length} current={currentQuestionIdx} />
        <RadioGroup
          question={questions[currentQuestionIdx]}
          onChange={(answerIdx) =>
            setAnswers((ans) => {
              const newAnswers = [...ans];
              newAnswers[currentQuestionIdx] = answerIdx;
              return newAnswers;
            })
          }
          showCurrent={showCurrent}
          selected={answers[currentQuestionIdx]}
        />
        {answers[currentQuestionIdx] !== -1 && (
          <div className="mt-4 flex w-full justify-end">
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => {
                if (showCurrent) {
                  setcurrentQuestion(currentQuestionIdx + 1);
                  setShowCurrent(false);
                } else {
                  setShowCurrent(true);
                }
              }}
            >
              {showCurrent ? 'Neste' : 'Sjekk'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RadioGroup({
  question,
  onChange,
  showCurrent,
  selected,
}: {
  question: Question;
  onChange: (answer: number) => void;
  showCurrent: boolean;
  selected: number;
}) {
  return (
    <fieldset className="mt-2">
      <legend className="text-sm/6 font-semibold text-gray-900">
        {question.question}
      </legend>
      <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
        {question.answers.map((q, idx) => (
          <div
            key={idx}
            className={clsx(
              'relative flex items-start rounded-md px-2 py-4',
              showCurrent && question.answerIdx === idx ? 'bg-green-300' : '',
              showCurrent && question.answerIdx !== idx && selected === idx
                ? 'bg-red-300'
                : '',
            )}
          >
            <div className="min-w-0 flex-1 text-sm/6">
              <label
                htmlFor={`side-${idx}`}
                className="select-none font-medium text-gray-900"
              >
                {q}
              </label>
            </div>
            {!showCurrent && (
              <div className={'ml-3 flex h-6 items-center'}>
                <input
                  id={`side-${idx}`}
                  name="plan"
                  type="radio"
                  className={clsx(
                    'size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600',
                  )}
                  onChange={() => onChange(idx)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function ProgressBar({ total, current }: { total: number; current: number }) {
  const steps = useMemo(() => {
    const steps = [];
    for (let i = 0; i < total; i++) {
      steps.push({
        name: `Step ${i + 1}`,
        status:
          i === current ? 'current' : i < current ? 'complete' : 'incomplete',
        href: '#',
      });
    }
    return steps;
  }, [total, current]);

  return (
    <nav aria-label="Progress" className="flex items-center justify-center">
      <p className="text-sm font-medium text-black">
        Spørsmål {steps.findIndex((step) => step.status === 'current') + 1} av{' '}
        {steps.length}
      </p>
    </nav>
  );
}

function computeScore(questions: Question[], answers: number[]): number {
  return questions.reduce((acc, question, idx) => {
    if (question.answerIdx === answers[idx]) {
      return acc + 1;
    }
    return acc;
  }, 0);
}
