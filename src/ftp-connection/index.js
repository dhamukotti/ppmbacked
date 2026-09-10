const PromiseFtp = require('promise-ftp')
const ftpClient = new PromiseFtp()

async function uploadToFTP(file, filePath) {
  try {
    await ftpClient
      .connect({
        host: process?.env?.FTP_HOST,
        port: process?.env?.FTP_PORT,
        user: process?.env?.FTP_USERNAME,
        password: process?.env?.FTP_PASSWORD
      })
      .then(res => console.log('connection', res))

    const remoteDir = filePath ?? '/appsure.co.in/PPMDocs'
    const remotePath = `${remoteDir}/${file.name}`

    // Check if the directory exists
    try {
      await ftpClient.cwd(remoteDir) // Change to the directory
    } catch {
      console.log(`Directory ${remoteDir} does not exist.`)
      throw new Error('Target directory does not exist on the FTP server.')
    }

    // Upload file
    await ftpClient.put(file.data, remotePath)
    console.log(`File uploaded successfully to ${remotePath}`)

    return remotePath
  } catch (error) {
    console.error('FTP upload failed:', error)
  } finally {
    ftpClient.end()
  }
}

module.exports = { uploadToFTP }
