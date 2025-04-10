import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

interface SkillBadgeProps {
  name: string;
  nameAr?: string;
  level: 1 | 2 | 3 | 4 | 5;
  color?: "primary" | "secondary" | "accent" | "default";
  className?: string;
}

const SkillBadge = ({
  name,
  nameAr,
  level,
  color = "default",
  className,
}: SkillBadgeProps) => {
  const { language } = useLanguage();
  const displayName = language === "ar" && nameAr ? nameAr : name;
  
  const levelLabel = getLevelLabel(level);
  const badgeVariant = getBadgeVariant(color);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={badgeVariant}
            className={cn(
              "px-2.5 py-1 text-xs font-medium transition-all cursor-pointer hover:scale-105",
              className
            )}
          >
            {displayName}
            <span className="ml-1 rtl:mr-1 rtl:ml-0">
              {Array(level).fill("★").join("")}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("skillLevel")}: {levelLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

function getLevelLabel(level: number): string {
  switch (level) {
    case 1: return t("beginner");
    case 2: return t("basic");
    case 3: return t("intermediate");
    case 4: return t("advanced");
    case 5: return t("expert");
    default: return t("intermediate");
  }
}

function getBadgeVariant(color: SkillBadgeProps["color"]): "default" | "secondary" | "destructive" | "outline" {
  switch (color) {
    case "primary": return "default";
    case "secondary": return "secondary";
    case "accent": return "destructive";
    default: return "outline";
  }
}

export default SkillBadge;