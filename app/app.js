const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const fs = require('fs');
const { getInfo } = require('ytdl-core');

const port = process.env.PORT || 3000;
console.log(port);

app.get('/', function(req, res) {
    const { url } = req.query;

    let titulo = '';

    let promise = new Promise((resolve, reject) => {
        const stream = ytdl(url);
        stream.on('info', (info) => {
            info.videoDetails.title.split(' ').forEach(element => {
                titulo += element.toLowerCase() + '_';
            });
            resolve(titulo);
        });
    });

    promise.then((t) => {
        titulo = t;
        ytdl(url, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(titulo + '.mp3'));
        console.log(titulo);

        res.send(titulo + '<br>' + port);
    });

});

app.listen(port);