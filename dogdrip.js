var listOfArticleDogdrip = new Array();
var currentArticleDogdrip = -1;
var listOfPageDogdrip = new Array();
var currentPageDogdrip = -1;


var key_list = ['3','4','5','6','7','8', '9', 'q','w','e','r','t','a','s','d','f','g','z','x','c','v','b','n','m','h','j','k','l'];
var keycode_list = [51,52,53,54,55,56,57,/*1~9*/113,119,101,114,116,97,115,100,102,103,122,120,99,118,98,110,109,104,106,107,108];



// 초기화
function initialDogdrip() { 
    
    var tag;
    tag = '<div id="helper-box" class="helper_box"><div class="helper-box-title">도움말</div>';
    tag += '<div class="heler-box-content">'
    tag += 'Ctrl + ← : 이전게시글로 이동<br>';
    tag += 'Ctrl + → : 다음게시글로 이동<br>';
    tag += 'Ctrl + ↓ : 목록으로 이동 + 단축키 부여<br></div>';
    tag += '<div id="hide-helper-btn" class="helper_btn"><button id="hidebtn" class="helper-btn">></button></div></div>';
    tag += '<div id="view-helper-btn" class="helper_btn"><button id="viewbtn" class="helper-btn"><</button></div>';
    

    // tag 삽입하기
    var doc = document.body;
    doc.innerHTML = document.body.innerHTML + tag;
    document.getElementById('hidebtn').onclick = function() {helper_box(false)};
    document.getElementById('viewbtn').onclick = function() {helper_box(true)};
    chrome.storage.sync.get(null, function(result) {
        console.log('result : ' + result.helper);
        if (result.helper == null) {
            helper_box(true);
            return false;
        }
        else {
            helper_box(result.helper);
        }
    });
}


function helper_box(select) {
    chrome.storage.sync.set({'helper' : select},function() {
        console.log('saved data : '+ select);
    });
    console.log('helper_box('+select+') run!');
    // select : true = view / false = hide
    var helperbox = document.getElementById('helper-box');
    var hide_box = document.getElementById('hide-helper-btn');
    var view_box = document.getElementById('view-helper-btn');
    
    if (select) {
        view_box.style.display = 'none';
        hide_box.style.display = '';
        helperbox.style.display = '';
    } else {
        view_box.style.display = '';
        hide_box.style.display = 'none';
        helperbox.style.display = 'none';
    }
}
        

// insert cannot-Move msgbox
function cannotMoveArticleDogdrip(message) {
    //alert('message length '+message.length);
    var message_length = message.length*22;
    console.log('start of cannotMoveArticleDogdrip()');
    let tag = '<div id="msg" class="helper_msgbox">'+message+'</div>';
    
    let tag2 = '<div id="msg" class="helper_msgbox">';
    tag2 += '<div class="helper_msgbox_text" style="width:'+message_length+'px;';
    tag2 += 'margin-left:-'+(message_length/2)+'px;">';
    tag2 += message+'</div></div>';
    tag = tag2;
    
    // 이전에 실행한거 없애기
    let msg = document.getElementById('msg');
    if (msg != null)  msg.remove();

    // 메세지 박스 fadeOut();
    let doc = document.body;
    time = 3000;
    doc.innerHTML = doc.innerHTML + tag;
    $('#msg').fadeOut(time);
    console.log('end of cannotMoveArticlDogdrip()');
}

function getListOfArticleDogdrip() {
    var tr;
    tr = $('tbody').children();
    
    tr.each(function(i) { // get ListOfArticleDogdrip
        //console.log(i);
        listOfArticleDogdrip[i] = getArticleDogdrip(tr.eq(i));
        if (listOfArticleDogdrip[i] == 0 ) {
            currentArticleDogdrip = i;
            //console.log('current article Dogdrip : ' + currentArticleDogdrip);
        }
    });
    console.log('end of listOfArticle()\n');
    return listOfArticleDogdrip;
}


function getArticleDogdrip(tr) { 
    let td = tr.children();
    //console.log(td.eq(0).text());
    if (td.eq(0).text() == '') {
        return 0;
    }
    
    let component = td.eq(1).children();
    //console.log('주소 : '+component.eq(0).attr('href'));
    return component.eq(0).attr('href');
}


function moveArticleDogdrip(select) {
    getListOfArticleDogdrip();
    console.log('moveArticle('+select+') run!');
    let move = 0; // left : -1 , right : 1
    if (select == 'prev') {
        move = -1;
    }
    if (select == 'next') {
        move = 1;
    }
    // check article index
    if ( (currentArticleDogdrip+move) >= 0 && (currentArticleDogdrip+move) < listOfArticleDogdrip.length) {
        location.href = listOfArticleDogdrip[move+currentArticleDogdrip];
    }
    else {
        console.log('currentArticleDodgdrip : ' + currentArticleDogdrip);
        console.log('move : ' + move);
        console.log('cannotMoveArticleDogdrip() run : '+ (currentArticleDogdrip+move));
        // out range of article list
        cannotMoveArticleDogdrip('이동할 수 없습니다.');
    }
}



// Press 'Ctrl+Down'
function moveArticleList() {
    var table1 = document.getElementsByClassName("boardList")[0];
    table1.scrollIntoView();
    
    // 1. select table
    var table2 = $('.boardList').children();
    console.log('table2 : '+ table2);
    
    console.log('kkkk : '+ table2.length);
    // 2. select tbody
    var trs = table2.eq(1).children();
    
    console.log('tr.length : '+ trs.length);
    
    console.log('tr : ' + trs);
    
    trs.each(function(i) {
        console.log('tr run! '+ i);
        var tr = new Array();
        // 3. select tr
        tr = trs.eq(i).children();
        
        var td = tr.eq(0);
        console.log('td ' + td.text());
        td.html('<span id="key_'+key_list[i]+'" style="color:red;">'+key_list[i]+'</span>');
    });

    chrome.storage.sync.set({set_list:true},null);
    
    let doc = document.body;
    
    doc.addEventListener('keypress', function(e) {
        getListOfArticleDogdrip();
        console.log(e + ' : ' + e.keyCode);
        if (e.keyCode == 49) {
            voteDogdrip('voteup');
            return false;
        }else if (e.keyCode == 50) {
            voteDogdrip('voteDown');
            return false;
        }
        else{
            var article_num = keycode_list.indexOf(e.keyCode);
            console.log ('article_num : ' + article_num);
            if (article_num != -1 && article_num <keycode_list.length)
                location.href= listOfArticleDogdrip[article_num];
        }
    },false);

    cannotMoveArticleDogdrip('빨간색으로 표시된 키를 누르면 이동합니다.');
}






// 단축키 눌러서 이동하기
function moveArticleDogdripByPressHotKey(selected_key_number) {
    console.log('moveArticleDogdripByPressHotKey() run!');
    // selected_key_number : 선택된 게시글 순번
    getListOfArticleDogdrip();
    
    alert('listOfArticleDogdrip : ' + listOfArticleDogdrip);
    alert('listOfArtcicleDogdrip[selec~~]'+listOfArticleDogdrip[selected_key_number]);
    location.href = listOfArticleDogdrip[selected_key_number];
    //alert('selected_key_number : '+ selected_key_number);
}


var document_srl;
var current_mid;
function voteDogdrip(element) {
    var btn_vote = document.getElementsByClassName('btnRv');
    //alert('btn_vote.length : ' + btn_vote.length);
    if (element == 'voteup' && confirm('정말 추천하시겠습니까?')) {
        var btn_voteup = document.getElementsByClassName('btn_voted')[0];
        btn_voteup.click();
    }else if (element == 'votedown'&& confirm('정말 붐업하시겠습니까?')) {
        var btn_votedown = document.getElementsByClassName('btn_blamed')[0];
        btn_votedown.click();
    }
}
