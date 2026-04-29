export const ZOOM_LEVELS = [
  { id: "day",   label: "Day",   scale: 1.00 },
  { id: "week",  label: "Week",  scale: 0.78 },
  { id: "month", label: "Month", scale: 0.62 },
];

export const WORLD_SIZES = {
  day:   { w: 1200, h: 980 },
  week:  { w: 2050, h: 900 },
  month: { w: 1640, h: 1180 },
};

export const PAPER_TYPES = [
  { type: "sticky", variant: "",         swatch: "sticky",   label: "Sticky" },
  { type: "lined",  variant: "",         swatch: "lined",    label: "Lined" },
  { type: "todo",   variant: "",         swatch: "todo",     label: "Todo" },
  { type: "grid",   variant: "",         swatch: "grid",     label: "Grid" },
  { type: "sticky", variant: "pink",     swatch: "pink",     label: "Pink" },
  { type: "sticky", variant: "lavender", swatch: "lavender", label: "Lavender" },
];
