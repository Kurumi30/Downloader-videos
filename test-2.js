const ytdl = require("@distube/ytdl-core")
const fs = require("fs")
const link = "https://youtu.be/gtpCl_QWaLg"

try {
   ytdl.getInfo(link).then(async (info) => {
      console.log(info)
      /*const video = ytdl.downloadFromInfo(info, {
         filter: "videoandaudio",
         quality: "highestvideo",
      })

      video.pipe(fs.createWriteStream("video.mp4")).on("finish", () => {
         console.log("Download concluído!")
      })*/
   })
} catch (error) {
   console.error(error)
}

