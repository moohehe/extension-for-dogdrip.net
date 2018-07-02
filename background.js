'use strict';
var current_url;
var key_list = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'];
   

// When page's status be 'complete', js file insert
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    //console.log('tab : ' + tab.status + ', ' + tab.url + ', '+ tab.title);
    console.log('url : ' + tab.url);
    if (tab.url.indexOf('http://www.dogdrip.net') > -1 
        && tab.url != 'http://www.dogdrip.net' 
        && tab.url != 'http://www.dogdrip.net/'
        && tab.url != 'www.dogdrip.net' ) { // dogdrip.net
            
        if (tab.status == 'complete') {
            chrome.tabs.executeScript(tab.id, {
                    file:'dogdrip.js'
                },
                function(result) {
                    console.log('completed insert method! ' + tabId);
                }
            );
            chrome.tabs.insertCSS(null, {file:'mycss.css'});
            setTimeout(function() {
            chrome.tabs.executeScript(tab.id, {
                code : 'initialDogdrip()'
            }, function(result) {
                console.log('initialDogdrip() run!');
            });
            },1000);
            
        }
    }
    /*else if (tab.url.indexOf('ruliweb.com') > -1) { // ruliweb.com
        if (tab.status == 'complete') {
            chrome.tabs.executeScript(tab.id, {
                file : 'ruliweb.js'
                }, function(result) {
                    console.log('completed insert method! ' + tabId);
                });

        }
    }*/
});


// detect ctrl+> ctrl+< 
chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({active:true, currentWindow:true},function(tabs) {
        current_url = tabs[0].url;
        
        if (current_url.indexOf('www.dogdrip.net/') != -1 || current_url.indexOf('bbs.ruliweb.com/') != -1) {
            console.log('start of command : ',command);
            console.log('요기');
            
            if (command == 'prev') {
                chrome.tabs.executeScript(tabs[0].id,  {
                    code : 'moveArticleDogdrip("prev")'
                },function() {
                    console.log('prev run!');
                })
            }
            else if (command == 'next') {
                chrome.tabs.executeScript(tabs[0].id,  {
                    code : 'moveArticleDogdrip("next")'
                },function() {
                    console.log('next run!');
                })
            }
            else if (command == 'list') {
                chrome.tabs.executeScript(tabs[0].id, {
                    code : 'moveArticleList()'                    
                },function() {
                    console.log('view list of articles');
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
                        console.log('press key "'+selected_key_number+'"');
                    })
                }
            }
            
            console.log('end of command : ',command);
        }
        else {
            console.log('not dogdrip.net');
        }
    });
});

let listOfArticle = new Array(); // list of article's url
let currentArticle = 0;
let listOfPage = new Array(); // list of page's url
let currentPage = 0;





// dogdrip.net
function getListArticle(){ 
    console.log('getListArticle() run!');

    chrome.tabs.query({active:true, currentWindow:true},function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code: 'document.querySelector("tbody")'
            }, 
            function(result) {
                console.log('asfd : "' + result+'"');
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
    console.log('start of getlistPage');
    // get ListofPage
    tr = $('.pagination').children();
    tr.each(function(i) {
        listOfPage[i] = tr.eq(i).attr('href');
        
        if (listOfPage == '' ){
            currentPage = i;
            console.log('current Page : '+ currentPage);
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





