import clsx from 'clsx'

interface ApiPropsProps {
  url: string
  method: string
  response_codes: string[]
  requires_auth: boolean
  permissions?: string[]
  content_type?: string
  description: string
}

export function ApiDescription({ props }: { props: ApiPropsProps }) {
  if (
    !props.url ||
    !props.method ||
    !props.response_codes ||
    !props.description
  ) {
    throw new Error(
      'Missing required props for ApiProps.\nMake sure the url, method' +
        ' and response_codes fields are set in the frontmatter.',
    )
  }

  return (
    <div>
      <div>{props.description}</div>
      <div className="flex flex-col items-start gap-2">
        <div className="text-slate-100">
          <span className="text-lg font-bold ">{props.method}</span>{' '}
          <span className="text-md font-semibold ">{props.url}</span>
        </div>
        <span className={'inline-flex gap-2'}>
          {props.requires_auth && (
            <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              <svg
                className="h-1.5 w-1.5 fill-blue-500"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx={3} cy={3} r={3} />
              </svg>
              {props.permissions?.length ? 'Auth m/ scopes' : 'Auth kreves'}
            </span>
          )}
          {props.permissions?.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-300"
            >
              {c}
            </span>
          ))}
        </span>
        <div>
          <span style={{ gap: '0.3rem', display: 'inline-flex' }}>
            {props.response_codes.map((response_code) => (
              <span
                key={response_code}
                className={clsx(
                  'inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium',
                  response_code.startsWith('2')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                )}
              >
                <svg
                  className={clsx(
                    'h-1.5 w-1.5',
                    response_code.startsWith('2')
                      ? 'fill-green-500'
                      : 'fill-red-500',
                  )}
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx={3} cy={3} r={3} />
                </svg>
                {response_code}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
