'use strict';
var current_url;
var key_list = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'];

// detect ctrl+> ctrl+< 
chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({active:true, currentWindow:true},function(tabs) {
        current_url = tabs[0].url;
        
        if (current_url.indexOf('www.dogdrip.net/') != -1 ) {
            printlog('start of command : '+ command);
            //printlog('tabs[0].url=' + tabs[0].url);
            if (command == 'prev') {
                chrome.tabs.executeScript(tabs[0].id,  {
                    code : 'moveArticleDogdrip("prev")'
                },function() {
                    printlog('prev run!');
                })
            }
            else if (command == 'next') {
                chrome.tabs.executeScript(tabs[0].id,  {
                    code : 'moveArticleDogdrip("next")'
                },function() {
                    printlog('next run!');
                })
            }
            else if (command == 'list') {
                chrome.tabs.executeScript(tabs[0].id, {
                    code : 'moveArticleList()'                    
                },function() {
                    printlog('view list of articles');
                })
            }
            // 목록 직접 이동하기
            else {
                var selected_key_number = key_list.indexOf(command);
                alert('command : '+ command + 'selected_key_number : '+selected_key_number);
                if (selected_key_number != -1) {
                    chrome.tabs.executeScript(tabs[0].id, {
                        code : 'moveArticleDogdripByPressHotKey('+selected_key_number+')'
                    },function() {
                        printlog('press key "'+selected_key_number+'"');
                    })
                }
            }
            
            printlog('end of command : '+command);
        }
        else {
            printlog('not dogdrip.net');
        }
    });
});

let listOfArticle = new Array(); // list of article's url
let currentArticle = 0;
let listOfPage = new Array(); // list of page's url
let currentPage = 0;





// dogdrip.net
function getListArticle(){ 
    printlog('getListArticle() run!');

    chrome.tabs.query({active:true, currentWindow:true},function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code: 'document.querySelector("tbody")'
            }, 
            function(result) {
                printlog('result : "' + result+'"');
                //tr = tabs[0].getElementById('tbody');
                tr = result;
        });
        

        // get List of Dogdrip Articles
        chrome.tabs.executeScript(tabs[0].id, {
            code : 'getListOfArticleDogdrip()'
            }
            , function(result) {
                listOfArticle = result;
        });
    });
}



let tr = new Array();
function getListPage() {
    printlog('start of getlistPage');
    // get ListofPage
    tr = $('.pagination').children();
    tr.each(function(i) {
        listOfPage[i] = tr.eq(i).attr('href');
        
        if (listOfPage == '' ){
            currentPage = i;
            printlog('current Page : '+ currentPage);
        }
    });
}


function fadeOut_js(id)
{
    var level = 1;
    var outTimer = null;
    outTimer = setInterval( function(){ level = fadeOutAction(id, level, outTimer); }, 50 );
}
 
function fadeOutAction(id, level, outTimer)
{
    level = level - 0.02;
    changeOpacity(id, level);
    if(level < 0) 
    {
        clearInterval(outTimer);
    }
    return level;
}
 
function changeOpacity(id,level) 
{
    var obj = document.getElementById(id);
    obj.style.opacity = level; 
    obj.style.MozOpacity = level; 
    obj.style.KhtmlOpacity = level;
    obj.style.MsFilter = "'progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (level * 100) + ")'";
    obj.style.filter = "alpha(opacity=" + (level * 100) + ");"; 
}

function moveBoardList() {
    document.getElementsByTagName('table')[0].id = 'list';
    document.getElementsByTagName('list').scrollIntoView();
}

