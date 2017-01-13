using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.API.Models
{
    public class NoteContainer
    {
        public NoteContainer()
        {
            Notes = new List<Note>();
        }
        public int ID { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Note> Notes { get; set; }
        public string UserId { get; set; }
    }
}
