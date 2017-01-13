using Microsoft.AspNet.Identity;
using Notes.API.Data;
using Notes.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Notes.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/note")]
    public class NoteController : ApiController
    {
        private readonly NoteService _noteService;

        public NoteController()
        {
            _noteService = new NoteService();
        }

        [Route]
        public IHttpActionResult Get()
        {
            var id = User.Identity.GetUserId();
            return Ok(_noteService.Get(id));
        }

        [Route()]
        [HttpPost]
        public async Task<IHttpActionResult> Post(string name)
        {
            var id = GetUserId();
            var container = await _noteService.CreateContainer(name, id);

            if (container != null)
                return Ok(container.ID);

            return InternalServerError();

        }

        [Route("{containerId:int}")]
        [HttpPost]
        public async  Task<IHttpActionResult> Post(int containerId, string todo)
        {
            var id = GetUserId();

            var container = _noteService.Get(containerId);

            if (container == null)
                return NotFound();

            if (container.UserId != id)
                return Unauthorized();

            var note = await _noteService.CreateNote(id, containerId, todo);

            if (note != null)
                return Ok(note.ID);

            return InternalServerError();
        }

        [Route("{containerId:int}")]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int containerId)
        {
            var id = GetUserId();

            var container = _noteService.Get(containerId);

            if (container == null)
                return NotFound();

            if (container.UserId != id)
                return Unauthorized();

            await _noteService.RemoveContainer(container);

            return Ok();
        }

        [Route("{containerId:int}/{noteId:int}")]
        public async Task<IHttpActionResult> Delete(int containerId, int noteId)
        {
            var id = GetUserId();

            var container = _noteService.Get(containerId);

            if (container == null)
                return NotFound();

            if (container.UserId != id)
                return Unauthorized();

            await _noteService.RemoveNote(noteId);

            return Ok();
        }



        private string GetUserId()
        {
            return User.Identity.GetUserId();
        }


    }
}
