const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const extractFrames = require('ffmpeg-extract-frames');
const pdf = require('./createPdf');
const email = require('./email');
var colors = [];
var PNG = require('png-js');

const express = require('express')
var fileUpload = require('express-fileupload');
const multer = require('multer');
const app = express()
const port = process.argv[2];

app.use(require('express-status-monitor')());

var sendemail = 'daniel.bermudez@uptc.edu.co';

const storage = multer.diskStorage({
	destination:'uploads',
	filename:(req,file,cb)=>{
	cb(null,file.originalname);
	}		
});

app.use(multer({
	storage,
	dest:'uploads'	
}).single('file'));

app.get('/hola', (req, res)=>{
    res.send('Hola')
})

app.post('/upload', (req, res)=>{
    var email = req.body.email;
    console.log(req.file)
    sendemail = email;
    console.log(sendemail)
    res.send('El video se subio correctamente al servidor.');
    getImg();
})

async function getImg() {
    await extractFrames({
        input: 'uploads/video.mp4',
        output: './img-%i.png',
        offsets: [
            500,
            1000,
            1500,
            1800,
            2000
        ]
    })
    await getPixels();
}

async function getPixels() {

    for (let index = 1; index < 6; index++) {
        await countPixelsImg(index);
    }
}

async function countPixelsImg(i) {
    await PNG.decode('img-' + i + '.png', async function (pixels) {
        for (let index = 0; index < pixels.length; index = index + 4) {
            await validColor(pixels[index], pixels[index + 1], pixels[index + 2]);
        }
        if (i == 5) {
            await top();
        }
    });
}

async function validColor(r, g, b) {
    var aux = true;

    for (var index = 0; index < colors.length; index++) {
        if (colors[index].r == r && colors[index].g == g && colors[index].b == b) {
            colors[index].num = colors[index].num + 1;
            aux = false;
            break;
        }
    }
    if (aux) {
        var color = { r, g, b, num: 1 };
        colors.push(color);
    }
}


function swap(items, leftIndex, rightIndex) {
    var temp = items[leftIndex].num;
    items[leftIndex].num = items[rightIndex].num;
    items[rightIndex].num = temp;
}
function partition(items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)].num, //middle element
        i = left, //left pointer
        j = right; //right pointer
    while (i <= j) {
        while (items[i].num < pivot) {
            i++;
        }
        while (items[j].num > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

async function quickSort(items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right);
        }
    }
    return items;
}

async function top() {
    console.log('se inicio la creacion del pdf')

    var aux = [];
    var orderArray = await quickSort(colors, 0, colors.length - 1);
    for (let index = orderArray.length - 1; index > (orderArray.length - 101); index--) {
        aux[(orderArray.length - 1) - index] = orderArray[index];
    }
    await pdf.createPdf(aux);
    await email.sendEmail(sendemail);
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})