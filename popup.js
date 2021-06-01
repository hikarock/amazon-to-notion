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

const button = document.getElementById("button");
const inputTitle = document.getElementById("title");
const inputAuthors = document.getElementById("authors");
const inputMediaType = document.getElementById("media-type");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { type: "fetchMetaData" },
    ({ title, authors }) => {
      inputTitle.value = title;
      inputAuthors.value = authors;
    }
  );
});

button.addEventListener("click", async (evt) => {
  evt.preventDefault();
  document.querySelector(".action").style.display = "none";
  document.querySelector(".processing").style.display = "block";
  const headers = buildHeaders({ token, notionVersion });
  const payload = buildPayload({
    databaseId,
    title: inputTitle.value,
    authors: inputAuthors.value,
    mediaType: inputMediaType.value,
  });
  const res = await fetch(notionPagesApi, {
    method: "POST",
    headers,
    body: payload,
  }).finally(() => {
    document.querySelector(".processing").style.display = "none";
  });
  if (res.ok) {
    document.querySelector(".success").style.display = "block";
    console.info(res);
  } else {
    document.querySelector(".error").style.display = "block";
    console.error(res);
  }
});
