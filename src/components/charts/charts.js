import React from 'react';

const chartWidth = 340;
const chartHeight = 220;

function buildCircleSegments(data) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return data.map((item) => {
    const circumference = 2 * Math.PI * 42;
    const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
    const strokeDashoffset = -offset;
    offset += (item.value / total) * circumference;

    return { ...item, strokeDasharray, strokeDashoffset };
  });
}

export function AllocationDonut({ data }) {
  const segments = buildCircleSegments(data);

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 120 120" className="donut-chart__svg" role="img" aria-label="Allocation donut chart">
        <circle cx="60" cy="60" r="42" className="donut-chart__track" />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx="60"
            cy="60"
            r="42"
            className="donut-chart__segment"
            style={{
              stroke: segment.color,
              strokeDasharray: segment.strokeDasharray,
              strokeDashoffset: segment.strokeDashoffset,
            }}
          />
        ))}
        <text x="60" y="56" textAnchor="middle" className="donut-chart__label">Allocation</text>
        <text x="60" y="73" textAnchor="middle" className="donut-chart__value">100%</text>
      </svg>
    </div>
  );
}

export function CashFlowBars({ data }) {
  const maxValue = Math.max(...data.map((item) => Math.max(item.income, item.expense)));
  const width = chartWidth;
  const height = chartHeight;
  const chartLeft = 18;
  const chartRight = width - 18;
  const chartTop = 22;
  const chartBottom = height - 36;
  const laneGap = 16;
  const laneCount = data.length;
  const laneWidth = (chartRight - chartLeft - laneGap * (laneCount - 1)) / laneCount;
  const barGap = 8;
  const barWidth = Math.max(20, (laneWidth - barGap) / 2);
  const chartHeightPx = chartBottom - chartTop;
  const safeMax = maxValue === 0 ? 1 : maxValue;
  const gridValues = [0.25, 0.5, 0.75];

  return (
    <div className="bars-chart__container">
      <svg viewBox={`0 0 ${width} ${height}`} className="bars-chart" role="img" aria-label="Cash flow chart">
        <defs>
        <linearGradient id="cash-income" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2ee6d6" />
          <stop offset="100%" stopColor="#0ea5a4" />
        </linearGradient>
        <linearGradient id="cash-expense" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff8aa0" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        </defs>

        <rect x={chartLeft} y={chartTop} width={chartRight - chartLeft} height={chartHeightPx} rx="28" className="bars-chart__panel" />
        {gridValues.map((value) => {
          const y = chartTop + chartHeightPx * value;

          return <line key={value} x1={chartLeft} y1={y} x2={chartRight} y2={y} className="bars-chart__grid" />;
        })}

        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} className="bars-chart__axis" />

        {data.map((item, index) => {
          const startX = chartLeft + index * (laneWidth + laneGap);
          const incomeHeight = (item.income / safeMax) * 124;
          const expenseHeight = (item.expense / safeMax) * 124;
          const surplus = item.income - item.expense;
          const badgeWidth = Math.min(40, Math.max(32, surplus.toString().length * 8 + 10));
          const badgeX = startX + (laneWidth - badgeWidth) / 2;
          const badgeY = Math.max(chartTop + 8, chartBottom - incomeHeight - 14);

          return (
            <g key={item.month} className="bars-chart__group">
              <rect
                x={startX}
                y={chartBottom - incomeHeight - 8}
                width={laneWidth}
                height={incomeHeight + 18}
                rx="18"
                className="bars-chart__surplus"
                style={{ opacity: 0.18 + (surplus / safeMax) * 0.22 }}
              />
              <rect
                x={startX + 2}
                y={chartBottom - incomeHeight}
                width={barWidth}
                height={incomeHeight}
                rx="12"
                className="bars-chart__income"
              />
              <rect
                x={startX + 2 + barWidth + barGap}
                y={chartBottom - expenseHeight}
                width={barWidth}
                height={expenseHeight}
                rx="12"
                className="bars-chart__expense"
              />
              <circle cx={startX + 2 + barWidth / 2} cy={chartBottom - incomeHeight} r="3.5" className="bars-chart__marker bars-chart__marker--income" />
              <circle cx={startX + 2 + barWidth + barGap + barWidth / 2} cy={chartBottom - expenseHeight} r="3.5" className="bars-chart__marker bars-chart__marker--expense" />
              <rect x={badgeX} y={badgeY} width={badgeWidth} height="18" rx="9" className="bars-chart__badge" />
              <text x={startX + laneWidth / 2} y={badgeY + 12} textAnchor="middle" className="bars-chart__badge-text">
                +{surplus}
              </text>
              <text x={startX + laneWidth / 2} y={height - 12} textAnchor="middle" className="bars-chart__month">
                {item.month}
              </text>
            </g>
          );
        })}

        <text x={chartLeft} y={14} className="bars-chart__caption bars-chart__caption--left">Income</text>
        <text x={chartRight} y={14} textAnchor="end" className="bars-chart__caption bars-chart__caption--right">Expense</text>
      </svg>
    </div>
  );
}

export function NetWorthSparkline() {
  const values = [34, 38, 39, 42, 44, 47, 50, 53, 58, 61, 65, 72];
  const width = 320;
  const height = 120;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - minValue) / (maxValue - minValue)) * 78 - 16;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" role="img" aria-label="Net worth trend">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(14, 165, 233, 0.35)" />
          <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
        </linearGradient>
      </defs>
      <path d={`M ${points.join(' L ')} L ${width},${height} L 0,${height} Z`} className="sparkline__fill" />
      <polyline points={points.join(' ')} className="sparkline__line" />
    </svg>
  );
}