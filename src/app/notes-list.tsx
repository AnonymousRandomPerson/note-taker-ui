import React from "react";
import {Note} from "@/app/models";

interface NotesListProps {
  notes: Note[];
}

export default function NotesList({ notes }: NotesListProps) {
  if (notes.length) {
    return (
      notes.map(note => (
        <div key={note.id} data-testid={`note-${note.id}`}>
          {note.contents}
        </div>
      ))
    );
  } else {
    return (
      <p data-testid='empty-message'>You have no notes. Click &quot;Add note&quot; to add a note.</p>
    );
  }
}
