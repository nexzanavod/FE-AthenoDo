import { StickyNote } from "./StickyNote";
import { LinedNote } from "./LinedNote";
import { GridNote } from "./GridNote";
import { TodoNote } from "./TodoNote";

const PAPER_COMPONENTS = {
  sticky: StickyNote,
  lined: LinedNote,
  grid: GridNote,
  todo: TodoNote,
};

export function PaperNote({ note, ...props }) {
  const Component = PAPER_COMPONENTS[note.type] || StickyNote;
  return <Component note={note} {...props} />;
}
