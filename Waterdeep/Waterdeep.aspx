<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Waterdeep.aspx.cs" Inherits="Waterdeep.Waterdeep" %>

<!DOCTYPE html>
<meta name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Waterdeep</title>
    <link rel="stylesheet" type="text/css" href="CSS/foundation.css" />
    <link rel="stylesheet" type="text/css" href="CSS/Waterdeep.css" />
</head>
<body>
    <form id="form1" runat="server">

        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="row">
                    <fieldset>
                     <legend>Waterdeep Guild of GIS</legend>
                     <div class="left" style="width:50%">
                    <img src="IMG/Waterdeep.png" style="width:280px;height:200px;"/>
                     </div>
                    <div>
                        <ul>
                            <li>
                                <label><strong>Coded by Chido</strong></label>
                            </li>
                            <li>
                        <label><strong>Student Number 1158222</strong></label><br />

                            </li>
                            <li>
                        <label><strong>METH 6005 Exam</strong></label>

                            </li>
                        </ul>
                     </div>
                       </fieldset>
                </div>
            </div>
        </div>

        <div class="left clear">
            <div id="BaseMap" style="min-height:750px;"></div>
        </div>
        <div class="right" style="min-height:750px;">
            <div class="column row">
                <fieldset>
                    <legend>Waterdeep Guild of GIS</legend>

                    <strong>Heat</strong>
                    <select id="ValueSelector" onchange="SetValue('Value');">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <strong>Icon</strong>
                    <select id="IconSelector" onchange="SetValue('Icon');">
                        <option value=""></option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/donut.png">⚪ Shaft To Surface</option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/square.png">⬜ Junction Room </option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/triangle.png">△ Sewer Outlet</option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/polygon.png">⬡ Junction Room/Shaft to Surface</option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/star.png">✩ Statue</option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/open-diamond.png">◇ Unlockable Grating</option>
                        <option value="http://maps.google.com/mapfiles/kml/shapes/info-i.png">🛈 Mail Box</option>
                    </select>
                    <div class="row">
                     <div class="columns small-6"> <strong>Street/Elevation</strong>
                    <input type="number" id="NumberSelector" min="0"></input>

                     </div>
                    <div class="columns small-6">
                       
                    </div>
                    </div>
                   
                    <div class="row">
                        <div class="columns small-4">
                            <input type="checkbox" id="LabelCheck" name="LabelCheck" onclick="ToggleLabel()"><label for="LabelCheck">Labels</label><br>
                        </div>
                        <div class="columns small-4">
                            <input type="checkbox" id="MarkerCheck" name="MarkerCheck" onclick="ToggleMarker()"><label for="MarkerCheck">Markers</label><br>
                        </div>
                        <div class="columns small-4">
                            <input type="checkbox" id="SewerCheck" name="SewerCheck" onclick="ToggleSewer()"><label for="SewerCheck">Sewer</label><br>
                        </div>
                    </div>
                    <div class="row">
                        <div class="columns small-4">
                            <input type="checkbox" id="PolyCheck" name="PolyCheck" onclick="TogglePoly()"><label for="PolyCheck">Polygons</label><br>
                        </div>
                        <div class="columns small-4">
                            <input type="checkbox" id="KMLCheck" name="KMLCheck" onclick="ToggleKML()"><label for="KMLCheck">Base KML</label><br>
                        </div>
                        <div class="columns small-4">
                            <input type="checkbox" id="HeatCheck" name="HeatCheck" onclick="ToggleHeatMap()"><label for="HeatCheck">Population</label><br>
                        </div>
                    </div>
                    <div class="row">
                        <div class="columns small-4">
                            <input type="checkbox" id="OverlayCheck" name="OverlayCheck" onclick="ToggleOverlay()"><label for="KMLCheck">Overlays</label><br>                          
                        </div>
                         <div class="columns small-4">
                             <input type="checkbox" id="Gradient" name="GradientCheck" onclick="ToggleGradient()"><label for="GradientCheck">Gradient</label><br>
                        </div>
                    </div>
                    <div class="row">
                        <div class="columns small-4">
                            <p id="IconCount"></p>
                        </div>
                        <div class="columns small-4">
                            <p id="HeatCount"></p>
                        </div>
                        <div class="columns small-4">
                            <p id="SewerCount"></p>
                        </div>
                    </div>



                </fieldset>

            </div>
        </div>



        </div>

    

  
       


              


                       

     <asp:ScriptManager ID="ScriptManager" runat="server" EnablePageMethods="true"></asp:ScriptManager>
        <script src="JS/Waterdeep.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script async src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAX6haxPnf_GlOOJLMl4XX-_y9id7NBzh8&libraries=visualization&callback=initMap"> </script>

    </form>
</body>



</html>
