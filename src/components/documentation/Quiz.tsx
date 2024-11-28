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
      <div className="w-full overflow-hidden rounded-lg bg-white dark:bg-slate-800">
        <div className="px-4 py-4">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-0">
            Din score er {computeScore(questions, answers)} av{' '}
            {questions.length}!
          </p>
          <button
            type="button"
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 duration-75"
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
    <div className="w-full overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
      <div className="flex w-full flex-col px-4 py-5 sm:p-6">
        <ProgressBar total={questions.length} current={currentQuestionIdx} />
        <RadioGroup
          question={questions[currentQuestionIdx]}
          onChange={(answerIdx) =>
            {
              if(!showCurrent)  {
                setAnswers((ans) => {
                  const newAnswers = [...ans];
                  newAnswers[currentQuestionIdx] = answerIdx;
                  return newAnswers;
                })
              }
            }
          }
          showCurrent={showCurrent}
          selected={answers[currentQuestionIdx]}
        />
        {answers[currentQuestionIdx] !== -1 && (
          <div className="mt-4 flex w-full justify-end">
            <button
              type="button"
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 duration-75"
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
      <legend className="text-md font-semibold text-gray-900 dark:text-gray-100">
        {question.question}
      </legend>
      <div className="mt-4 flex flex-col gap-2">
        {question.answers.map((q, idx) => (
          <div
            key={idx}
            onClick={() => onChange(idx)}
            className={clsx(
              'relative flex items-start px-2 py-4 dark:hover:bg-slate-600 rounded-md cursor-pointer dark:bg-slate-700 dark:text-gray-100 bg-slate-100 hover:bg-slate-200',
              showCurrent && question.answerIdx === idx ? '!bg-green-300 dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-400' : '',
              showCurrent && question.answerIdx !== idx && selected === idx
                ? '!bg-red-300 dark:bg-red-400 dark:text-red-950 dark:hover:bg-red-400'
                : '',
            )}
          >
            <div className="min-w-0 flex-1 text-sm/6 cursor-pointer">
              <label
                htmlFor={`side-${idx}`}
                className="select-none font-medium"
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
                    'size-4 text-sky-600 focus:ring-sky-600',
                  )}
                  value={idx}
                  checked={selected === idx}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </fieldset>
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

function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className='text-xl font-bold'>QUIZ</span>
      <span className='w-52'>
        Spørsmål {current + 1} av {total}
      </span>
      <div
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
      >
        <div
          className="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-sky-600 text-center text-xs text-white transition duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
