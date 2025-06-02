const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ffmpegPath = require('ffmpeg-static');
process.env.PATH = `${path.dirname(ffmpegPath)}${path.delimiter}${process.env.PATH}`;


const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

app.post('/api/download', (req, res) => {
  const { url, format } = req.body;
  const timestamp = Date.now();
  let cmd, outputPath;

  switch (format) {
    case 'video2160':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=2160]+bestaudio/best[height<=2160]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video1440':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=1440]+bestaudio/best[height<=1440]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video1080':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video720':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video480':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=480]+bestaudio/best[height<=480]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video360':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=360]+bestaudio/best[height<=360]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video240':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=240]+bestaudio/best[height<=240]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'video144':
      outputPath = `${downloadDir}/video_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -f "bestvideo[height<=144]+bestaudio/best[height<=144]" --merge-output-format mp4 -o "${outputPath}" "${url}"`;
      break;
    case 'audio':
      outputPath = `${downloadDir}/audio_${timestamp}.%(ext)s`;
      cmd = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;
      break;
    default:
      return res.status(400).send('Invalid format');
  }
exec(cmd, (error, stdout, stderr) => {
  if (error) return res.status(500).send('Download error');
  const fileName = fs.readdirSync(downloadDir).find(f => f.includes(timestamp));
  const filePath = path.join(downloadDir, fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error sending file:', err);
    }
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      } else {
        console.log(`Deleted file: ${fileName}`);
      }
    });
  });
});
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
