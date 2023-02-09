import fs from 'fs'
import ytdl from 'ytdl-core'
import rl from 'readline'
import chalk from 'chalk'

const clearScreen = () => console.clear()
const displayLogo = () => {
    const logo = `
__     _________   _____                      _                 _ 
\\ \\   / /__   __| |  __ \\                    | |               | |
 \\ \\_/ /   | |    | |  | | _____      ___ __ | | ___   __ _  __| |
  \\   /    | |    | |  | |/ _ \\ \\ /\\ / / '_ \\| |/ _ \\ / _\` |/ _\` |
   | |     | |    | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
   |_|     |_|    |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|

`
    console.log(colorTheme(logo, "red"))
}

function colorTheme(text, color) {
    return chalk[color](text)
}

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    clearScreen()
    displayLogo()

    console.log(colorTheme(
        `Escolha uma opção abaixo:

    [1] - Download usando o link
    [0] - Cancelar/Sair
    `, "green"))

    readline.question(colorTheme(
        `Opção selecionada: `, "blue"), (option => {
            switch (Number(option)) {
                case 1: {
                    clearScreen()
                    displayLogo()

                    readline.question(colorTheme(
                        `
    URL do vídeo: `, "yellow"
                    ), async (video) => {
                        const data = await ytdl.getInfo(video).catch(() => {

                            setTimeout(() => {
                                readline.close()
                                main()
                            }, 6000)
                        })
                        clearScreen()
                        displayLogo()

                        const title = data.videoDetails.title
                        const lengthSeconds = data.videoDetails.lengthSeconds

                        // if (videoDetails == undefined) return console.log("URL inválida, tente novamente!")

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

                                            clearScreen()
                                            displayLogo()

                                            console.log(`
    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                        })
                                        .on("error", (e => {
                                            clearScreen()
                                            displayLogo()

                                            fs.unlinkSync(`./videos/${title.replace(
                                                new RegExp('\\\\|/|\\|', 'g'), '-'
                                            )}.mp4`)

                                            console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                        }))
                                        .on("end", () => {
                                            clearScreen()
                                            displayLogo()

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

                                            clearScreen()
                                            displayLogo()

                                            console.log(`
    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                        })
                                        .on("error", (e => {
                                            clearScreen()
                                            displayLogo()

                                            fs.unlinkSync(`./audios/${title.replace(
                                                new RegExp('\\\\|/|\\|', 'g'), '-'
                                            )}.mp4`)

                                            console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                        }))
                                        .on("end", () => {
                                            clearScreen()
                                            displayLogo()

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
