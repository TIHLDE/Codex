---
title: 'Innføring i tailwind'
---

Tailwind er et verktøy som lar deg bruke klassenavn til å stilisere komponentene du lager. Dersom du allerede er kjent med React, har man hovedsakelig to måter å bruke CSS på:

## 1 - Bruke inline CSS

```javascript
const CoolTitle = ({...props}: React.HTMLProps<HTMLTitleElement>) => {
    return (
        <h1 style={{
            backgroundColor: 'red',
            padding: '1rem',
            borderRadius: '0.5rem'
        }}
        {...props} />
    )
}
```

## 2 - Bruke CSS modules

```javascript
import styles from './CoolTitle.module.css';

const CoolTitle = ({...props}: React.HTMLProps<HTMLTitleElement>) => {
    return (
        <h1 className={styles.title}
        {...props} />
    )
}
```

En fellesnevner for begge disse metodene er at det tar lang tid å skrive CSS. For å forebygge dette brukes tailwind.

Som tidligere vist, brukes tailwind i `className`-proppen til den komponenten du skal stilisere. For at strengen ikke skal bli for lang, blir mange av CSS-attributtene forkortet. Som en bonus tar det også **mye mindre tid** å skrive stilene!

Nedenfor er et eksempel på tailwind, tatt fra [innføringen i React](/docs/kvark/examples/react)

```javascript
export const CoolTitle = () => {
  return (
    <h1 className="rounded-lg bg-red-500 p-5">Dette er en kul overskrift</h1>
  );
};
```

For å komme i gang så fort som mulig, er det anbefalt å ta en titt rundt på tailwind sin [ offentlige side ](https://tailwindcss.com/)
