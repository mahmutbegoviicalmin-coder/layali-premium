"use client";

import { ShieldCheck, Truck, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Section,
  SectionContainer,
  FadeIn,
} from "@/components/ui/section";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Brands",
    description:
      "Every product in our portfolio is sourced directly from authorized manufacturers and verified distributors.",
  },
  {
    icon: Truck,
    title: "Fast Distribution",
    description:
      "Regional warehousing and optimized logistics ensure your orders arrive on time, every time.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Wholesale Support",
    description:
      "Personal account managers who understand your business and help you build a winning flavor menu.",
  },
];

export function Features() {
  return (
    <Section>
      <SectionContainer>
        <div className="rounded-[32px] bg-primary p-8 md:p-12 lg:p-16">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold/20 text-accent-gold transition-colors group-hover:bg-accent-gold/30">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-medium text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {feature.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </SectionContainer>
    </Section>
  );
}
