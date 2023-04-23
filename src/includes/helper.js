export default {
  formatTime(time) {
    // Convert seconds to mm:ss format
    const minutes = Math.floor(time / 60) || 0
    const seconds = Math.round(time - minutes * 60 || 0)

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
}
