using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace Waterdeep
{
    public partial class Waterdeep : System.Web.UI.Page
    {
        static List<string> TheModel = new List<string>();
        static List<DataObject> Population;
        static string directory = "";
        protected void Page_Load(object sender, EventArgs e)
        {

            directory = Server.MapPath("Assets") + "\\";
            try
            {
           
            }
            catch (Exception E)
            {

            }
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod()]
        public static DataObject[] GetData(string TheMessage)
        {
            try
            {
                if (TheMessage == "Value")
                {
                    Population = FileHandler.ReadPopulationFile(directory + "Population.txt");
                    return Population.ToArray();
                }
                if (TheMessage == "Icon")
                {

                    Population = FileHandler.ReadFeaturesFile(directory + "Features.txt");
                    return Population.ToArray();
                }

            }
            catch (Exception ex)
            {

            }
            return new List<DataObject>().ToArray();
        }

        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod()]
        public static bool AddHeatmapRecord(DataObject data)
        {
            try
            {
                string row = $"{data.lat},{data.lng},{data.weight}";
                FileHandler.WriteFile(directory + "Population.txt", row);
            }
            catch (Exception ex)
            {
                return false;
            }
            finally { }
            return true;
        }


        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod()]
        public static bool AddFeatureRecord(DataObject data)
            {
            try
            {
                string row = $"{data.lat},{data.lng},{data.icon},{data.name}";
                FileHandler.WriteFile(directory + "Features.txt", row);
            }
            catch (Exception ex)
            {
                return false;
            }
            finally { }
            return true;
        }


    }

    public class FileHandler    
    {
        public static List<DataObject> ReadPopulationFile(string file)
        {
            try
            {
                using (var sr = new StreamReader(file))
                {
                    List<DataObject> markers = new List<DataObject>();
                    var content = sr.ReadToEnd();
                    if (content != null)
                    {
                        var lines = content.Trim().Split('\r','\n');
                        foreach (var line in lines)
                        {
                            var fields = line.Split(',');
                            if (fields.Count() < 3)
                                continue;

                            DataObject marker = new DataObject
                            {
                                type = (int)DataType.Population,
                                lat = Convert.ToDouble(fields[0]),
                                lng = Convert.ToDouble(fields[1]),
                                weight = Convert.ToDouble(fields[2]),
                            };
                            markers.Add(marker);
                        }
                        return markers;
                    }
                }
            }
            catch { }
            return new List<DataObject>();
        }

        public static List<DataObject> ReadFeaturesFile(string file)
        {
            try
            {
                using (var sr = new StreamReader(file))
                {
                    List<DataObject> markers = new List<DataObject>();
                    var content = sr.ReadToEnd();
                    if (content != null)
                    {
                        var lines = content.Trim().Split('\r', '\n');
                        foreach (var line in lines)
                        {
                            var fields = line.Split(',');
                            if (fields.Count() < 4)
                                continue;

                            DataObject marker = new DataObject
                            {
                                type = (int)DataType.Features,
                                lat = Convert.ToDouble(fields[0]),
                                lng = Convert.ToDouble(fields[1]),
                                icon = fields[2],
                                name = fields[3],
                            };
                            markers.Add(marker);
                        }
                        return markers;
                    }
                }
            }
            catch { }
            return new List<DataObject>();
        }

        public static void WriteFile(string path, string row)
        {
            try
            {
                bool append = File.Exists(path);
                using (var sw = new StreamWriter(path, append))
                {
                    sw.WriteLine(row);
                }
            }
            catch { }
        }
    }

    public class DataObject
    {
        public double weight;
        public double lat;
        public double lng;
        public string icon;
        public string name;
        public int type;
    }

    public enum DataType
    {
        Population, Features
    }
}