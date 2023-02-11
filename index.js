import fs from 'fs'
import ytdl from 'ytdl-core'
import rl from 'readline'
import chalk from 'chalk'

const infoMessage = {
    invalidURL: "URL inválida, tente novamente!",
    errorDownload: "Houve um erro ao tentar baixar o arquivo... :(",
    successVideoDownload: "O vídeo foi baixado com sucesso! :)",
    successAudioDownload: "O áudio foi baixado com sucesso! :)"
}
const logo = `
__     _________   _____                      _                 _ 
\\ \\   / /__   __| |  __ \\                    | |               | |
 \\ \\_/ /   | |    | |  | | _____      ___ __ | | ___   __ _  __| |
  \\   /    | |    | |  | |/ _ \\ \\ /\\ / / '_ \\| |/ _ \\ / _\` |/ _\` |
   | |     | |    | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
   |_|     |_|    |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|

`
const clearScreen = () => console.clear()
const displayLogo = () => console.log(colorTheme(logo, "red"))

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
                    ), async function getData(video) {
                        try {
                            const data = await ytdl.getInfo(video)
                            return {
                                title: data.videoDetails.title,
                                lengthSeconds: data.videoDetails.lengthSeconds
                            }
                        } catch (e) {
                            console.log(infoMessage.invalidURL)
                            console.error(e)

                            setTimeout(() => {
                                readline.close()
                                main()
                            }, 2000)
                        }
                        const { title, lengthSeconds } = await getData(video)

                        clearScreen()
                        displayLogo()

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
                                        // format: 'mp4'
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

                                            console.log(infoMessage.errorDownload)
                                        }))
                                        .on("end", () => {
                                            clearScreen()
                                            displayLogo()

                                            console.log(infoMessage.successVideoDownload)

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

                                            console.log(infoMessage.errorDownload)
                                        }))
                                        .on("end", () => {
                                            clearScreen()
                                            displayLogo()

                                            console.log(infoMessage.successAudioDownload)

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
