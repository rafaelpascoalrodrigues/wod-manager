const $ = require('jquery')
const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

var openingContent = false;


function browserwindowMaximized() {
    $('.titlebar').addClass('maximized');
}

function browserwindowUnmaximized() {
    $('.titlebar').removeClass('maximized');
}


function adjustLastList() {
    var lastList = $('.list:last-child','.sidemenu');
    if (lastList.length > 0) {
        lastList.css('max-height', parseInt($('.sidemenu').height() - lastList.position()['top']));
    }
}


window.onresize = adjustLastList;

window.onload = function() {
    adjustLastList();

    ipcRenderer.on('browserwindow-maximized', browserwindowMaximized);
    ipcRenderer.on('browserwindow-unmaximized', browserwindowUnmaximized);

    $('#window-minimize-button').click(function (e) {
        remote.getCurrentWindow().minimize();
    });

    $('#window-maximize-button').click(function (e) {
        remote.getCurrentWindow().maximize();
    });

    $('#window-restore-button').click(function (e) {
        remote.getCurrentWindow().restore();
    });

    $('#window-close-button').click(function (e) {
        remote.getCurrentWindow().close();
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


    $('.action-open-content').click(function (e) {
        var content = $(e.currentTarget).data('content');
        
        if (typeof content == 'undefined') {
            console.error("open content " + content + ": 400");
            return 400;
        }

        openingContent = true;

        $.ajax({
            type: "GET",
            url: content + '.html',
            cache: false,
            async: true,
            error: function(e) {
                console.error("open content '" + content + "': 404");
            },
            success: function() {
                $('.content').load(content + '.html');
            },
            complete: function() {
                openingContent = false;
            }
        });
    });
}
