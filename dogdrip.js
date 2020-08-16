var listOfArticleDogdrip = new Array();
var currentArticleDogdrip = -1;
var listOfPageDogdrip = new Array();
var currentPageDogdrip = -1;


var key_list = ['3','4','5','6','7','8', '9', 'q','w','e','r','t','a','s','d','f','g','z','x','c','v','b','n','m','h','j','k','l'];
var keycode_list = [51,52,53,54,55,56,57,/*1~9*/113,119,101,114,116,97,115,100,102,103,122,120,99,118,98,110,109,104,106,107,108];



function initialDogdrip() { 
    
    // 도움말 상자 on/off onclick event 등록
    document.getElementById('hidebtn').onclick = function() {helper_box(false)};
    document.getElementById('viewbtn').onclick = function() {helper_box(true)};
    chrome.storage.sync.get(null, function(result) {
        //printlog('result : ' + result.helper);
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
        printlog('helper_box saved : ' + (select?'on':'off'));
    });
    //printlog('helper_box('+select+') run!');
    setTimeout(function() {
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
    }, 50);
}
        

// insert cannot-Move msgbox
function cannotMoveArticleDogdrip(message) {
    //alert('message length '+message.length);
    var message_length = message.length*22;
    printlog('start of cannotMoveArticleDogdrip()');
    
    let tag = '<div id="msg" class="helper_msgbox">';
    tag += '<div class="helper_msgbox_text" style="width:'+message_length+'px;';
    tag += 'margin-left:-'+(message_length/2)+'px;">';
    tag += message+'</div></div>';
    
    // 이전에 실행한거 없애기
    let msg = document.getElementById('msg');
    if (msg != null)  msg.remove();

    // 메세지 박스 fadeOut();
    let doc = document.body;
    time = 3000; // 3 sec
    doc.innerHTML = doc.innerHTML + tag;
    $('#msg').fadeOut(time);
    printlog('end of cannotMoveArticlDogdrip()');
}

function getListOfArticleDogdrip() {
    printlog('getListOfAricleDogdrip run!');
    var tr;
    tr = $('tbody').children();
    printlog('tr : ' + tr.html());
    tr.each(function(i) { // get ListOfArticleDogdrip
        //printlog(i);
        listOfArticleDogdrip[i] = getArticleDogdrip(tr.eq(i));
        //printlog('listOfArticleDogdrip[' + i +'] : '+listOfArticleDogdrip[i]);
        if (listOfArticleDogdrip[i] == document.URL ) {
            currentArticleDogdrip = i;
            printlog('current article Dogdrip : ' + currentArticleDogdrip);
        }
    });
    printlog('length of listOfArtilcle() :' + listOfArticleDogdrip.length);
    printlog('end of listOfArticle()\n');
    return listOfArticleDogdrip;
}


function getArticleDogdrip(tr) { 
    //printlog('getArticleDogdrip start');
    let td = tr.children();
    printlog('td.eq(0).text() : '+ td.eq(0).text());
    if (td.eq(0).text() == '') {
        return 0;
    }
    
    let component = td.eq(0).children();
    printlog('주소 : '+component.eq(0).children().eq(0).attr('href'));
    printlog('getArticleDogdrip end');
    return component.eq(0).children().eq(0).attr('href');
}


function moveArticleDogdrip(select) {
    getListOfArticleDogdrip();
    printlog('moveArticle('+select+') run!');
    setTimeout( function() {

        let move = 0; // left : -1 , right : 1
        if (select == 'prev') {
            move = -1;
        }
        if (select == 'next') {
            move = 1;
        }
        // check article index
        if ( (currentArticleDogdrip+move) >= 0 && (currentArticleDogdrip+move) < listOfArticleDogdrip.length) {
            printlog('listOfArticleDogdrip[move+currentArticleDogdrip] : ' + listOfArticleDogdrip[move+currentArticleDogdrip]);
            location.href = listOfArticleDogdrip[move+currentArticleDogdrip];
        }
        else {
            printlog('currentArticleDodgdrip : ' + currentArticleDogdrip);
            printlog('move : ' + move);
            printlog('cannotMoveArticleDogdrip() run : '+ (currentArticleDogdrip+move));
            // out range of article list
            cannotMoveArticleDogdrip('이동할 수 없습니다.');
        }
    }, 1000);
}



// Press 'Ctrl+Down'
function moveArticleList() {
    printlog('단축키 부여');
    var table1 = document.getElementsByClassName("table-divider")[0];
    table1.scrollIntoView();
    
    // 1. select table
    var table2 = $('.table-divider').children();
    //printlog('table2 : '+ table2);
    
    //printlog('kkkk : '+ table2.length);
    // 2. select tbody
    var trs = table2.eq(1).children();
    
    //printlog('tr.length : '+ trs.length);
    
    //printlog('tr : ' + trs);
    trs.each(function(i) {
        //printlog('tr run! '+ i);
        var tr = new Array();
        // 3. select tr
        tr = trs.eq(i).children();
        
        // 4. show red shortcut key 
        var td = new Array();
        td = tr.eq(0).children();
        td = tr.eq(0).children().eq(0).children();
        td.html('<span id="key_'+key_list[i]+'" style="color:red;">'+key_list[i]+'</span>' + td.html());

    });

    chrome.storage.sync.set({set_list:true},null);
    
    let doc = document.body;
    doc.addEventListener('keypress', function(e) {
        getListOfArticleDogdrip();
        printlog('addEventListener(keypres)');
        printlog(e + ' : ' + e.keyCode);
        if (e.keyCode == 49) {
            voteDogdrip('voteup');
            return false;
        }else if (e.keyCode == 50) {
            voteDogdrip('voteDown');
            return false;
        }
        else{
            var article_num = keycode_list.indexOf(e.keyCode);
            printlog ('article_num : ' + article_num);
            if (article_num != -1 && article_num <keycode_list.length)
                location.href= listOfArticleDogdrip[article_num];
        }
    },false);

    cannotMoveArticleDogdrip('빨간색으로 표시된 키를 누르면 이동합니다.');
}






// 단축키 눌러서 이동하기
function moveArticleDogdripByPressHotKey(selected_key_number) {
    printlog('moveArticleDogdripByPressHotKey() run!');
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

chrome.storage.local.get( null, function (items) {
    printlog("run chrome.storage.local.get( null, function (items)");
    printlog("document.URL.indexOf('http://www.dogdrip.net')" + document.URL.indexOf('http://www.dogdrip.net'));
    if (document.URL.indexOf('https://www.dogdrip.net') != 0 ){
       //  && tab.url != 'https://www.dogdrip.net' 
       //  && tab.url != 'https://www.dogdrip.net/'
       //  && tab.url != 'www.dogdrip.net' ) {
         return;
     }
     
     function DOMContentLoaded_function() {
        printlog("run DOMContentLoaded_function() ");
        $(`<div id="helper-box" class="helper_box" style="display:none;"><div class="helper-box-title">도움말</div>
        <div class="heler-box-content">
        <span>Ctrl + ← : 이전게시글로 이동</span><br>
        <span>Ctrl + → : 다음게시글로 이동</span><br>
        <span>Ctrl + ↓ : 목록으로 이동 + 단축키 부여</span><br></div>
        <div id="hide-helper-btn" class="helper_btn"><button id="hidebtn" class="helper-btn">></button></div></div>
        <div id="view-helper-btn" class="helper_btn"><button id="viewbtn" class="helper-btn"><</button></div>
        `).insertAfter("div.footer > div.container");

        initialDogdrip();
     }

     if(document.readyState === "loading"){
        printlog("document.readyState === 'loading'");
         document.addEventListener("DOMContentLoaded", function() {
             DOMContentLoaded_function();
         });
     }
     else{ // interactive complete
        printlog("document.readyState === " + document.readyState);
         DOMContentLoaded_function();
     }
});


// var ajaxComment = function(item) {
    
//     // // 유효성 검사
//     // if (!procFilter(this, insert_comment)) {
//     //     return;
//     // }
//     var commentForm = $('');
//     $.ajax({
//         url: './',
//         type: 'POST',
//         data: $(this).serializeArray(),
//         success : function(data) {
//             printlog(data);
//         },
//         error: function(XMLHttpRequest, textStatus, errorThrown) { 
//             alert("Status: " + textStatus); alert("Error: " + errorThrown); 
//         }   
//     });
// };





// 댓글구역 버튼 변경
function setCommentArea() {
    printlog("setCommentArea start!");
    var commentAreaArray = $('div.comment-form-body').children();
    var buttonArea = commentAreaArray.eq(1).children().eq(1);
    

    // 필요없을지도.. 확인해볼것
    var textAreaStr = '<textarea id="temp-266081775" class="ed textarea" style="resize: none; overflow: hidden; overflow-wrap: break-word; height: 58px;"></textarea>';
    
    
    // 버튼 
    var buttonStr = '<div>';
    buttonStr += '<button type="button" id="submitCommentNew" onclick="ajaxComment();" class="ed button button-primary button-small button-rounded">등록new</button>';
    buttonStr += '<button type="button" id="submitVoteNew" onclick="ajaxComment(); return beCheckWrite(this)" class="ed button button-primary button-small button-rounded">등록 + 추천 new</button>';
    buttonStr += '<script type="text/javascript">';
    buttonStr += '      (function($){';
    buttonStr += '          $(function(){';
    buttonStr += '              $("#submitCommentNew").click(function(){';
    buttonStr += '                  $("#document_vote1").remove();';
    buttonStr += '                  console.log("subsmitCopmmentNew click!");';                    
    buttonStr += '              });';
    buttonStr += '              $("#submitVoteNew").click(function(){';
    buttonStr += '                  $("#document_vote2").remove();';
    buttonStr += '                  $(this).after(\'<input type="hidden" name="document_vote" value="Y" id="document_vote" />\');';
    buttonStr += '                  console.log("submitVoteNew click!");';  
    buttonStr += '              });';
    buttonStr += '          });';
    buttonStr += '      })(jQuery);';


    // ajax 설정
    buttonStr += '      function ajaxComment() {';
    buttonStr += '          $.ajax({';
    buttonStr += '                  url: "./",';
    buttonStr += '                  type: "POST",';
    buttonStr += '                  data: $("write_comment").serializeArray(),';
    buttonStr += '                  success : function(data) {';
    buttonStr += '                      console.log($("write_comment"));';
    buttonStr += '                      console.log(data);';
    buttonStr += '                  },';
    buttonStr += '                  error: function(XMLHttpRequest, textStatus, errorThrown) { ';
    buttonStr += '                      alert("Status: " + textStatus); alert("Error: " + errorThrown);';
    buttonStr += '                  }';
    buttonStr += '          });';
    buttonStr += '      };';


    // buttonStr += '      function insert_comment(form){';
    //     return legacy_filter('insert_comment',form,'board','procBoardInsertComment',completeInsertComment,['error','message','mid','document_srl','comment_srl'],'',{})};
    //     (function($){var v=xe.getApp('validator')[0];if(!v)return false;v.cast("ADD_FILTER",["insert_comment",{'document_srl':{required:true},'nick_name':{required:true,maxlength:20},'password':{required:true},'email_address':{maxlength:250,rule:'email'},'homepage':{maxlength:250,rule:'url'},'content':{required:true,minlength:1}}]);v.cast('ADD_MESSAGE',['document_srl','문서번호']);v.cast('ADD_MESSAGE',['nick_name','닉네임']);v.cast('ADD_MESSAGE',['password','비밀번호']);v.cast('ADD_MESSAGE',['email_address','이메일 주소']);v.cast('ADD_MESSAGE',['homepage','홈페이지']);v.cast('ADD_MESSAGE',['content','내용']);v.cast('ADD_MESSAGE',['mid','모듈 이름']);v.cast('ADD_MESSAGE',['comment_srl','comment_srl']);v.cast('ADD_MESSAGE',['parent_srl','parent_srl']);v.cast('ADD_MESSAGE',['is_secret','is_secret']);v.cast('ADD_MESSAGE',['notify_message','notify_message']);v.cast('ADD_MESSAGE',['isnull','%s 값은 필수입니다.']);v.cast('ADD_MESSAGE',['outofrange','%s의 글자 수를 맞추어 주세요.']);v.cast('ADD_MESSAGE',['equalto','%s이(가) 잘못되었습니다.']);v.cast('ADD_MESSAGE',['invalid','%s의 값이 올바르지 않습니다.']);v.cast('ADD_MESSAGE',['invalid_email','%s의 값은 올바른 메일 주소가 아닙니다.']);v.cast('ADD_MESSAGE',['invalid_userid','%s의 값은 영문, 숫자, _만 가능하며 첫 글자는 영문이어야 합니다.']);v.cast('ADD_MESSAGE',['invalid_user_id','%s의 값은 영문, 숫자, _만 가능하며 첫 글자는 영문이어야 합니다.']);v.cast('ADD_MESSAGE',['invalid_homepage','%s의 형식이 잘못되었습니다.(예: https://www.rhymix.org/)']);v.cast('ADD_MESSAGE',['invalid_url','%s의 형식이 잘못되었습니다.(예: https://www.rhymix.org/)']);v.cast('ADD_MESSAGE',['invalid_korean','%s의 형식이 잘못되었습니다. 한글로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_korean_number','%s의 형식이 잘못되었습니다. 한글과 숫자로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_alpha','%s의 형식이 잘못되었습니다. 영문으로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_alpha_number','%s의 형식이 잘못되었습니다. 영문과 숫자로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_mid','%s의 형식이 잘못되었습니다. 첫 글자는 영문으로 시작해야 하며 \'영문+숫자+_\'로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_number','%s의 형식이 잘못되었습니다. 숫자로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_float','%s의 형식이 잘못되었습니다. 숫자로만 입력해야 합니다.']);v.cast('ADD_MESSAGE',['invalid_extension','%s의 형식이 잘못되었습니다. *.* 나 *.jpg;*.gif; 처럼 입력해야 합니다.']);})(jQuery);

    //     function completeInsertCommentNew(ret_obj){
    //         var error=ret_obj.error;var message=ret_obj.message;var mid=ret_obj.mid;
    //         var document_srl=ret_obj.document_srl;var comment_srl=ret_obj.comment_srl;
    //         if(
    //             ret_obj.redirect_url){redirect(ret_obj.redirect_url);
    //         }else{
    //             var url=current_url.setQuery('mid',mid).setQuery('document_srl',document_srl).setQuery('act','');
    //             if(comment_srl)url=url.setQuery('rnd',comment_srl)+"#comment_"+comment_srl;redirect(url);
    //         }
    //     }

    buttonStr += '</script>';

    buttonStr += buttonArea.html();
    
    buttonArea.html(buttonStr);

    printlog("setCommentArea end!");
};



function setTextareaReplaceCommentByAddons() {
    var str = document.getElementById("temp-266081775").value;
    str = "<p>" + str.replace(/(?:\r\n|\r|\n)/g, "</p>\r\n<p>") + "</p>";
    str = str.replaceAll("<p></p>", "<p>&nbsp;</p>");
    document.getElementById("editor-266081775").value = str;
};


  
  (function($){
    $(function(){
        $('#submitComment').click(function(){
            $('#document_vote').remove();
        });
        $('#submitVote').click(function(){
            $('#document_vote').remove();
            $(this).after('<input type="hidden" name="document_vote" value="Y" id="document_vote" />');
        });
    });
})(jQuery);
