const $ = require('jquery')
const remote = require('electron').remote;

function adjustLastList() {
    var lastList = $('.list:last-child','.sidemenu');
    if (lastList.length > 0) {
        lastList.css('max-height', parseInt($('.sidemenu').height() - lastList.position()['top']));
    }
}


window.onresize = adjustLastList;

window.onload = function() {
    adjustLastList();

    document.getElementById('window-close-button').addEventListener('click', function (e) {
        console.log('close');
        var thisWindow = remote.getCurrentWindow();
        thisWindow.close();
        thisWindow = null;
    });


    $('.splitbar').mousedown(function (e) {
        e.preventDefault();
        $(document).mousemove(function (e) {
            $('body', document).addClass('splitbar-dragging');
            e.preventDefault();
            $('.sidemenu').css('width', (e.pageX - $('.sidemenu').offset().left));
            $('.content').css('margin-left', $('.sidemenu').offset().left);
        })
    });
    
    $(document).mouseup(function (e) {
        $(document).unbind('mousemove');
        $('body', document).removeClass('splitbar-dragging');
    });
}
