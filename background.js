'use strict';

// 단축키 커맨드를 content script에 메시지로 전달
chrome.commands.onCommand.addListener(async (command) => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url || !tab.url.includes('www.dogdrip.net/')) return;

        chrome.tabs.sendMessage(tab.id, { action: command });
    } catch (e) {
        // 탭이 없거나 content script 미로딩 상태일 수 있음
        console.error('[dogdrip-ext]', e);
    }
});
