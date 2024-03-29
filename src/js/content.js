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

  getTitle() {
    const elm = this.findElm(['#productTitle', '#ebooksTitle', '#title', '#truncatedTitle .a-truncate-full'])
    return elm ? elm.textContent.trim().replace(/\n|\r/g, '') : ''
  }

  getAuthors() {
    const elm = this.findElm(['#contributorLink', '#bylineContributor', '.contributorNameID', '.author .a-link-normal'])
    return elm ? elm.textContent.trim().replace(/　/g, ' ') : ''
  }

  getPublisher() {
    const elm = this.findElm([
      '#rpi-attribute-book_details-publisher .rpi-attribute-value span',
      '#rpi-attribute-audiobook_details-publisher .rpi-attribute-value span',
    ])
    return elm ? elm.textContent.trim() : ''
  }

  getPublicationDate() {
    const formatDate = (date) => {
      const yyyy = date.getFullYear()
      const mm = `00${date.getMonth() + 1}`.slice(-2)
      const dd = `00${date.getDate()}`.slice(-2)
      return `${yyyy}-${mm}-${dd}`
    }
    const yearElm = this.findElm([
      '#rpi-attribute-book_details-publication_date .rpi-attribute-value span',
      '#rpi-attribute-audiobook_details-release-date .rpi-attribute-value span',
      '#rpi-attribute-book_details-publication_date .rpi-attribute-value p:first-child',
      '#rpi-attribute-audiobook_details-release-date .rpi-attribute-value p:first-child',
    ])
    const dateElm = this.findElm([
      '#rpi-attribute-book_details-publication_date .rpi-attribute-value p:nth-child(2)',
      '#rpi-attribute-audiobook_details-release-date .rpi-attribute-value p:nth-child(2)',
    ])
    if (!dateElm) {
      return formatDate(new Date(yearElm.textContent.trim()))
    }
    const yyyy = yearElm.textContent.replace(/年/g, '')
    const [m, d] = dateElm.textContent.replace(/[\s日]/g, '').split('月')
    const mm = `00${m}`.slice(-2)
    const dd = `00${d}`.slice(-2)
    return `${yyyy}-${mm}-${dd}`
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
    const elm = this.findElm([
      '#img-wrapper .frontImage',
      '#ebooks-img-wrapper .frontImage',
      '#main-image',
      '#landingImage',
    ])
    return elm ? elm.getAttribute('src') : ''
  }

  getUrl() {
    let elm = this.findElm(['#ASIN', "[name='ASIN.0']", "[name='items[0.base][asin]']"])
    let asin = elm ? elm.value : null
    return asin ? `${location.origin}/dp/${asin}` : location.href
  }

  getPages() {
    const elm = this.findElm([
      '#rpi-attribute-book_details-fiona_pages .rpi-attribute-value span',
      '#rpi-attribute-book_details-ebook_pages .rpi-attribute-value span',
    ])
    return elm ? Number.parseInt(elm.textContent.trim().match(/\d+/)[0]) : 0
  }

  getMetaData() {
    return {
      title: this.getTitle(),
      authors: this.getAuthors(),
      publisher: this.getPublisher(),
      publicationDate: this.getPublicationDate(),
      mediaType: this.getMediaType(),
      cover: this.getCover(),
      url: this.getUrl(),
      pages: this.getPages(),
    }
  }
}

class Booklog {
  getTitle() {
    const titleSelector = '[itemprop="name"]'
    const titleElm = document.querySelector(titleSelector)
    return titleElm !== null ? titleElm.textContent.trim() : ''
  }

  getAuthors() {
    const authorsSelector = '[itemprop="author"]'
    const authorsElm = document.querySelector(authorsSelector)
    return authorsElm !== null ? authorsElm.textContent.trim() : ''
  }

  getPublisher() {
    const publisherSelector = '[itemprop="publisher"]'
    const publisherElm = document.querySelector(publisherSelector)
    return publisherElm !== null ? publisherElm.textContent.trim() : ''
  }

  getPublicationDate() {
    const publicationDateSelector = '[itemprop="datePublished"]'
    const publicationDateElm = document.querySelector(publicationDateSelector)
    return publicationDateElm !== null ? publicationDateElm.getAttribute('content') : ''
  }

  getMediaType() {
    const asinRegex = /\/item\/1\/(.+)/
    const asin = location.href.match(asinRegex)[1] ? location.href.match(asinRegex)[1] : ''
    return /^B/.test(asin) ? 'Kindle' : 'Book'
  }

  getCover() {
    const coverSelector = '[itemprop="thumbnailUrl"]'
    const coverElm = document.querySelector(coverSelector)
    return coverElm !== null ? coverElm.getAttribute('src') : ''
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
      pages: 0,
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
