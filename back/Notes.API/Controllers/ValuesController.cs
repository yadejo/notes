using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Notes.API.Controllers
{
    [RoutePrefix("api/values")]
    public class ValuesController : ApiController
    {
        public string[] Get()
        {
            using (var contex = new Models.ApplicationDbContext())
            {
                contex.Database.CreateIfNotExists();
                contex.Database.Initialize(true);
                contex.Notes.ToList();
            }
                return new string[] { "nicolas", "zawada" };
        }
    }
}
