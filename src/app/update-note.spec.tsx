import '@testing-library/jest-dom'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {revalidatePathAction} from './actions';
import UpdateNote from '@/app/update-note';

jest.mock('./actions');

describe('UpdateNote', () => {
  const VALID_NOTE = 'New note that is long enough';
  const EMPTY_ON_CLOSE = () => {};
  const EMPTY_ON_CONFIRM = () => Promise.resolve();

  it('should render empty input', () => {
    render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents=''/>);

    expect(screen.queryByDisplayValue('')).toBeInTheDocument();
  });

  it('should display init note contents in input', () => {
    render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents='??'/>);

    expect(screen.queryByDisplayValue('??')).toBeInTheDocument();
  });

  it('should call onClose after canceling', () => {
    const onClose = jest.fn();
    render(<UpdateNote onClose={onClose} onConfirm={EMPTY_ON_CONFIRM} initNoteContents=''/>);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onConfirm and onClose after confirming', async () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn().mockReturnValue(Promise.resolve());
    render(<UpdateNote onClose={onClose} onConfirm={onConfirm} initNoteContents=''/>);

    fireEvent.change(screen.getByTestId('add-note-input'), { target: { value: VALID_NOTE } });
    fireEvent.click(screen.getByText('Confirm'));

    expect(onConfirm).toHaveBeenCalledWith(VALID_NOTE);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(revalidatePathAction).toHaveBeenCalledWith('/');

    // Wait for render from confirmation being set off and on.
    await new Promise(process.nextTick);
  });

  describe('error message', () => {
    it('should error if note is too short', () => {
      render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents=''/>);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 0 characters.');
    });

    it('should show number of characters', () => {
      render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents='AAAAA'/>);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 5 characters.');
    });

    it('should use singular word "character" if there is one character', () => {
      render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents='A'/>);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at least 20 characters. Currently 1 character.');
    });

    it('should show error if note is too large', () => {
      render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents={'a'.repeat(301)}/>);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Note must be at most 300 characters. Currently 301 characters.');
    });

    it('should not show error if note length is valid', () => {
      render(<UpdateNote onClose={EMPTY_ON_CLOSE} onConfirm={EMPTY_ON_CONFIRM} initNoteContents={VALID_NOTE}/>);

      expect(screen.getByTestId('error-message')).toHaveTextContent('');
    });
  });
});
