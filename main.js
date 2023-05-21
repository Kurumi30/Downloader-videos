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

module.exports = {
   print,
   delay,
}