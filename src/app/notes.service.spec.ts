import {addNote, getNotes, SERVER_HOST, updateNote} from '@/app/notes.service';

describe('NotesService', () => {

  describe('getNotes', () => {
    it('should GET notes', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: true,
        json: () => Promise.resolve()
      }));

      await getNotes();

      expect(fetch).toHaveBeenCalledWith(SERVER_HOST, { method: 'GET' });
    });

    it('should throw error when request fails', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: false,
        status: 400
      }));

      try {
        await getNotes();
        fail('Expected error.');
      } catch (e) {
        expect((e as Error).message).toEqual('Response failed with status 400.');
      }
    });
  });

  describe('addNote', () => {
    it('should POST note', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: true,
        json: () => Promise.resolve()
      }));

      await addNote('New note');

      expect(fetch).toHaveBeenCalledWith(SERVER_HOST, {
        method: 'POST',
        body: JSON.stringify({ contents: 'New note' }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': SERVER_HOST,
          'Content-Type': 'application/json'
        }
      });
    });

    it('should throw error when request fails', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: false,
        status: 400
      }));

      try {
        await addNote('');
        fail('Expected error.');
      } catch (e) {
        expect((e as Error).message).toEqual('Response failed with status 400.');
      }
    });
  });

  describe('updateNote', () => {
    it('should PUT note', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: true,
        json: () => Promise.resolve()
      }));

      await updateNote(1, 'New note');

      expect(fetch).toHaveBeenCalledWith(`${SERVER_HOST}/1`, {
        method: 'PUT',
        body: JSON.stringify({ contents: 'New note' }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': SERVER_HOST,
          'Content-Type': 'application/json'
        }
      });
    });

    it('should throw error when request fails', async () => {
      global.fetch = jest.fn().mockReturnValue(Promise.resolve({
        ok: false,
        status: 400
      }));

      try {
        await updateNote(1, '');
        fail('Expected error.');
      } catch (e) {
        expect((e as Error).message).toEqual('Response failed with status 400.');
      }
    });
  });
});