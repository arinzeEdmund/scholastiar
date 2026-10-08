"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <Accordion type="multiple" className="rounded-lg border bg-card px-5">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-[0.95rem] text-secondary-text">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
