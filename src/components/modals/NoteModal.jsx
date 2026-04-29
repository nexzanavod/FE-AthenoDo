import { useState, useEffect } from "react";
import { PaperNote } from "../papers/PaperNote";

export function NoteModal({ note, onSave, onClose, onDelete }) {
  const [draft, setDraft] = useState(note);
  // New notes start "unsaved" so Save is enabled; existing notes start "saved"
  const [saved, setSaved] = useState(!note?._isNew);

  useEffect(() => { setDraft(note); setSaved(!note?._isNew); }, [note?.id]);

  const handleChange = (updated) => { setDraft(updated); setSaved(false); };

  const handleSave = () => { onSave(draft); setSaved(true); onClose(); };

  // Discard: just close. New notes were never added; edits are not flushed.
  const handleClose = () => { onClose(); };

  if (!note) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-paper" onClick={(e) => e.stopPropagation()}>
        <PaperNote
          note={draft}
          editable
          onChange={handleChange}
          onDelete={() => { onDelete(note.id); onClose(); }}
        />
        <div className="modal-save-row">
          {!note._isNew && (
            <button className="modal-btn-delete" onClick={() => { onDelete(note.id); onClose(); }}>Delete</button>
          )}
          <span style={{ flex: 1 }} />
          <button className="modal-btn-cancel" onClick={handleClose}>Discard</button>
          <button className="modal-btn-save" onClick={handleSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
