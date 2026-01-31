
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const year2026 = data.find(y => y.year === '2026');
if (year2026) {
    // Find album starting with 2026年1月
    // Note: The title might be '2026年1月' or '2026年1月-...'
    const album = year2026.albums.find(a => a.title.startsWith('2026年1月'));
    if (album) {
        album.img_src = "https://lh3.googleusercontent.com/pw/AP1GczMW-nU_CfkhY6oLNti9e5VXoohvCLK4W4NAh26BcODTGofcn1uW2isxgCGewmCJyLJH9l3eFB9jxj6TOTyX3hk0wh8A84lXJd6xIikAdnHC3-RYLX4=w1280";
        console.log("Updated 2026 Jan cover image.");
    } else {
        console.log("Album 2026 Jan not found.");
    }
} else {
    console.log("Year 2026 not found.");
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
