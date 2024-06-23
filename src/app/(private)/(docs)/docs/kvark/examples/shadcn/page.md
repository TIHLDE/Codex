---
title: 'Innføring i shad/cn'
---

Shad/cn er blitt til et populært verktøy for å bygge egne komponentbiblioteker. I bunn og grunn er dette ferdiglagde komponenter med åpen kildekode, som enkelt kan kopieres inn i vår egen kodebase. Det som er veldig praktisk med dette, er at komponentene ligger i komponentmappa (framfor i `node_modules`, hvor mui-komponentene ligger), som gjør at vi kan endre på de så mye vi vil. Vi eier rett og slett disse komponentene! Videre er de bygget med tailwind, som er noe vi tar i bruk i Kvark.

For å legge til en ny shad/cn-komponent, kan du velge den fra den [offisielle katalogen deres](https://ui.shadcn.com/docs/components/accordion), og følge instruksene for installasjon. Husk å velge **pnpm** som pakkebehandler når du kopierer terminalkommandoen!

En typisk shadcn CLI-kommando ser slik ut:

```bash
$ pnpm dlx shadcn-ui@latest add accordion
```

Etter dette kan du bruke komponenten hvor enn du ønsker! (Nå kan du også finne komponenten i `/src/components/ui/` og endre på den så mye du vil)

```javascript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```
