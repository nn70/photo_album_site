
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const year2016 = data.find(y => y.year === '2016');
if (year2016) {
    const newAlbums = [
        {
            "title": "超音波",
            "img_src": "https://via.placeholder.com/400x300?text=Ultrasound",
            "link_href": "https://photos.app.goo.gl/x7GRV4nr9FNtWwwMA"
        },
        {
            "title": "小赫拍的照片",
            "img_src": "https://via.placeholder.com/400x300?text=Horton+Photos",
            "link_href": "https://photos.app.goo.gl/PZMWoD4fWJ7twCQf8"
        }
    ];

    // Append to the end (which appears "after" or "right" of the current last item, July)
    year2016.albums.push(...newAlbums);

    console.log(`Added 2 albums to 2016. Total: ${year2016.albums.length}`);
} else {
    console.log("2016 not found");
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log("Done.");
