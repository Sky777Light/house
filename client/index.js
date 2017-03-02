var start = function(){
  var options ={};
  var scriptTag = document.getElementById("wiewir-3d-div");
  options.scene = scriptTag.getAttribute("data-scene");
  options.height = scriptTag.getAttribute("data-height");
  options.url = 'http://3d-widget.wie-wir.de/index.html';

  getData(options);
}


function getData(options){
  var widget = makeWidget(options);
  if (document.getElementsByTagName('body')[0] == undefined){
    document.addEventListener("DOMContentLoaded", function(event){putWidget(widget);});
  }

  else{
    putWidget(widget);
  }

  document.addEventListener('page:change', function(){putWidget(widget);});
}

function makeWidget(options){

  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", options.url);
  ifrm.style.width = "100%";
  ifrm.style.height = options.height;
  ifrm.id = 'wiewir-widget-frame';

  return ifrm;
}


function putWidget(widget){
  document.getElementById('wiewir-3d-div').appendChild(widget);
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  var theUrl = 'http://3d-widget.wie-wir.de/client/api.js';
  s.src = theUrl + ( theUrl.indexOf("?") >= 0 ? "&" : "?") + 'ref=' + encodeURIComponent(window.location.href);
  var embedder = document.getElementById('wiewir-3d-div');
  embedder.parentNode.insertBefore(s, embedder);
}

window.myWidget = new start()
