export const openURLInNewTab =(url?: string|null) => {
  if (typeof window === 'undefined' || !url) return
  const anchorElement = document.createElement('a')
  anchorElement.target = '_blank'
  anchorElement.href = url
  document.body.appendChild(anchorElement)
  anchorElement.click()
  document.body.removeChild(anchorElement)
}