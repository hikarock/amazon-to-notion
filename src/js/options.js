const tokenElm1 = document.getElementById('token-1')
const tokenElm2 = document.getElementById('token-2')
const databaseIdElm1 = document.getElementById('database-id-1')
const databaseIdElm2 = document.getElementById('database-id-2')
const buttonElm = document.getElementById('save-button')
const toastElm = document.getElementById('toast')

chrome.storage.sync.get(
  ['token-1', 'token-2', 'databaseId-1', 'databaseId-2'],
  ({ token1, token2, databaseId1, databaseId2 }) => {
    tokenElm1.value = token1 ?? ''
    tokenElm2.value = token2 ?? ''
    databaseIdElm1.value = databaseId1 ?? ''
    databaseIdElm2.value = databaseId2 ?? ''
  }
)

const handleButtonClick = () => {
  const token1 = tokenElm1.value
  const token2 = tokenElm2.value
  const databaseId1 = databaseIdElm1.value
  const databaseId2 = databaseIdElm2.value
  chrome.storage.sync.set({ token1, databaseId1 }, () => {
    toastElm.style.display = 'block'
    setTimeout(() => {
      toastElm.style.display = 'none'
    }, 2000)
  })
}

buttonElm.addEventListener('click', handleButtonClick)
