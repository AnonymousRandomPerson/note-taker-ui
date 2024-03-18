'use client'

import {ChangeEvent, useState} from "react";
import {addNote} from "@/app/notes.service";
import {revalidatePathAction} from "@/app/actions";

export default function AddNote() {
  const [noteContents, setNoteContents] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [confirmingNote, setConfirmingNote] = useState(false);

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
          <div>
            <button onClick={handleCancelNote} disabled={confirmingNote}>Cancel</button>
            <button onClick={handleConfirmNote} disabled={confirmingNote}>Confirm</button>
          </div>
        </>
      )
    }
    </>
  )
    ;
}
