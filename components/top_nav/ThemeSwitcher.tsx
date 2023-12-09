import React, { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>();

  useEffect(() => {
    if (window.localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div onClick={toggleDarkMode} className={"switcher not-selectable"}>
      <span className="material-symbols-outlined">
        {isDarkMode ? "dark_mode" : "light_mode"}
      </span>
      <style jsx>
        {`
          .switcher {
            cursor: pointer;
          }

          .switcher:hover {
            scale: 1.2;
          }
        `}
      </style>
    </div>
  );
}
