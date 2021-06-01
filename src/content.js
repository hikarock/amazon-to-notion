chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== "fetchMetaData") {
    return;
  }
  const titleSelector = "#productTitle";
  const titleElm = document.querySelector(titleSelector);
  let title = "";
  if (titleElm !== null) {
    title = titleElm.textContent.trim();
  }
  const authorsSelector = ".author .a-link-normal";
  const authorsElm = document.querySelector(authorsSelector);
  let authors = "";
  if (authorsElm !== null) {
    authors = authorsElm.textContent.trim();
  }
  sendResponse({ title, authors });
});
