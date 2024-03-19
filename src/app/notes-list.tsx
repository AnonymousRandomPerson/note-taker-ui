'use client'

import styles from './notes-list.module.css';
import {ChangeEvent, useState} from 'react';
import {Note} from '@/app/models';
import UpdateNote from '@/app/update-note';
import {deleteNote, updateNote} from '@/app/notes.service';
import {revalidatePathAction} from '@/app/actions';

interface NotesListProps {
  notes: Note[];
}

export default function NotesList({ notes }: NotesListProps) {
  const [editedNote, setEditedNote] = useState(-1);
  const [searchValue, setSearchValue] = useState('');
  const filteredNotes = notes.filter(note => !searchValue || note.contents.toLowerCase().includes(searchValue.toLowerCase()));

  function onSearchChanged(event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function onEditClicked(noteId: number) {
    setEditedNote(noteId);
  }

  async function onDeleteClicked(noteId: number) {
    await deleteNote(noteId);
    // Reload the note list after deleting the note.
    await revalidatePathAction('/');
  }

  function onEditClosed() {
    setEditedNote(-1);
  }

  async function onEditConfirmed(noteContents: string) {
    await updateNote(editedNote, noteContents);
  }

  if (notes.length) {
    let noteList;
    if (filteredNotes.length) {
      noteList = filteredNotes.map(note => {
        if (note.id === editedNote) {
          return <UpdateNote key={note.id} onClose={onEditClosed} onConfirm={onEditConfirmed} initNoteContents={note.contents}/>
        } else {
          return (
            <div className={styles.note} key={note.id} data-testid={`note-${note.id}`}>
              <p className={styles.contents}>{note.contents}</p>
              <div className={styles.buttons}>
                <button onClick={() => onEditClicked(note.id)} className={styles.button} data-testid={`edit-${note.id}`}>Edit</button>
                <button onClick={() => onDeleteClicked(note.id)} className={styles.button} data-testid={`delete-${note.id}`}>Delete</button>
              </div>
            </div>
          )
        }
      })
    } else {
      noteList = <p data-testid='empty-search-message'>No notes match your search.</p>
    }
    return (
      <>
        <span>
          Search:&nbsp;
          <input type='text' onChange={onSearchChanged} data-testid={'search'}/>
        </span>
        <br/>
        {noteList}
      </>
    )
  } else {
    return <p data-testid='empty-message'>You have no notes. Click &quot;Add note&quot; to add a note.</p>
  }
}
