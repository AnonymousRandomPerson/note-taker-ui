import '@testing-library/jest-dom'
import {fireEvent, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import AddNote from "@/app/add-note";
import {addNote} from './notes.service';
import {revalidatePathAction} from './actions';
import {Mock} from "jest-mock";

jest.mock('./notes.service');
jest.mock('./actions');

describe('AddNote', () => {
  const VALID_NOTE = 'New note that is long enough';

  it('should render Add button and no input on init', () => {
    render(<AddNote/>);

    expect(screen.queryByText('Add note')).toBeEnabled();

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-note-input')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('should render input after Add button is clicked', () => {
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    expect(addNoteButton).toBeDisabled();
    expect(screen.queryByTestId('add-note-input')).toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('Confirm')).toBeInTheDocument();
  });

  it('should render Add button and no input after canceling add', () => {
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    fireEvent.click(screen.getByText('Cancel'));

    expect(addNoteButton).toBeEnabled();
    expect(screen.queryByTestId('add-note-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('should render Add button and no input after confirming add', async () => {
    (addNote as Mock).mockImplementation(() => Promise.resolve());
    render(<AddNote/>);

    const addNoteButton = screen.getByText('Add note');
    fireEvent.click(addNoteButton);

    fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: VALID_NOTE } });
    fireEvent.click(screen.getByText('Confirm'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('add-note-input'));
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    expect(addNoteButton).toBeEnabled();
    expect(addNote).toHaveBeenCalledWith(VALID_NOTE);
    expect(revalidatePathAction).toHaveBeenCalledWith('/');
  });

  describe('error message', () => {
    it('should error if note is too short', () => {
      render(<AddNote/>);

      const addNoteButton = screen.getByText('Add note');
      fireEvent.click(addNoteButton);
      fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: '' } });

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 0 characters.');
    });

    it('should show number of characters', () => {
      render(<AddNote/>);

      const addNoteButton = screen.getByText('Add note');
      fireEvent.click(addNoteButton);
      fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: 'AAAAA' } });

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 5 characters.');
    });

    it('should use singular word "character" if there is one character', () => {
      render(<AddNote/>);

      const addNoteButton = screen.getByText('Add note');
      fireEvent.click(addNoteButton);
      fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: 'A' } });

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 1 character.');
    });

    it('should show error if note is too large', () => {
      render(<AddNote/>);

      const addNoteButton = screen.getByText('Add note');
      fireEvent.click(addNoteButton);
      fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: 'a'.repeat(301) } });

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at most 300 characters. Currently 301 characters.');
    });

    it('should not show error if note length is valid', () => {
      render(<AddNote/>);

      const addNoteButton = screen.getByText('Add note');
      fireEvent.click(addNoteButton);
      fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: VALID_NOTE } });

      expect(screen.getByTestId('error-message')).toHaveTextContent('');
    });
  });
})