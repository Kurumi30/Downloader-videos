/*
 * <Adicionar a qualidade do vídeo>
 * <Remover o arquivo de vídeo após um certo período de tempo>
 * Converter mp4 para mp3 usando ffmpeg
 * Melhorar na interface do console usando o chalk
*/

const ytdl = require("@distube/ytdl-core")
const fs = require("fs")
const path = require("path")
const { print, delay } = require("./main")

// TROLL: https://www.youtube.com/watch?v=dQw4w9WgXcQ

function setDate(date) {
   let [year, month, day] = date.split("-")

   return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`
}

const test = async () => {
   const message = {
      invalidURL: "URL inválida, tente novamente! ;-;",
      errorDownload: "Houve um erro ao baixar o vídeo... :(",
      successVideoDownload: "Vídeo baixado com sucesso! :D",
   }

   let getLink = process.argv[2] || null
   let regex = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu.be)\/(?:watch\?v=|shorts\/)?([^\s]+)/)

   if (!regex.test(getLink) || getLink == "" || !getLink) {
      print(message.invalidURL, "error")
      return
   }

   try {
      await ytdl.getInfo(getLink).then(async (info) => {
         const { videoDetails, formats } = info
         const { title, ownerChannelName, lengthSeconds, viewCount, publishDate, likes } = videoDetails

         let views = parseInt(viewCount, 10).toLocaleString("pt-BR")
         let like = likes.toLocaleString("pt-BR")
         let date = setDate(publishDate)

         const options = {
            filter: "audioandvideo",
            format: "720p",
            // quality: "hd720",
         }

         const videoPath = path.resolve(__dirname, "videos")
         const filePath = path.join(videoPath, `${title}.${formats[0].container}`)

         const video = ytdl.downloadFromInfo(info, options)

         if (fs.existsSync(filePath)) {
            print("O vídeo já existe na sua pasta!", "warn")
            return
         }

         video.pipe(fs.createWriteStream(filePath))
            .on("finish", async () => {
               print("Obtendo as informações do vídeo...")

               await delay(2000)

               print(`
      Dados do arquivo:
   - Título: ${title}
   - Canal: ${ownerChannelName}
   - Duração: ${lengthSeconds} segundos
   - Visualizações: ${views}
   - Data de publicação: ${date}
   - Likes: ${like}
         `)

               print("Baixando o vídeo...")

               await delay(2000)

               print(message.successVideoDownload)
            })
            .on("error", (err) => {
               throw new Error(err)
            })
      })
   } catch {
      print(message.errorDownload, "error")
      return
   }
}

test()

// module.exports = test