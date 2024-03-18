import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react";
import NotesList from "@/app/notes-list";

describe('NotesList', () => {

  it('should render empty message when there are no notes', () => {
    render(<NotesList notes={[]}/>);

    expect(screen.queryByTestId('empty-message')).toBeInTheDocument();
  });

  it('should render notes when there are notes', () => {
    render(<NotesList notes={[
      {
        id: 1,
        contents: 'Note 1'
      },
      {
        id: 2,
        contents: 'Note 2'
      }
    ]}/>);

    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
    const note1 = screen.queryByTestId('note-1');
    expect(note1).toBeInTheDocument();
    expect(note1).toHaveTextContent('Note 1');
    const note2 = screen.queryByTestId('note-2');
    expect(note2).toBeInTheDocument();
    expect(note2).toHaveTextContent('Note 2');
  });
});