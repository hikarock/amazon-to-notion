class Amazon {
  findElm(selectors = []) {
    let elm = null
    for (const selector of selectors) {
      if (document.querySelector(selector) !== null) {
        elm = document.querySelector(selector)
        break
      }
    }
    return elm
  }

  findCarouselElm(selectors) {
    let elm = null
    for (const selector of selectors) {
      if (document.querySelector(selector.icon) !== null && document.querySelector(selector.value) !== null) {
        elm = document.querySelector(selector.icon).parentNode.parentNode.querySelector(selector.value)
        break
      }
    }
    return elm
  }

  getTitle() {
    const selector1 = '#productTitle'
    const selector2 = '#ebooksTitle'
    const selector3 = '#title'
    const elm = this.findElm([selector1, selector2, selector3])
    const title = elm ? elm.textContent.trim().replace(/\n|\r/g, '') : ''
    return title
  }

  getAuthors() {
    const selector1 = '#contributorLink'
    const selector2 = '#bylineContributor'
    const selector3 = '.contributorNameID'
    const selector4 = '.author .a-link-normal'
    const elm = this.findElm([selector1, selector2, selector3, selector4])
    const authors = elm ? elm.textContent.trim().replace(/　/g, ' ') : ''
    return authors
  }

  getPublisher() {
    const selectorIcon1 = '.book_details-publisher'
    const selectorValue1 = '.rpi-attribute-value span'
    const selectorIcon2 = '.audiobook_details-publisher'
    const selectorValue2 = '.rpi-attribute-value span'
    const elm = this.findCarouselElm([
      { icon: selectorIcon1, value: selectorValue1 },
      { icon: selectorIcon2, value: selectorValue2 },
    ])
    const publisher = elm ? elm.textContent.trim() : ''
    return publisher
  }

  getPublicationDate() {
    const formatDate = (date) => {
      const yyyy = date.getFullYear()
      const mm = `00${date.getMonth() + 1}`.slice(-2)
      const dd = `00${date.getDate()}`.slice(-2)
      return `${yyyy}-${mm}-${dd}`
    }
    const selectorIcon1 = '.book_details-publication_date'
    const selectorValue1 = '.rpi-attribute-value span'
    const selectorIcon2 = '.audiobook_details-release-date'
    const selectorValue2 = '.rpi-attribute-value span'
    const elm = this.findCarouselElm([
      { icon: selectorIcon1, value: selectorValue1 },
      { icon: selectorIcon2, value: selectorValue2 },
    ])
    const publicationDate = elm ? elm.textContent.trim().concat() : ''
    const [year, month, day] = publicationDate.split('/')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return formatDate(date)
  }

  getMediaType() {
    const dp = document.querySelector('#dp')
    if (dp.classList.contains('book') || dp.classList.contains('book_mobile')) {
      return 'Book'
    } else if (dp.classList.contains('ebooks') || dp.classList.contains('ebooks_mobile')) {
      return 'Kindle'
    } else if (dp.classList.contains('audible') || dp.classList.contains('audible_mobile')) {
      return 'Audible'
    }
    return ''
  }

  getCover() {
    const selector1 = '#img-wrapper .frontImage'
    const selector2 = '#ebooks-img-wrapper .frontImage'
    const selector3 = '#main-image'
    const elm = this.findElm([selector1, selector2, selector3])
    const cover = elm ? elm.getAttribute('src') : ''
    return cover
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
    }
  }
}

class Booklog {
  getTitle() {
    const titleSelector = '[itemprop="name"]'
    const titleElm = document.querySelector(titleSelector)
    const title = titleElm !== null ? titleElm.textContent.trim() : ''
    return title
  }

  getAuthors() {
    const authorsSelector = '[itemprop="author"]'
    const authorsElm = document.querySelector(authorsSelector)
    const authors = authorsElm !== null ? authorsElm.textContent.trim() : ''
    return authors
  }

  getPublisher() {
    const publisherSelector = '[itemprop="publisher"]'
    const publisherElm = document.querySelector(publisherSelector)
    const publisher = publisherElm !== null ? publisherElm.textContent.trim() : ''
    return publisher
  }

  getPublicationDate() {
    const publicationDateSelector = '[itemprop="datePublished"]'
    const publicationDateElm = document.querySelector(publicationDateSelector)
    const publicationDate = publicationDateElm !== null ? publicationDateElm.getAttribute('content') : ''
    return publicationDate
  }

  getMediaType() {
    const asinRegex = /\/item\/1\/(.+)/
    const asin = location.href.match(asinRegex)[1] ? location.href.match(asinRegex)[1] : ''
    const mediaType = /^B/.test(asin) ? 'Kindle' : 'Book'
    return mediaType
  }

  getCover() {
    const coverSelector = '[itemprop="thumbnailUrl"]'
    const coverElm = document.querySelector(coverSelector)
    const cover = coverElm !== null ? coverElm.getAttribute('src') : ''
    return cover
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
    }
  }
}

const isAmazon = /^www.amazon\.(com|co\.jp)$/.test(location.hostname)
const isBooklog = /^booklog\.jp$/.test(location.hostname)

chrome.runtime.onMessage.addListener(({ type }, _, sendResponse) => {
  if (type !== 'fetchMetaData') {
    return
  }
  if (!isAmazon && !isBooklog) {
    return
  }
  const provider = isAmazon ? new Amazon() : new Booklog()
  const metaData = provider.getMetaData()
  sendResponse(metaData)
})
