interface ApiPropsProps {
  url: string
  method: string
  response_codes: string[]
  requires_auth: boolean
  permissions?: string[]
  content_type?: string
}

export function ApiProps({ props }: { props: ApiPropsProps }) {
  if (!props.url || !props.method || !props.response_codes)
    throw new Error(
      'Missing required props for ApiProps.\nMake sure the url, method' +
        ' and response_codes fields are set in the frontmatter.',
    )

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div>
          <div className="">{props.method + ' ' + props.url}</div>
        </div>
        <span className={'inline-flex gap-1'}>
          {props.requires_auth && (
            <div className={'chip warning'}>
              <span className="material-symbols-outlined auth-icon">key</span>{' '}
              {props.permissions?.length ? 'Auth w/ scopes' : 'Auth required'}
            </div>
          )}
          {props.permissions?.map((c) => (
            <div key={c} className={'chip warning'}>
              {c}
            </div>
          ))}
        </span>
        <div>
          <span style={{ gap: '0.3rem', display: 'inline-flex' }}>
            {props.response_codes.map((response_code) => (
              <div
                key={response_code}
                className={
                  'chip ' + (response_code.startsWith('2') ? 'success' : 'bad')
                }
              >
                {response_code}
              </div>
            ))}
          </span>
        </div>
      </div>
    </>
  )
}
