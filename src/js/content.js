const isAmazon = () => {
  return /^www.amazon\.(com|co\.jp)$/.test(location.hostname);
};

const getMetaDataFromAmazon = () => {
  const titleSelector = "#productTitle";
  const titleElm = document.querySelector(titleSelector);
  const title = titleElm !== null ? titleElm.textContent.trim() : "";
  const authorsSelector = ".author .a-link-normal";
  const authorsElm = document.querySelector(authorsSelector);
  const authors = authorsElm !== null ? authorsElm.textContent.trim() : "";
  return { title, authors };
};

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== "fetchMetaData") {
    return;
  }
  const metaData = isAmazon()
    ? getMetaDataFromAmazon()
    : { title: "", authors: "" };
  sendResponse(metaData);
});
