'use client'

import {useState} from 'react';
import UpdateNote from '@/app/update-note';
import {addNote} from '@/app/notes.service';

export default function AddNote() {
  const [addingNote, setAddingNote] = useState(false);

  function handleAddNote() {
    setAddingNote(true);
  }

  function onClose() {
    setAddingNote(false)
  }

  return (
    <>
      <div>
        <button onClick={handleAddNote} disabled={addingNote}>Add note</button>
      </div>
      <br/>
      {
        addingNote && <UpdateNote onClose={onClose} onConfirm={addNote} initNoteContents=''/>
      }
      <br/>
    </>
  );
}
