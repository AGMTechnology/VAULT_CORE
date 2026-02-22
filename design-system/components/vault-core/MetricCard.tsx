import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../primitives/Card";
import { Icon } from "../primitives/Icon";
import { Text } from "../primitives/Text";

export type MetricTrend = "up" | "down" | "flat";

export type MetricCardProps = {
  readonly label: string;
  readonly value: string;
  readonly change?: number;
  readonly unit?: string;
  readonly trend?: MetricTrend;
};

function trendTone(trend: MetricTrend): "success" | "error" | "soft" {
  if (trend === "up") return "success";
  if (trend === "down") return "error";
  return "soft";
}

function trendGlyph(trend: MetricTrend) {
  if (trend === "up") return TrendingUp;
  if (trend === "down") return TrendingDown;
  return Minus;
}

export function MetricCard({ label, value, change, unit = "", trend = "flat" }: MetricCardProps) {
  const tone = trendTone(trend);
  return (
    <Card className="ds-metric-card">
      <Text size="2xs" tone="soft" uppercase className="ds-metric-card__label">{label}</Text>
      <div className="ds-metric-card__value-row">
        <Text as="span" size="3xl" mono className="ds-metric-card__value">{value}</Text>
        {unit ? <Text as="span" size="sm" tone="soft" className="ds-metric-card__unit">{unit}</Text> : null}
      </div>
      {change !== undefined ? (
        <div className="ds-metric-card__delta-row">
          <Icon icon={trendGlyph(trend)} tone={tone} size="sm" />
          <Text size="xs" tone={tone} mono>{change > 0 ? `+${change}` : `${change}`}%</Text>
        </div>
      ) : null}
    </Card>
  );
}
