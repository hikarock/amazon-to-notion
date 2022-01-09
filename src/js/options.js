const tokenElm = document.getElementById('token')
const databaseIdElm = document.getElementById('database-id')
const buttonElm = document.getElementById('save-button')
const toastElm = document.getElementById('toast')

chrome.storage.sync.get(['token', 'databaseId'], ({ token, databaseId }) => {
  tokenElm.value = token ?? ''
  databaseIdElm.value = databaseId ?? ''
})

const handleButtonClick = () => {
  const token = tokenElm.value
  const databaseId = databaseIdElm.value
  chrome.storage.sync.set({ token, databaseId }, () => {
    toastElm.style.display = 'block'
    setTimeout(() => {
      toastElm.style.display = 'none'
    }, 2000)
  })
}

buttonElm.addEventListener('click', handleButtonClick)
