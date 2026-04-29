// Sample notes data — generated dynamically based on current date
const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

const date = (offsetDays, hour = 9, min = 0) => {
  const dt = new Date(y, m, d + offsetDays, hour, min);
  return dt.toISOString();
};

export const sampleNotes = [
  {
    id: "n1",
    type: "todo",
    title: "Today's plan",
    when: date(0, 9, 0),
    duration: 60,
    items: [
      { text: "Review PR #482 from Maya", done: true },
      { text: "Draft Q3 roadmap deck", done: false },
      { text: "1:1 with Jordan", done: false },
      { text: "Reply to design feedback", done: false },
    ],
  },
  {
    id: "n2",
    type: "sticky",
    title: "Don't forget",
    when: date(0, 11, 30),
    duration: 30,
    body: "Pick up dry cleaning before 6pm. Card on the door.",
  },
  {
    id: "n3",
    type: "lined",
    title: "Standup notes",
    when: date(0, 10, 0),
    duration: 30,
    body: "Backend ready for review.\nWaiting on copy from Sam.\nPushing release to Thursday.",
  },
  {
    id: "n4",
    type: "grid",
    title: "Sprint sketch",
    when: date(0, 14, 0),
    duration: 60,
    body: "auth → onboarding → empty → first run",
  },
  {
    id: "n5",
    type: "todo",
    title: "Groceries",
    when: date(1, 18, 0),
    duration: 30,
    items: [
      { text: "Sourdough loaf", done: false },
      { text: "Cherry tomatoes", done: false },
      { text: "Olive oil", done: false },
      { text: "Espresso beans", done: false },
    ],
  },
  {
    id: "n6",
    type: "sticky",
    variant: "pink",
    title: "Idea",
    when: date(1, 8, 0),
    duration: 15,
    body: "What if notes could be linked across days like a thread?",
  },
  {
    id: "n7",
    type: "lined",
    title: "Reading: Designing Data-Intensive Apps",
    when: date(2, 19, 0),
    duration: 90,
    body: "Ch. 7 — Transactions.\nIsolation levels. Read committed vs snapshot.",
  },
  {
    id: "n8",
    type: "todo",
    title: "Trip prep",
    when: date(3, 17, 0),
    duration: 60,
    items: [
      { text: "Print boarding pass", done: false },
      { text: "Charge headphones", done: false },
      { text: "Book airport parking", done: true },
    ],
  },
  {
    id: "n9",
    type: "sticky",
    variant: "lavender",
    title: "Mom's birthday",
    when: date(4, 12, 0),
    duration: 0,
    body: "Send flowers. Brunch at noon.",
  },
  {
    id: "n10",
    type: "grid",
    title: "Pricing matrix",
    when: date(5, 10, 0),
    duration: 45,
    body: "tier × seats × addons",
  },
  {
    id: "n11",
    type: "lined",
    title: "Coffee w/ Priya",
    when: date(-1, 15, 0),
    duration: 60,
    body: "Talked about her switch to consulting. Intro to her old PM next week.",
  },
  {
    id: "n12",
    type: "sticky",
    title: "Call dentist",
    when: date(-1, 9, 0),
    duration: 15,
    body: "Reschedule cleaning to next month.",
  },
  {
    id: "n13",
    type: "todo",
    title: "Ship checklist",
    when: date(2, 14, 0),
    duration: 60,
    items: [
      { text: "Smoke test prod", done: false },
      { text: "Update changelog", done: false },
      { text: "Slack #launches", done: false },
      { text: "Tweet announcement", done: false },
    ],
  },
  {
    id: "n14",
    type: "sticky",
    variant: "pink",
    title: "Anniversary",
    when: date(7, 19, 0),
    duration: 0,
    body: "Reservation at Lula. 7:30pm. Don't forget the card.",
  },
  {
    id: "n15",
    type: "lined",
    title: "Therapy",
    when: date(6, 16, 0),
    duration: 50,
    body: "Weekly session.",
  },
  {
    id: "n16",
    type: "grid",
    title: "Apartment layout",
    when: date(-3, 11, 0),
    duration: 45,
    body: "8 × 6 living room",
  },
  {
    id: "n17",
    type: "todo",
    title: "Workout",
    when: date(0, 7, 0),
    duration: 45,
    items: [
      { text: "Run 5k", done: true },
      { text: "Mobility 15min", done: true },
      { text: "Stretch", done: false },
    ],
  },
  {
    id: "n18",
    type: "sticky",
    title: "Library books",
    when: date(8, 10, 0),
    duration: 0,
    body: "Return Borges. Renew Calvino.",
  },
];
