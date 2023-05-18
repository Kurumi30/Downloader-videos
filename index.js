/*
 * Adicionar a qualidade do vídeo
 * Converter mp4 para mp3 usando ffmpeg
*/

const ytdl = require("@distube/ytdl-core")
const fs = require("fs")
const path = require("path")
const message = {
   invalidURL: "URL inválida, tente novamente! ;-;",
   errorDownload: "Houve um erro ao baixar o vídeo... :(",
   successVideoDownload: "Vídeo baixado com sucesso! :D",
}

// TROLL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// https://youtu.be/gtpCl_QWaLg

function print(text, method = "log") {
   if (!console[method]) {
      console.error("O método de console não existe!")
      return
   }
   console[method](text)
}

async function delay(time) {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve()
      }, time)
   })
}

function setDate(date) {
   let [year, month, day] = date.split("-")

   return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`
}

const test = async () => {
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
            quality: "highest",
            format: "mp4",
         }

         const videoPath = path.resolve(__dirname, "videos")
         const filePath = path.join(videoPath, `${title}.${formats[0].container}`)

         if (fs.existsSync(filePath)) {
            print("O vídeo já existe!", "warn")
            return
         } else {
            print("Obtendo as informações do vídeo...")
         }

         const video = ytdl.downloadFromInfo(info, options)

         video.pipe(fs.createWriteStream(filePath))
            .on("finish", async () => {
               print("Baixando o vídeo...")

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
