import { fchmod } from "fs";
import * as React from "react";

interface ApiPropsProps {
  url: string;
  method: string;
  response_codes: string[];
  requires_auth: boolean;
  permissions?: string[];
  content_type?: string;
}

export function ApiProps({ props }: { props: ApiPropsProps }) {
  if (!props.url || !props.method || !props.response_codes)
    throw new Error(
      "Missing required props for ApiProps.\nMake sure the url, method" +
        " and response_codes fields are set in the frontmatter.",
    );

  return (
    <>
      <div className={"top-props"}>
        <div>
          <div className={"chip"}>{props.method + " " + props.url}</div>
        </div>
        <span style={{ display: "inline-flex", gap: "0.3rem" }}>
          {props.requires_auth && (
            <div className={"chip warning"}>
              <span className="material-symbols-outlined auth-icon">key</span>{" "}
              {props.permissions?.length ? "Auth w/ scopes" : "Auth required"}
            </div>
          )}
          {props.permissions?.map((c) => (
            <div className={"chip warning"}>{c}</div>
          ))}
        </span>
        <div>
          <span style={{ gap: "0.3rem", display: "inline-flex" }}>
            {props.response_codes.map((response_code) => (
              <div
                className={
                  "chip " + (response_code.startsWith("2") ? "success" : "bad")
                }
              >
                {response_code}
              </div>
            ))}
          </span>
        </div>
      </div>
      <style jsx>{`
        .code-font {
          font-family: "Fira Code", Monaco, "Andale Mono", "Ubuntu Mono",
            monospace;
        }

        .top-props {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: start;
        }

        .url {
          font-family: "Fira Code", "Fira Code", Monaco, "Andale Mono",
            "Ubuntu Mono", monospace;
          display: inline-block;
          margin-left: 0.5rem;
        }

        .chip {
          border: 1px solid var(--text-color);
          border-radius: 4px;
          padding: 0.1rem 0.5rem;
          color: var(--text-color);
          background-color: var(--card-color);
          display: inline-block;
          font-weight: 500;
          font-family: "Fira Code", Monaco, "Andale Mono", "Ubuntu Mono",
            monospace;
        }

        .warning {
          color: var(--grey-color);
          border-color: var(--grey-color);
          background-color: var(--grey-bg-color);
        }

        .bad {
          border-color: var(--bad-color);
          background-color: var(--bad-background-color);
          color: var(--bad-color);
        }

        .success {
          border-color: var(--good-color);
          background-color: var(--good-background-color);
          color: var(--good-color);
        }

        span.auth-icon {
          vertical-align: bottom;
          font-size: 20px !important;
        }
      `}</style>
    </>
  );
}
