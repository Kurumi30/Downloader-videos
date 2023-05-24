/* função para remover o arquivo após 1 minuto do download */

// const arquivo = 'caminho/para/o/arquivo.txt'
// const periodoExpiracao = 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos

// fs.stat(arquivo, (erro, estatisticas) => {
//   if (erro) {
//     console.error(erro)
//     return
//   }

//   const dataCriacao = estatisticas.ctimeMs // Data de criação do arquivo em milissegundos
//   const dataAtual = new Date().getTime() // Data atual em milissegundos

//   if (dataAtual - dataCriacao > periodoExpiracao) {
//     fs.unlink(arquivo, (erro) => {
//       if (erro) {
//         console.error(erro)
//         return
//       }
//       console.log('Arquivo removido com sucesso!')
//     })
//   }
// })

const moment = require('moment')

const directory = './videos'
const daysToKeep = 7

fs.readdir(directory, (err, files) => {
  if (err) throw err

  files.forEach(file => {
    const filePath = `${directory}/${file}`;
    const fileCreationDate = moment(fs.statSync(filePath).birthtime)
    const daysSinceCreation = moment().diff(fileCreationDate, 'days')

    if (daysSinceCreation > daysToKeep) {
      fs.unlink(filePath, err => {
        if (err) throw err;
        console.log(`${filePath} foi excluído com sucesso!`)
      })
    }
  })
})