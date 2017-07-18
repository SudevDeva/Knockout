using System.Web;
using System.Web.Mvc;

namespace Knockout_Demo_Test_Sudev
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}