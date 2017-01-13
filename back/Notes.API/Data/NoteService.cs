using Notes.API.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.API.Data
{
    public class NoteService
    {
        private readonly ApplicationDbContext _context;

        public NoteService()
        {
            _context = new ApplicationDbContext();
        }

        public List<NoteContainer> Get(string userId)
        {
            return _context.NoteContainers.Where(x => x.UserId == userId).Include(x=>x.Notes).ToList();
        }

        public NoteContainer Get(int containerId)
        {
            return _context.NoteContainers.FirstOrDefault(x => x.ID == containerId);
        }

        internal async Task<NoteContainer> CreateContainer(string name, string userId)
        {
            var container = new NoteContainer();
            container.Name = name;
            container.UserId = userId;

            container =  _context.NoteContainers.Add(container);

            await _context.SaveChangesAsync();

            return container;
        }

        internal async Task<Note> CreateNote(string userId, int containerId, string todo)
        {
            var note = new Note();
            note.Content = todo;
            note.NoteContainerID = containerId;

            note = _context.Notes.Add(note);

            await _context.SaveChangesAsync();

            return note;
        }

        internal async Task RemoveContainer(NoteContainer container)
        {
            _context.Entry(container).State = EntityState.Deleted;

            await _context.SaveChangesAsync();
        }

        internal async Task RemoveNote(int noteId)
        {
            var note = _context.Notes.FirstOrDefault(x => x.ID == noteId);

            if (note != null)
                _context.Entry(note).State = EntityState.Deleted;

            await _context.SaveChangesAsync();
        }
    }
}
