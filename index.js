import fs from 'fs'
import ytdl from 'ytdl-core'
import rl from 'readline'
import chalk from 'chalk'

const logo = `
__     _________   _____                      _                 _ 
\\ \\   / /__   __| |  __ \\                    | |               | |
 \\ \\_/ /   | |    | |  | | _____      ___ __ | | ___   __ _  __| |
  \\   /    | |    | |  | |/ _ \\ \\ /\\ / / '_ \\| |/ _ \\ / _\` |/ _\` |
   | |     | |    | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
   |_|     |_|    |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|

`

const banner = () => {
    console.clear()
    console.log(logo)
}

function colorTheme(text) {
    const log = chalk.rgb(123, 45, 67).bold(text)
}

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    banner()

    console.log(`
    Escolha uma opção abaixo:

    [1] - Download usando o link
    [0] - Cancelar
    `)

    readline.question(`
    Opção selecionada: `, (option => {
        switch (Number(option)) {
            case 1: {
                banner()

                readline.question(`
    URL do vídeo: `, async (video) => {
                    const data = await ytdl.getInfo(video).catch(() => {

                        setTimeout(() => {
                            readline.close()
                            main()
                        }, 6000)
                    })
                    banner()

                    const title = data.videoDetails.title
                    const lengthSeconds = data.videoDetails.lengthSeconds

                    if (videoDetails == undefined) return console.log("URL inválida, tente novamente!")

                    readline.question(`
    Vídeo: "${title}"
    Duração: ${lengthSeconds} segundos

    Salvar como:

    [1] - MP4
    [2] - MP3

    Opção selecionada: `, option => {
                        switch (Number(option)) {
                            case 1: {
                                ytdl(video, {
                                    quality: 'highestvideo',
                                    format: 'mp4'
                                })
                                    .on("progress", (total, downloadedSize, totalSize) => {
                                        let progress = (downloadedSize / totalSize) * 100

                                        banner()

                                        console.log(`
    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                    })
                                    .on("error", (e => {
                                        banner()

                                        fs.unlinkSync(`./videos/${title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)

                                        console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                    }))
                                    .on("end", () => {
                                        banner()

                                        console.log("O vídeo foi baixado com sucesso! :)")

                                        readline.close()
                                    })
                                    .pipe(
                                        fs.createWriteStream(`./videos/${title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)
                                    )
                                break
                            }

                            case 2: {
                                ytdl(video, {
                                    filter: 'audioonly',
                                    quality: 'highestaudio',
                                    format: 'mp3'
                                })
                                    .on("progress", (total, downloadedSize, totalSize) => {
                                        let progress = (downloadedSize / totalSize) * 100

                                        banner()

                                        console.log(`
    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                    })
                                    .on("error", (e => {
                                        banner()

                                        fs.unlinkSync(`./audios/${title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)

                                        console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                    }))
                                    .on("end", () => {
                                        banner()

                                        console.log("O áudio foi baixado com sucesso! :)")

                                        readline.close()
                                    })
                                    .pipe(
                                        fs.createWriteStream(`./audios/${title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp3`)
                                    )
                                break
                            }
                        }
                    })
                })
                break
            }

            case 0: {
                readline.close()
                break
            }

            default: {
                readline.close()
                // main()
            }
        }
    }))
}

main()
