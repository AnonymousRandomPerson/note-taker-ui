import '@testing-library/jest-dom'
import {act, fireEvent, render, screen} from '@testing-library/react';
import NotesList from '@/app/notes-list';
import UpdateNote, {UpdateNoteProps} from '@/app/update-note';
import {Mock} from 'jest-mock';
import AddNote from '@/app/add-note';
import {addNote, updateNote} from '@/app/notes.service';

jest.mock('./notes.service');
jest.mock('./update-note');

describe('NotesList', () => {

  const NOTES = [
    {
      id: 1,
      contents: 'Note 1'
    },
    {
      id: 2,
      contents: 'Note 2'
    }
  ];

  it('should render empty message when there are no notes', () => {
    render(<NotesList notes={[]}/>);

    expect(screen.queryByTestId('empty-message')).toBeInTheDocument();
  });

  it('should render notes when there are notes', () => {
    render(<NotesList notes={NOTES}/>);

    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
    const note1 = screen.queryByTestId('note-1');
    expect(note1).toBeInTheDocument();
    expect(note1).toHaveTextContent('Note 1');
    const note2 = screen.queryByTestId('note-2');
    expect(note2).toBeInTheDocument();
    expect(note2).toHaveTextContent('Note 2');
  });

  it('should render UpdateNote when a note is edited', () => {
    render(<NotesList notes={NOTES}/>);

    fireEvent.click(screen.getByTestId('edit-1'));
    expect(UpdateNote).toHaveBeenCalledTimes(1);
    expect(((UpdateNote as Mock).mock.calls[0][0] as UpdateNoteProps).initNoteContents).toEqual('Note 1');
    expect(screen.queryByTestId('note-1')).not.toBeInTheDocument();
    const note2 = screen.queryByTestId('note-2');
    expect(note2).toBeInTheDocument();
    expect(note2).toHaveTextContent('Note 2');
  });

  it('should hide UpdateNote and render note when editing is cancelled', () => {
    render(<NotesList notes={NOTES}/>);

    fireEvent.click(screen.getByTestId('edit-1'));
    const onClose = ((UpdateNote as Mock).mock.calls[0][0] as UpdateNoteProps).onClose;
    (UpdateNote as Mock).mockClear();
    act(() => onClose());

    expect(UpdateNote).not.toHaveBeenCalled();

    expect(screen.queryByTestId('note-1')).toBeInTheDocument();
    expect(screen.queryByTestId('note-2')).toBeInTheDocument();
  });

  it('should call updateNotes after UpdateNote is confirmed', async () => {
    (updateNote as Mock).mockImplementation(() => Promise.resolve());
    render(<NotesList notes={NOTES}/>);

    fireEvent.click(screen.getByTestId('edit-1'));

    const onConfirm = ((UpdateNote as Mock).mock.calls[0][0] as UpdateNoteProps).onConfirm;
    await onConfirm('Note new');

    expect(updateNote).toHaveBeenCalledWith(1, 'Note new');
  });
});