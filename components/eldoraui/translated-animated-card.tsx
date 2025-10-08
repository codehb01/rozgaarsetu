"use client";
import { MainMenusGradientCard } from "./animatedcard";
import { TranslatedText } from "@/components/translation/auto-translate";
import type { ReactNode } from "react";

export const TranslatedMainMenusGradientCard = ({
  title,
  description,
  withArrow = false,
  circleSize = 400,
  className,
  children,
  context = "default"
}: {
  title: string;
  description: string;
  withArrow?: boolean;
  circleSize?: number;
  children?: ReactNode;
  className?: string;
  context?: string;
}) => {
  return (
    <MainMenusGradientCard
      title={title}
      description={description}
      withArrow={withArrow}
      circleSize={circleSize}
      className={className}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          <TranslatedText context={context}>{title}</TranslatedText>
        </h3>
        <p className="text-sm opacity-80">
          <TranslatedText context={context}>{description}</TranslatedText>
        </p>
        {children}
      </div>
    </MainMenusGradientCard>
  );
};
