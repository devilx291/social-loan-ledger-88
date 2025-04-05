
import { Badge } from "@/components/ui/badge";

type TrustScoreBadgeProps = {
  score: number;
};

export const TrustScoreBadge = ({ score }: TrustScoreBadgeProps) => {
  let color = "";
  let textColor = "text-white";
  let label = "";
  
  if (score < 40) {
    color = "bg-trust-low";
    label = "Low Trust";
  } else if (score < 70) {
    color = "bg-trust-medium";
    label = "Medium Trust";
  } else {
    color = "bg-trust-high";
    label = "High Trust";
  }

  return (
    <Badge className={`${color} ${textColor} font-medium px-3 py-1 rounded-full`}>
      {label} ({score}/100)
    </Badge>
  );
};
