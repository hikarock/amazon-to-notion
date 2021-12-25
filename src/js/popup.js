const notionApi = "https://api.notion.com/v1";
const notionPagesApi = `${notionApi}/pages`;
const notionVersion = "2021-05-11";

let token = "";
let databaseId = "";
chrome.storage.sync.get(
  ["token", "databaseId"],
  ({ token: _token, databaseId: _databaseId }) => {
    token = _token;
    databaseId = _databaseId;
  }
);

const buildPayload = ({
  databaseId,
  title,
  authors,
  publisher,
  mediaType,
  url,
  cover,
}) => {
  return JSON.stringify({
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
      "Media Type": {
        multi_select: [
          {
            name: mediaType,
          },
        ],
      },
      URL: {
        url,
      },
    },
  });
};

const buildHeaders = ({ token, notionVersion }) => {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": notionVersion,
  };
};

const buttonElm = document.getElementById("button");
const coverElm = document.getElementById("cover");
const inputTitleElm = document.getElementById("title");
const inputAuthorsElm = document.getElementById("authors");
const inputPublisherElm = document.getElementById("publisher");
const inputMediaTypeElm = document.getElementById("media-type");
const inputUrlElm = document.getElementById("url");
const processingElm = document.getElementById("processing");
const successElm = document.getElementById("success");
const errorElm = document.getElementById("error");
let url, cover;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "fetchMetaData" }, (payload) => {
    inputTitleElm.value = payload?.title ? payload.title : "";
    inputAuthorsElm.value = payload?.authors ? payload.authors : "";
    inputPublisherElm.value = payload?.publisher ? payload.publisher : "";
    url = payload?.url ? payload.url : "";
    inputUrlElm.value = url;
    cover = payload?.cover ? payload.cover : "";
    coverElm.setAttribute("src", cover);
  });
});

buttonElm.addEventListener("click", async (evt) => {
  evt.preventDefault();
  buttonElm.style.display = "none";
  processingElm.style.display = "block";
  const headers = buildHeaders({ token, notionVersion });
  const payload = buildPayload({
    databaseId,
    title: inputTitleElm.value,
    authors: inputAuthorsElm.value,
    publisher: inputPublisherElm.value,
    mediaType: inputMediaTypeElm.value,
    url,
    cover,
  });
  const res = await fetch(notionPagesApi, {
    method: "POST",
    headers,
    body: payload,
  }).finally(() => {
    processingElm.style.display = "none";
  });
  if (res.ok) {
    successElm.style.display = "block";
  } else {
    errorElm.style.display = "block";
  }
});
