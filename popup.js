const notionApi = "https://api.notion.com/v1";
const notionPagesApi = `${notionApi}/pages`;
const notionVersion = "2021-05-13";

let token = "";
let databaseId = "";
chrome.storage.sync.get(
  ["token", "databaseId"],
  ({ token: _token, databaseId: _databaseId }) => {
    token = _token;
    databaseId = _databaseId;
  }
);

const buildPayload = ({ databaseId, title, authors, mediaType }) => {
  return JSON.stringify({
    parent: { database_id: databaseId },
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
      "Media Type": {
        multi_select: [
          {
            name: mediaType,
          },
        ],
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
const inputTitleElm = document.getElementById("title");
const inputAuthorsElm = document.getElementById("authors");
const inputMediaTypeElm = document.getElementById("media-type");
const processingElm = document.getElementById("processing");
const successElm = document.getElementById("success");
const errorElm = document.getElementById("error");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "fetchMetaData" },
    ({ title, authors }) => {
      inputTitleElm.value = title;
      inputAuthorsElm.value = authors;
    }
  );
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
    mediaType: inputMediaTypeElm.value,
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
