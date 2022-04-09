const nameElm1 = document.getElementById('name-1')
const nameElm2 = document.getElementById('name-2')
const tokenElm1 = document.getElementById('token-1')
const tokenElm2 = document.getElementById('token-2')
const databaseIdElm1 = document.getElementById('database-id-1')
const databaseIdElm2 = document.getElementById('database-id-2')
const buttonElm = document.getElementById('save-button')
const toastElm = document.getElementById('toast')

chrome.storage.sync.get(
  ['name1', 'name2', 'token1', 'token2', 'databaseId1', 'databaseId2'],
  ({ name1, name2, token1, token2, databaseId1, databaseId2 }) => {
    nameElm1.value = name1 ?? ''
    nameElm2.value = name2 ?? ''
    tokenElm2.value = token2 ?? ''
    tokenElm1.value = token1 ?? ''
    tokenElm2.value = token2 ?? ''
    databaseIdElm1.value = databaseId1 ?? ''
    databaseIdElm2.value = databaseId2 ?? ''
  }
)

const handleButtonClick = () => {
  const name1 = nameElm1.value
  const name2 = nameElm2.value
  const token1 = tokenElm1.value
  const token2 = tokenElm2.value
  const databaseId1 = databaseIdElm1.value
  const databaseId2 = databaseIdElm2.value
  chrome.storage.sync.set({ name1, name2, token1, token2, databaseId1, databaseId2 }, () => {
    toastElm.style.display = 'block'
    setTimeout(() => {
      toastElm.style.display = 'none'
    }, 2000)
  })
}

buttonElm.addEventListener('click', handleButtonClick)
