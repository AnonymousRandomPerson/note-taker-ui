'use client'

import styles from './notes-list.module.css';
import React, {useState} from 'react';
import {Note} from '@/app/models';
import UpdateNote from '@/app/update-note';
import {updateNote} from '@/app/notes.service';

interface NotesListProps {
  notes: Note[];
}

export default function NotesList({ notes }: NotesListProps) {
  const [editedNote, setEditedNote] = useState(-1);

  function onEditClicked(noteId: number) {
    setEditedNote(noteId);
  }

  async function onDeleteClicked(noteId: number) {
  }

  function onEditClosed() {
    setEditedNote(-1);
  }

  async function onEditConfirmed(noteContents: string) {
    await updateNote(editedNote, noteContents);
  }

  if (notes.length) {
    return notes.map(note => {
      if (note.id === editedNote) {
        return <UpdateNote key={note.id} onClose={onEditClosed} onConfirm={onEditConfirmed} initNoteContents={note.contents}/>
      } else {
        return (
          <div className={styles.note} key={note.id} data-testid={`note-${note.id}`}>
            <p>{note.contents}</p>
            <div className={styles.buttons}>
              <button onClick={() => onEditClicked(note.id)} className={styles.button} data-testid={`edit-${note.id}`}>Edit</button>
              <button onClick={() => onDeleteClicked(note.id)} className={styles.button} data-testid={`delete-${note.id}`}>Delete</button>
            </div>
          </div>
        )
      }
    });
  } else {
    return (
      <p data-testid='empty-message'>You have no notes. Click &quot;Add note&quot; to add a note.</p>
    );
  }
}
