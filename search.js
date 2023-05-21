const yts = require("yt-search")

async function search(/*param*/) {
   const search = process.argv.slice(2).join(" ") || null

   if (!search) return console.log("Digite algo para pesquisar!")

   const info = await yts(search)
   const videos = info.videos.slice(0, 6)

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

   list.forEach((item, index) => {
      console.log(`${index + 1}-
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

module.exports = search