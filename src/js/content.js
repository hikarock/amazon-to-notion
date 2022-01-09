class Amazon {
  getTitle() {
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
  }

  getAuthors() {
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
  }

  getPublisher() {
    const selectorIcon1 = ".book_details-publisher";
    const selectorValue1 = ".rpi-attribute-value span";
    const selectorIcon2 = ".audiobook_details-publisher";
    const selectorValue2 = ".rpi-attribute-value span";
    let elm;
    if (
      document.querySelector(selectorIcon1) !== null &&
      document.querySelector(selectorValue1)
    ) {
      elm = document
        .querySelector(selectorIcon1)
        .parentNode.parentNode.querySelector(selectorValue1);
    } else if (
      document.querySelector(selectorIcon2) !== null &&
      document.querySelector(selectorValue2)
    ) {
      elm = document
        .querySelector(selectorIcon2)
        .parentNode.parentNode.querySelector(selectorValue2);
    }
    const publisher = elm ? elm.textContent.trim() : "";
    return publisher;
  }

  getPublicationDate() {
    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = `00${date.getMonth() + 1}`.slice(-2);
      const dd = `00${date.getDate()}`.slice(-2);
      return `${yyyy}-${mm}-${dd}`;
    };
    const selectorIcon1 = ".book_details-publication_date";
    const selectorValue1 = ".rpi-attribute-value span";
    const selectorIcon2 = ".audiobook_details-release-date";
    const selectorValue2 = ".rpi-attribute-value span";
    let elm;
    if (
      document.querySelector(selectorIcon1) !== null &&
      document.querySelector(selectorValue1)
    ) {
      elm = document
        .querySelector(selectorIcon1)
        .parentNode.parentNode.querySelector(selectorValue1);
    } else if (
      document.querySelector(selectorIcon2) !== null &&
      document.querySelector(selectorValue2)
    ) {
      elm = document
        .querySelector(selectorIcon2)
        .parentNode.parentNode.querySelector(selectorValue2);
    }
    const publicationDate = elm ? elm.textContent.trim().concat() : "";
    const [year, month, day] = publicationDate.split("/");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return formatDate(date);
  }

  getMediaType() {
    const asin = location.href.match(/dp\/(.+)\//)
      ? location.href.match(/dp\/(.+)\//)[1]
      : "";
    if (!/^B/.test(asin)) {
      return "Book";
    }
    const isAudible = document
      .querySelector("#dp")
      .classList.contains("audible");
    return isAudible ? "Audible" : "Kindle";
  }

  getCover() {
    const selector1 = "#img-wrapper .frontImage";
    const selector2 = "#ebooks-img-wrapper .frontImage";
    const selector3 = "#main-image";
    let elm;
    if (document.querySelector(selector1) !== null) {
      elm = document.querySelector(selector1);
    } else if (document.querySelector(selector2) !== null) {
      elm = document.querySelector(selector2);
    } else if (document.querySelector(selector3) !== null) {
      elm = document.querySelector(selector3);
    }
    const cover = elm ? elm.getAttribute("src") : "";
    return cover;
  }

  getMetaData() {
    return {
      title: this.getTitle(),
      authors: this.getAuthors(),
      publisher: this.getPublisher(),
      publicationDate: this.getPublicationDate(),
      mediaType: this.getMediaType(),
      cover: this.getCover(),
      url: location.href,
    };
  }
}

class Booklog {
  getTitle() {
    const titleSelector = '[itemprop="name"]';
    const titleElm = document.querySelector(titleSelector);
    const title = titleElm !== null ? titleElm.textContent.trim() : "";
    return title;
  }

  getAuthors() {
    const authorsSelector = '[itemprop="author"]';
    const authorsElm = document.querySelector(authorsSelector);
    const authors = authorsElm !== null ? authorsElm.textContent.trim() : "";
    return authors;
  }

  getPublisher() {
    const publisherSelector = '[itemprop="publisher"]';
    const publisherElm = document.querySelector(publisherSelector);
    const publisher =
      publisherElm !== null ? publisherElm.textContent.trim() : "";
    return publisher;
  }

  getPublicationDate() {
    const publicationDateSelector = '[itemprop="datePublished"]';
    const publicationDateElm = document.querySelector(publicationDateSelector);
    const publicationDate =
      publicationDateElm !== null
        ? publicationDateElm.getAttribute("content")
        : "";
    return publicationDate;
  }

  getMediaType() {
    const asinRegex = /\/item\/1\/(.+)/;
    const asin = location.href.match(asinRegex)[1]
      ? location.href.match(asinRegex)[1]
      : "";
    const mediaType = /^B/.test(asin) ? "Kindle" : "Book";
    return mediaType;
  }

  getCover() {
    const coverSelector = '[itemprop="thumbnailUrl"]';
    const coverElm = document.querySelector(coverSelector);
    const cover = coverElm !== null ? coverElm.getAttribute("src") : "";
    return cover;
  }

  getMetaData() {
    return {
      title: this.getTitle(),
      authors: this.getAuthors(),
      publisher: this.getPublisher(),
      publicationDate: this.getPublicationDate(),
      mediaType: this.getMediaType(),
      cover: this.getCover(),
      url: location.href,
    };
  }
}

const isAmazon = /^www.amazon\.(com|co\.jp)$/.test(location.hostname);
const isBooklog = /^booklog\.jp$/.test(location.hostname);

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== "fetchMetaData") {
    return;
  }
  if (!isAmazon && !isBooklog) {
    return;
  }
  const provider = isAmazon ? new Amazon() : new Booklog();
  const metaData = provider.getMetaData();
  sendResponse(metaData);
});
