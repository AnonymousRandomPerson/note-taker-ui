import styles from "./page.module.css";
import {getNotes} from "@/app/notes.service";
import NotesList from "@/app/notes-list";
import AddNote from "@/app/add-note";

export default async function NotesHome() {
  let notes = await getNotes();

  return (
    <main>
      <div className={styles.body}>
        <AddNote/>
        <NotesList notes={notes}/>
      </div>
    </main>
  );
}
