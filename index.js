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
   if(!console[method]) {
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

const test = async () => {
   let regex = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu.be)\/(?:watch\?v=|shorts\/)?([^\s]+)/)
   let getLink = process.argv[2] || null

   if (!regex.test(getLink) || getLink == "" || !getLink) {
      print(message.invalidURL, "error")
      return
   }

   try {
      const { videoDetails, formats } = await ytdl.getInfo(getLink)
      const { title, ownerChannelName, lengthSeconds, viewCount, publishDate, likes } = videoDetails

      function setDate(date) {
         let [year, month, day] = date.split("-")

         return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`
      }

      let views = parseInt(viewCount, 10).toLocaleString("pt-BR")
      let like = likes.toLocaleString("pt-BR")
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
         print("Baixando o vídeo...")
      }

      //Reescrever essa merda
      ytdl(getLink, options)
         .pipe(fs.createWriteStream(filePath))
         .on("finish", async () => {
            print("Obtendo as informações do vídeo...")
            print(`
            Dados do arquivo:
      - Título: ${title}
      - Canal: ${ownerChannelName}
      - Duração: ${lengthSeconds} segundos
      - Visualizações: ${views}
      - Data de publicação: ${setDate(publishDate)}
      - Likes: ${like}
         `)

            await delay(1000)

            print(message.successVideoDownload)
         })
         .on("error", (err) => {
            throw new Error(err)
         })
   } catch {
      print(message.errorDownload, "error")
      return
   }
}

test()
