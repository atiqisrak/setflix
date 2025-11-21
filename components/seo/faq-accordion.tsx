"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({
  items,
  className = "",
}: FAQAccordionProps) {
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Accordion.Root type="single" collapsible className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Accordion.Item
                value={`item-${index}`}
                className="border border-border rounded-lg overflow-hidden bg-card"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors group">
                    <span className="font-semibold text-foreground pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 text-foreground/60 group-data-[state=open]:rotate-180 transition-transform shrink-0"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  <div className="px-6 py-4 text-foreground/80">
                    {item.answer}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
