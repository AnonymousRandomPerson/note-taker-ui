'use client'

import styles from "./add-note.module.css";
import {ChangeEvent, useState} from "react";
import {addNote} from "@/app/notes.service";
import {revalidatePathAction} from "@/app/actions";

const MIN_NOTE_LENGTH = 20;
const MAX_NOTE_LENGTH = 300;

export default function AddNote() {
  const [noteContents, setNoteContents] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [confirmingNote, setConfirmingNote] = useState(false);
  let errorMessage = '';

  if (addingNote) {
    if (noteContents.length < MIN_NOTE_LENGTH) {
      errorMessage = `Note must be at least ${MIN_NOTE_LENGTH} characters. Currently ${noteContents.length} character${noteContents.length !== 1 ? 's' : ''}.`;
    } else if (noteContents.length > MAX_NOTE_LENGTH) {
      errorMessage = `Note must be at most ${MAX_NOTE_LENGTH} characters. Currently ${noteContents.length} characters.`;
    }
  }

  function handleAddNote() {
    setAddingNote(true);
  }

  function handleCancelNote() {
    setAddingNote(false);
  }

  async function handleConfirmNote() {
    setConfirmingNote(true);
    try {
      await addNote(noteContents);
      setConfirmingNote(false);
      setAddingNote(false);
      // Reload the note list after adding the note.
      revalidatePathAction('/')
    } catch (e) {
      setConfirmingNote(false);
      setAddingNote(false);
      throw e;
    }
  }

  function handleNoteChanged(event: ChangeEvent<HTMLInputElement>) {
    setNoteContents(event.target.value);
  }

  return (
    <>
    <div>
      <button onClick={handleAddNote} disabled={addingNote}>Add note</button>
    </div>
    <br/>
    {
      addingNote && (
        <>
          <input type='text' onChange={handleNoteChanged} data-testid='add-note-input'/>
          <p data-testid='error-message' className={styles.errorMessage}>{errorMessage}</p>
          <div>
            <button onClick={handleCancelNote} disabled={confirmingNote}>Cancel</button>
            <button onClick={handleConfirmNote} disabled={confirmingNote || errorMessage !== ''}>Confirm</button>
          </div>
        </>
      )
    }
    </>
  );
}
