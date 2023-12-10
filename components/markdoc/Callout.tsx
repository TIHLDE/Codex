import * as React from "react";

export function Callout({ title, children, type }) {
  return (
    <div className="callout">
      <div>
        {type && (
          <span
            className="material-symbols-outlined"
            style={{
              marginRight: "0.5rem",
              verticalAlign: "sub",
              fontSize: 20,
              fontWeight: "bolder",
            }}
          >
            {type}
          </span>
        )}
        <span
          style={{ fontSize: 18, fontWeight: "500", verticalAlign: "baseline" }}
        >
          {title}
        </span>
      </div>
      <span>{children}</span>
      <style jsx>
        {`
          .callout {
            display: flex;
            flex-direction: column;
            padding: 12px 16px;
            background: var(--card-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }

          .callout :global(p) {
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
