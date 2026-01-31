
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/albums.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const year2026 = data.find(y => y.year === '2026');
if (year2026) {
    // Find album starting with 2026年2月
    const album = year2026.albums.find(a => a.title.startsWith('2026年2月'));
    if (album) {
        album.img_src = "https://lh3.googleusercontent.com/sitesv/APaQ0SSxMKQ-yaeUnXixK5_zze1NCZdUTNCCIbAkKCwOrIjCAxUkWD1eh3U22rXRqw9FWUz9a0sPYNwRkNC-8QeqYkaz9FDcikf3G8zxWrXzQtXeGDEEDA5p7Ji3nWgh0Ck5YZ5XjHtz_DGMPCpVaylHzkkwcDtM8-gdrnD2kPNgurC99dMyILH9fSQAWygioofIKcVLb21T4pYNNq8QcIioQTF0rI1W8chI_EOep3I=w1280";
        console.log("Updated 2026 Feb cover image.");
    } else {
        console.log("Album 2026 Feb not found.");
    }
} else {
    console.log("Year 2026 not found.");
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
