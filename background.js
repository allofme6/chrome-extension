chrome.runtime.onInstalled.addListener(function() {
    // chrome.storage.sync.set({color: '#3aa757'}, function() {
    //     console.log('The color is green.');
    // });
    chrome.webNavigation.onCompleted.addListener(function() {
        chrome.tabs.query({active: true}, tabs => {
            console.log('tabs: ', tabs.url);
            chrome.cookies.getAll({
                url: 'http://manage.neibu.koolearn.com'
            }, function(res) {
                localStorage.setItem('devCookies', JSON.stringify(res))
            });
        });
    });

    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //     chrome.declarativeContent.onPageChanged.addRules([{
    //         conditions: [new chrome.declarativeContent.PageStateMatcher({
    //             pageUrl: {hostEquals: 'devmanage.neibu.koolearn.com'},
    //         })
    //     ],
    //         actions: [new chrome.declarativeContent.ShowPageAction()]
    //   }]);
    // });

    // chrome.contextMenus.create({
    //     "id": "sampleContextMenu",
    //     "title": "Sample Context Menu",
    //     "contexts": ["page"]
    // });
});


chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.initiator && details.initiator.indexOf('dev') !== -1) {
            var devCookies = JSON.parse(localStorage.getItem('devCookies'));
            var devCookiesStr = '';
            devCookies.forEach((item) => {
                devCookiesStr += item.name + '=' + item.value + ';'
            })
            details.requestHeaders.push({
                name: 'Cookie',
                value: devCookiesStr,
            })
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders", "extraHeaders"]
);
