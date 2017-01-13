using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.API.Models
{
    public class Note
    {
        public Note()
        {

        }
        public int ID { get; set; }
        public bool IsComplete { get; set; }
        public string Content { get; set; }
        public int NoteContainerID { get; set; }

        [JsonIgnore]
        public virtual NoteContainer NoteContainer { get; set; }
    }
}
