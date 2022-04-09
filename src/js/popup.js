const notionApi = 'https://api.notion.com/v1'
const notionPagesApi = `${notionApi}/pages`
const notionVersion = '2021-05-11'

let token1 = ''
let token2 = ''
let databaseId1 = ''
let databaseId2 = ''

chrome.storage.sync.get(
  ['name1', 'name2', 'token1', 'token2', 'databaseId1', 'databaseId2'],
  ({
    name1: _name1,
    name2: _name2,
    token1: _token1,
    token2: _token2,
    databaseId1: _databaseId1,
    databaseId2: _databaseId2,
  }) => {
    token1 = _token1
    token2 = _token2
    databaseId1 = _databaseId1
    databaseId2 = _databaseId2
    let option1 = document.createElement('option')
    let option2 = document.createElement('option')
    option1.text = _name1 ? _name1 : 'Integration Token 1'
    option2.text = _name2 ? _name1 : 'Integration Token 2'
    option1.value = token1
    option2.value = token2
    inputTokenElm.appendChild(option1)
    inputTokenElm.appendChild(option2)
  }
)

const buildPayload = ({ databaseId, title, authors, publisher, publicationDate, mediaType, url, cover, pages }) => {
  const payload = JSON.stringify({
    parent: { database_id: databaseId },
    cover: { external: { url: cover } },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      Authors: {
        rich_text: [
          {
            text: {
              content: authors,
            },
          },
        ],
      },
      Publisher: {
        rich_text: [
          {
            text: {
              content: publisher,
            },
          },
        ],
      },
      'Publication Date': {
        date: {
          start: publicationDate,
        },
      },
      'Media Type': {
        multi_select: [
          {
            name: mediaType,
          },
        ],
      },
      URL: {
        url,
      },
      Pages: {
        number: pages,
      },
    },
  })
  return payload
}

const buildHeaders = ({ token, notionVersion }) => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': notionVersion,
  }
}

const buttonElm = document.getElementById('button')
const coverElm = document.getElementById('cover')
const inputTitleElm = document.getElementById('title')
const inputAuthorsElm = document.getElementById('authors')
const inputPublisherElm = document.getElementById('publisher')
const inputPublicationDateElm = document.getElementById('publication-date')
const inputMediaTypeElm = document.getElementById('media-type')
const inputUrlElm = document.getElementById('url')
const inputPagesElm = document.getElementById('pages')
const inputTokenElm = document.getElementById('token')
const formElm = document.getElementById('form')
const notAvailableElm = document.getElementById('not-available')
const processingElm = document.getElementById('processing')
const successElm = document.getElementById('success')
const errorElm = document.getElementById('error')

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.tabs.sendMessage(tab.id, { type: 'fetchMetaData' }, (payload) => {
    if (!payload) {
      notAvailableElm.style.display = 'block'
      return
    }
    const {
      title = '',
      authors = '',
      publisher = '',
      publicationDate = '',
      url = '',
      mediaType = '',
      cover = '',
      pages = 0,
    } = payload
    formElm.style.display = 'grid'
    inputTitleElm.value = title
    inputAuthorsElm.value = authors
    inputPublisherElm.value = publisher
    inputPublicationDateElm.value = publicationDate
    inputUrlElm.value = url
    inputMediaTypeElm.value = mediaType
    inputPagesElm.value = pages
    coverElm.setAttribute('src', cover)
  })
})

buttonElm.addEventListener('click', async (evt) => {
  evt.preventDefault()
  buttonElm.style.display = 'none'
  processingElm.style.display = 'block'
  let selectedToken = inputTokenElm.value
  const token = selectedToken === 'token1' ? token1 : token2
  const databaseId = selectedToken === 'token1' ? databaseId1 : databaseId2

  const headers = buildHeaders({ token, notionVersion })
  const payload = buildPayload({
    databaseId,
    title: inputTitleElm.value,
    authors: inputAuthorsElm.value,
    publisher: inputPublisherElm.value,
    publicationDate: inputPublicationDateElm.value,
    mediaType: inputMediaTypeElm.value,
    pages: Number.parseInt(inputPagesElm.value),
    url: inputUrlElm.value,
    cover: coverElm.getAttribute('src'),
  })
  const res = await fetch(notionPagesApi, {
    method: 'POST',
    headers,
    body: payload,
  }).finally(() => {
    processingElm.style.display = 'none'
  })
  if (res.ok) {
    successElm.style.display = 'block'
  } else {
    errorElm.style.display = 'block'
  }
})
