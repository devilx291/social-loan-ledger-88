
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

type TrustScoreBadgeProps = {
  score: number;
};

export const TrustScoreBadge = ({ score }: TrustScoreBadgeProps) => {
  let color = "";
  let textColor = "text-white";
  let label = "";
  let Icon = Shield;
  
  if (score < 40) {
    color = "bg-trust-low";
    label = "Low Trust";
    Icon = ShieldAlert;
  } else if (score < 70) {
    color = "bg-trust-medium";
    label = "Medium Trust";
    Icon = Shield;
  } else {
    color = "bg-trust-high";
    label = "High Trust";
    Icon = ShieldCheck;
  }

  return (
    <Badge className={`${color} ${textColor} font-medium px-3 py-1 rounded-full flex items-center gap-1.5`}>
      <Icon className="h-3 w-3" />
      {label} ({score}/100)
    </Badge>
  );
};
