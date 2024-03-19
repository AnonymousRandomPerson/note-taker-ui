import styles from './update-note.module.css';
import {ChangeEvent, useState} from 'react';
import {revalidatePathAction} from '@/app/actions';

const MIN_NOTE_LENGTH = 20;
const MAX_NOTE_LENGTH = 300;

export interface UpdateNoteProps {
  onClose: () => void;
  onConfirm: (noteContents: string) => Promise<void>;
  initNoteContents: string;
}

export default function UpdateNote({ onClose, onConfirm, initNoteContents }: UpdateNoteProps) {
  const [noteContents, setNoteContents] = useState(initNoteContents);
  const [confirmingNote, setConfirmingNote] = useState(false);
  let errorMessage = '';

  if (noteContents.length < MIN_NOTE_LENGTH) {
    errorMessage = `Note must be at least ${MIN_NOTE_LENGTH} characters. Currently ${noteContents.length} character${noteContents.length !== 1 ? 's' : ''}.`;
  } else if (noteContents.length > MAX_NOTE_LENGTH) {
    errorMessage = `Note must be at most ${MAX_NOTE_LENGTH} characters. Currently ${noteContents.length} characters.`;
  }

  function handleCancelNote() {
    onClose();
  }

  async function handleConfirmNote() {
    setConfirmingNote(true);
    try {
      await onConfirm(noteContents);
      setConfirmingNote(false);
      onClose();
      // Reload the note list after confirming the note.
      revalidatePathAction('/')
    } catch (e) {
      setConfirmingNote(false);
      throw e;
    }
  }

  function handleNoteChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setNoteContents(event.target.value);
  }

  return (
    <>
      <textarea className={styles.input} onChange={handleNoteChanged} value={noteContents} data-testid='add-note-input'/>
      <p className={styles.errorMessage} data-testid='error-message'>{errorMessage}</p>
      <div>
        <button className={styles.button} onClick={handleCancelNote} disabled={confirmingNote}>Cancel</button>
        <button className={styles.button} onClick={handleConfirmNote} disabled={confirmingNote || errorMessage !== ''}>Confirm</button>
      </div>
    </>
  );
}
