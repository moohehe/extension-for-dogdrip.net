'use strict';

// 목록 단축키 문자 (3부터 시작, 1=추천/2=붐업 충돌 방지)
const KEY_LIST = ['3','4','5','6','7','8','9','q','w','e','r','t','a','s','d','f','g','z','x','c','v','b','n','m','h','j','k','l'];

let listKeyHandler = null;
let currentFocusIndex = -1;

function updateListFocus(liItems, newIndex) {
    if (newIndex < 0 || newIndex >= liItems.length) return;
    liItems.forEach(li => li.classList.remove('dd-list-focus'));
    currentFocusIndex = newIndex;
    liItems[newIndex].classList.add('dd-list-focus');
    liItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── 유틸 ──────────────────────────────────────────────

// URL에서 게시글 고유번호(document_srl) 추출
// 예: /708794087  /dogdrip/708777293?sort_index=...
function extractDocSrl(url) {
    if (!url) return null;
    const match = url.match(/\/(\d{5,})(?:[/?#]|$)/);
    return match ? match[1] : null;
}

// ── 게시글 목록 파싱 ──────────────────────────────────

// 현재 페이지의 <li h5 a> 구조에서 게시글 링크 수집
function getArticleList() {
    const seen = new Set();
    const articles = [];

    document.querySelectorAll('li h5 a').forEach(a => {
        const srl = extractDocSrl(a.href);
        if (srl && !seen.has(srl)) {
            seen.add(srl);
            articles.push(a.href);
        }
    });

    return articles;
}

// 현재 URL이 목록 내 몇 번째인지 반환 (-1이면 없음)
function getCurrentIndex(articles) {
    const currentSrl = extractDocSrl(location.href);
    if (!currentSrl) return -1;
    return articles.findIndex(url => extractDocSrl(url) === currentSrl);
}

// ── 이전/다음 게시글 이동 ─────────────────────────────

function moveArticle(direction) {
    const articles = getArticleList();
    if (articles.length === 0) {
        showMessage('게시글 목록을 찾을 수 없습니다.');
        return;
    }

    const current = getCurrentIndex(articles);
    if (current === -1) {
        showMessage('현재 게시글을 목록에서 찾을 수 없습니다.');
        return;
    }

    const target = current + (direction === 'prev' ? -1 : 1);
    if (target >= 0 && target < articles.length) {
        location.href = articles[target];
    } else {
        showMessage('이동할 수 없습니다.');
    }
}

// ── 목록 이동 + 단축키 모드 ───────────────────────────

function moveToList() {
    const items = document.querySelectorAll('li h5 a');
    if (items.length === 0) {
        showMessage('게시글 목록을 찾을 수 없습니다.');
        return;
    }

    // 라벨 부여 기준으로 단일 목록 구성 (li, href 쌍)
    const seenSrl = new Set();
    const articleEntries = []; // { li, href, a }
    items.forEach(a => {
        const li = a.closest('li');
        if (!li) return;
        if (li.querySelector('#npl-list-bottom')) return; // 숨겨진 더미 li 제외
        articleEntries.push({ li, href: a.href, a });
    });

    if (articleEntries.length === 0) {
        showMessage('게시글 목록을 찾을 수 없습니다.');
        return;
    }

    const liItems  = articleEntries.map(e => e.li);
    const articles = articleEntries.map(e => e.href);

    // 단축키 라벨 부여 (같은 articleEntries 순서 기준)
    articleEntries.forEach(({ a }, i) => {
        if (i >= KEY_LIST.length) return;
        const span = document.createElement('span');
        span.className = 'dd-ext-key';
        span.textContent = KEY_LIST[i];
        a.insertBefore(span, a.firstChild);
    });

    // 초기 포커스: 현재 보고 있는 게시글(li.current), 없으면 첫 번째
    const currentLi = document.querySelector('ul.ed.list li.current');
    let initialIndex = 0;
    if (currentLi) {
        const idx = liItems.indexOf(currentLi);
        if (idx !== -1) initialIndex = idx;
    }
    updateListFocus(liItems, initialIndex);

    // 포커스된 항목으로 스크롤
    liItems[initialIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });

    showMessage('↑↓: 이동  Enter: 선택  알파벳: 바로 이동  ESC: 취소');

    listKeyHandler = (e) => {
        if (e.key === 'Escape') {
            removeListMode();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            updateListFocus(liItems, currentFocusIndex + 1);
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            updateListFocus(liItems, currentFocusIndex - 1);
            return;
        }
        if (e.key === 'Enter') {
            if (currentFocusIndex >= 0 && currentFocusIndex < articles.length) {
                location.href = articles[currentFocusIndex];
            }
            return;
        }
        const idx = KEY_LIST.indexOf((e.key || '').toLowerCase());
        if (idx !== -1 && idx < articles.length) {
            location.href = articles[idx];
        }
    };

    document.addEventListener('keydown', listKeyHandler);
}

function removeListMode() {
    if (listKeyHandler) {
        document.removeEventListener('keydown', listKeyHandler);
        listKeyHandler = null;
    }
    document.querySelectorAll('.dd-ext-key').forEach(el => el.remove());
    document.querySelectorAll('.dd-list-focus').forEach(el => el.classList.remove('dd-list-focus'));
    currentFocusIndex = -1;

    const boardList = document.querySelector('div.ed.board-list');
    if (boardList) {
        boardList.setAttribute('tabindex', '-1');
        boardList.focus({ preventScroll: true });
    }
}

// ── 메시지 박스 ───────────────────────────────────────

function showMessage(msg) {
    let box = document.getElementById('dd-ext-msgbox');
    if (box) {
        clearTimeout(box._timer);
        box.remove();
    }

    box = document.createElement('div');
    box.id = 'dd-ext-msgbox';
    box.className = 'dd-ext-msgbox';
    box.textContent = msg;
    document.body.appendChild(box);

    box._timer = setTimeout(() => {
        box.classList.add('dd-ext-fade');
        setTimeout(() => box.remove(), 500);
    }, 2500);
}

// ── 도움말 박스 ───────────────────────────────────────

function initHelperBox() {
    // 도움말 본체
    const box = document.createElement('div');
    box.id = 'dd-helper';
    box.innerHTML = `
        <div class="dd-helper-title">Dogdrip 확장 v2.0</div>
        <div class="dd-helper-body">
            <div><kbd>Ctrl</kbd>+<kbd>←</kbd> 이전 게시글</div>
            <div><kbd>Ctrl</kbd>+<kbd>→</kbd> 다음 게시글</div>
            <div><kbd>Ctrl</kbd>+<kbd>↓</kbd> 목록+단축키</div>
        </div>
        <button class="dd-helper-close" id="dd-close-btn">닫기</button>
    `;
    document.body.appendChild(box);

    // 최소화 버튼
    const mini = document.createElement('button');
    mini.id = 'dd-mini-btn';
    mini.className = 'dd-mini-btn';
    mini.title = 'Dogdrip 확장 도움말';
    mini.textContent = '?';
    document.body.appendChild(mini);

    // 저장된 표시 상태 복원
    chrome.storage.sync.get('helperVisible', ({ helperVisible }) => {
        applyHelperVisible(helperVisible !== false);
    });

    document.getElementById('dd-close-btn').addEventListener('click', () => applyHelperVisible(false));
    mini.addEventListener('click', () => applyHelperVisible(true));
}

function applyHelperVisible(visible) {
    const box = document.getElementById('dd-helper');
    const mini = document.getElementById('dd-mini-btn');
    if (box)  box.style.display  = visible ? '' : 'none';
    if (mini) mini.style.display = visible ? 'none' : '';
    chrome.storage.sync.set({ helperVisible: visible });
}

// ── 메시지 수신 (background → content script) ────────

chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case 'prev': moveArticle('prev'); break;
        case 'next': moveArticle('next'); break;
        case 'list': moveToList();        break;
    }
});

// ── 초기화 ────────────────────────────────────────────

// 메인 홈 페이지(목록 없는 경우)에서는 도움말만 표시하지 않음
const path = location.pathname;
if (path !== '/' && path !== '') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHelperBox);
    } else {
        initHelperBox();
    }
}
