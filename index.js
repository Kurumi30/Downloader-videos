import fs from 'fs'
import ytdl from 'ytdl-core'
import rl from 'readline'

const logo = `
__     _________   _____                      _                 _ 
\\ \\   / /__   __| |  __ \\                    | |               | |
 \\ \\_/ /   | |    | |  | | _____      ___ __ | | ___   __ _  __| |
  \\   /    | |    | |  | |/ _ \\ \\ /\\ / / '_ \\| |/ _ \\ / _\` |/ _\` |
   | |     | |    | |__| | (_) \\ V  V /| | | | | (_) | (_| | (_| |
   |_|     |_|    |_____/ \\___/ \\_/\\_/ |_| |_|_|\\___/ \\__,_|\\__,_|

`

const show = () => {
    console.clear()
    console.log(logo)
}

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main(videoURL) {
    show()

    console.log(`
    Escolha uma opção abaixo:

    [1] - Download usando o link
    [0] - Cancelar
    `)

    readline.question(`
    Opção selecionada: `, (option => {
        switch (Number(option)) {
            case 1: {
                console.clear()

                console.log(logo)

                readline.question(`
                URL do vídeo: `, async (video) => {
                    const data = await ytdl.getInfo(video).catch(error => {
                        console.log("Ops, deu um erro: ", error)

                        setTimeout(() => {
                            readline.close()

                            main()
                        }, 6000)
                    })
                    show()

                    readline.question(`
                    Vídeo: "${data.videoDetails.title}"

                    Salvar como:

                    [1] - MP4
                    [2] - MP3

                    Opção selecionada: `, option => {
                        switch (Number(option)) {
                            case 1: {
                                ytdl(video)
                                    .on("progress", (total, downloadedSize, totalSize) => {
                                        let progress = (downloadedSize / totalSize) * 100

                                        show()

                                        console.log(`
                                    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                    })
                                    .on("error", (e => {
                                        show()

                                        fs.unlinkSync(`./videos/${data.videoDetails.title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)

                                        console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                    }))
                                    .on("end", () => {
                                        show()

                                        console.log("O vídeo foi baixado com sucesso! :)")

                                        readline.close()
                                    })
                                    .pipe(
                                        fs.createWriteStream(`./videos/${data.videoDetails.title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)
                                    )
                                break
                            }

                            case 2: {
                                ytdl(video, {
                                    filter: 'audioonly',
                                    format: 'mp3'
                                })
                                    .on("progress", (total, downloadedSize, totalSize) => {
                                        let progress = (downloadedSize / totalSize) * 100

                                        show()

                                        console.log(`
                                    Baixando... [ ${progress.toFixed(2)}% ]
                                    `)
                                    })
                                    .on("error", (e => {
                                        show()

                                        fs.unlinkSync(`./audios/${data.videoDetails.title.replace(
                                            new RegExp('\\\\|/|\\|', 'g'), '-'
                                        )}.mp4`)

                                        console.log("Houve um erro ao tentar baixar o arquivo... :(")
                                    }))
                                    .on("end", () => {
                                        show()

                                        console.log("O áudio foi baixado com sucesso! :)")

                                        readline.close()
                                    })
                                    .pipe(
                                        fs.createWriteStream(`./audios/${data.videoDetails.title.replace(
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
                main()
            }
        }
    }))
}

main()