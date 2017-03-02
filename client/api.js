function WWWidget(){
    const iframe_tagret_window = document.getElementById('wiewir-widget-frame').contentWindow;

    var channel = function(message)
    {
        iframe_tagret_window.postMessage(message, 'http://3d-widget.wie-wir.de');
    }

    this.setSize = function(width, height)
    {
        channel({method: 'setSize', params: [width, height]});
    }
}
