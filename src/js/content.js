const isAmazon = /^www.amazon\.(com|co\.jp)$/.test(location.hostname);

const getTitleFromAmazon = () => {
  const selector1 = "#productTitle";
  const selector2 = "#ebooksTitle";
  const selector3 = "#title";
  let elm;
  if (document.querySelector(selector1) !== null) {
    elm = document.querySelector(selector1);
  } else if (document.querySelector(selector2) !== null) {
    elm = document.querySelector(selector2);
  } else if (document.querySelector(selector3) !== null) {
    elm = document.querySelector(selector3);
  }
  const title = elm ? elm.textContent.trim().replace(/\n|\r/g, "") : "";
  return title;
};

const getAuthorsFromAmazon = () => {
  const selector1 = "#contributorLink"; // PC
  const selector2 = "#bylineContributor"; // Mobile
  const selector3 = ".contributorNameID"; // Tablet1
  const selector4 = ".author .a-link-normal"; // Tablet2
  let elm;
  if (document.querySelector(selector1) !== null) {
    elm = document.querySelector(selector1);
  } else if (document.querySelector(selector2) !== null) {
    elm = document.querySelector(selector2);
  } else if (document.querySelector(selector3) !== null) {
    elm = document.querySelector(selector3);
  } else if (document.querySelector(selector4) !== null) {
    elm = document.querySelector(selector4);
  }
  const authors = elm ? elm.textContent.trim().replace(/　/g, " ") : "";
  return authors;
};

const getPublisherFromAmazon = () => {
  const selector1 = ".book_details-publisher";
  const selector2 = ".rpi-attribute-value span";
  let elm;
  if (
    document.querySelector(selector1) !== null &&
    document.querySelector(selector2)
  ) {
    elm = document
      .querySelector(selector1)
      .parentNode.parentNode.querySelector(selector2);
  }
  const publisher = elm ? elm.textContent.trim() : "";
  return publisher;
};

const getPublicationDateFromAmazon = () => {
  const selector1 = ".book_details-publication_date";
  const selector2 = ".rpi-attribute-value span";
  let elm;
  if (
    document.querySelector(selector1) !== null &&
    document.querySelector(selector2)
  ) {
    elm = document
      .querySelector(selector1)
      .parentNode.parentNode.querySelector(selector2);
  }
  const publicationDate = elm
    ? elm.textContent.trim().replaceAll("/", "-")
    : "";
  return publicationDate;
};

const getMediaTypeFromAmazon = () => {
  const asin = location.href.match(/dp\/(.+)\//)
    ? location.href.match(/dp\/(.+)\//)[1]
    : "";
  return /^B/.test(asin) ? "Kindle" : "Book";
};

const getCoverFromAmazon = () => {
  const selector1 = "#img-wrapper .frontImage";
  const selector2 = "#ebooks-img-wrapper .frontImage";
  let elm;
  if (document.querySelector(selector1) !== null) {
    elm = document.querySelector(selector1);
  } else if (document.querySelector(selector2) !== null) {
    elm = document.querySelector(selector2);
  }
  const cover = elm ? elm.getAttribute("src") : "";
  return cover;
};

const getMetaDataFromAmazon = () => {
  const title = getTitleFromAmazon();
  const authors = getAuthorsFromAmazon();
  const publisher = getPublisherFromAmazon();
  const publicationDate = getPublicationDateFromAmazon();
  const mediaType = getMediaTypeFromAmazon();
  const cover = getCoverFromAmazon();

  return { title, authors, publisher, publicationDate, mediaType, cover };
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
  const publicationDateSelector = '[itemprop="datePublished"]';
  const publicationDateElm = document.querySelector(publicationDateSelector);
  const publicationDate =
    publicationDateElm !== null
      ? publicationDateElm.getAttribute("content")
      : "";
  const coverSelector = '[itemprop="thumbnailUrl"]';
  const coverElm = document.querySelector(coverSelector);
  const cover = coverElm !== null ? coverElm.getAttribute("src") : "";
  const asinRegex = /\/item\/1\/(.+)/;
  const asin = location.href.match(asinRegex)[1]
    ? location.href.match(asinRegex)[1]
    : "";
  const mediaType = /^B/.test(asin) ? "Kindle" : "Book";
  return { title, authors, publisher, publicationDate, mediaType, cover };
};

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== "fetchMetaData") {
    return;
  }
  let metaData = {
    title: "",
    authors: "",
    publisher: "",
    publicationDate: "",
    mediaType: "Book",
    url: "",
    cover: "",
  };
  if (isAmazon) {
    metaData = getMetaDataFromAmazon();
  } else if (isBooklog) {
    metaData = getMetaDataFromBooklog();
  }
  metaData.url = location.href;
  sendResponse(metaData);
});
