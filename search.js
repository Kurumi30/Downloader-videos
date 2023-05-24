const yts = require("yt-search")
const { print, delay } = require("./main")

async function search() {
   const search = process.argv.slice(2).join(" ") || null

   if (!search) return print("Digite algo para pesquisar!", "warn")

   const data = await yts(search)
   const videos = data.videos.slice(0, 6)

   let list = videos.map(video => {
      const { title, url, author, views, duration } = video

      return {
         title: title,
         url: url,
         author: author.name,
         views: views.toLocaleString("pt-BR"),
         duration: {
            seconds: duration.seconds,
            time: duration.timestamp
         },
      }
   })

   print(`Buscando por: ${search}\n\n`)
   
   await delay(2000)

   list.forEach((item, index) => {
      print(`${index + 1}-
   => Título: ${item.title}
   => URL: ${item.url}
   => Canal: ${item.author}
   => Visualizações: ${item.views}
   => Duração: ${item.duration.time}
   => Total de segundos: ${item.duration.seconds}
      `)
   })
}

search()

// module.exports = search