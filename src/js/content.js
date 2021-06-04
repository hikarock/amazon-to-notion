const isAmazon = /^www.amazon\.(com|co\.jp)$/.test(location.hostname);

const getMetaDataFromAmazon = () => {
  const titleSelector = "#productTitle";
  const titleElm = document.querySelector(titleSelector);
  const title = titleElm !== null ? titleElm.textContent.trim() : "";
  const authorsSelector = ".author .a-link-normal";
  const authorsElm = document.querySelector(authorsSelector);
  const authors = authorsElm !== null ? authorsElm.textContent.trim() : "";
  const publisherElm = document
    .querySelector(".book_details-publisher")
    .parentNode.parentNode.querySelector(".rpi-attribute-value span");
  const publisher =
    publisherElm !== null ? publisherElm.textContent.trim() : "";
  return { title, authors, publisher };
};

const isBooklog = /^booklog\.jp$/.test(location.hostname);

const getMetaDataFromBooklog = () => {
  const titleSelector = '[itemprop="name"]';
  const titleElm = document.querySelector(titleSelector);
  const title = titleElm !== null ? titleElm.textContent.trim() : "";
  const authorsSelector = '[itemprop="author"]';
  const authorsElm = document.querySelector(authorsSelector);
  const authors = authorsElm !== null ? authorsElm.textContent.trim() : "";
  const publisherSelector = '[itemprop="publisher"]';
  const publisherElm = document.querySelector(publisherSelector);
  const publisher =
    publisherElm !== null ? publisherElm.textContent.trim() : "";
  return { title, authors, publisher };
};

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== "fetchMetaData") {
    return;
  }
  let metaData = { title: "", authors: "", publisher: "" };
  if (isAmazon) {
    metaData = getMetaDataFromAmazon();
  } else if (isBooklog) {
    metaData = getMetaDataFromBooklog();
  }
  metaData.url = location.href;
  sendResponse(metaData);
});
