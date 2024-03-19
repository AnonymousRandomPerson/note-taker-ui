import '@testing-library/jest-dom'
import {act, fireEvent, render, screen} from '@testing-library/react'
import AddNote from '@/app/add-note';
import {addNote} from './notes.service';
import {Mock} from 'jest-mock';
import UpdateNote, {UpdateNoteProps} from '@/app/update-note';

jest.mock('./notes.service');
jest.mock('./update-note');

describe('AddNote', () => {
  const VALID_NOTE = 'New note that is long enough';

  it('should render Add button and no input on init', () => {
    render(<AddNote/>);

    expect(screen.queryByText('Add note')).toBeEnabled();

    expect(UpdateNote).not.toHaveBeenCalled();
  });

  it('should render input after Add button is clicked', () => {
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    expect(addNoteButton).toBeDisabled();
    expect(UpdateNote).toHaveBeenCalled();
  });

  it('should render Add button and not UpdateNote after UpdateNote is closed', async () => {
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    const onClose = ((UpdateNote as Mock).mock.calls[0][0] as UpdateNoteProps).onClose;
    (UpdateNote as Mock).mockClear();
    act(() => onClose());

    expect(addNoteButton).toBeEnabled();
    expect(UpdateNote).not.toHaveBeenCalled();
  });

  it('should call addNotes after UpdateNote is confirmed', async () => {
    (addNote as Mock).mockImplementation(() => Promise.resolve());
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    const onConfirm = ((UpdateNote as Mock).mock.calls[0][0] as UpdateNoteProps).onConfirm;
    await onConfirm(VALID_NOTE);

    expect(addNote).toHaveBeenCalledWith(VALID_NOTE);
  });
});
