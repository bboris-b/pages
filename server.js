const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create temp directory for video processing
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Clean up old files periodically (older than 1 hour)
setInterval(() => {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    files.forEach(file => {
        const filePath = path.join(TEMP_DIR, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > oneHour) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up old file: ${file}`);
        }
    });
}, 15 * 60 * 1000); // Run every 15 minutes

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'YouTube Highlight Maker API',
        endpoints: {
            '/api/video-info': 'GET - Get video information',
            '/api/process': 'POST - Process video and create highlight'
        }
    });
});

// Get video info endpoint
app.get('/api/video-info', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        
        res.json({
            videoId: info.videoDetails.videoId,
            title: info.videoDetails.title,
            duration: parseInt(info.videoDetails.lengthSeconds),
            thumbnail: info.videoDetails.thumbnails[0].url,
            author: info.videoDetails.author.name
        });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video information' });
    }
});

// Process video endpoint
app.post('/api/process', async (req, res) => {
    const { url, startTime, duration, format, skipFrames } = req.body;
    
    // Validation
    if (!url || startTime === undefined || !duration || !format) {
        return res.status(400).json({ 
            error: 'Missing required parameters: url, startTime, duration, format' 
        });
    }

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoId = ytdl.getVideoID(url);
    const timestamp = Date.now();
    const inputPath = path.join(TEMP_DIR, `input_${videoId}_${timestamp}.mp4`);
    const outputPath = path.join(TEMP_DIR, `output_${videoId}_${timestamp}.${format}`);

    try {
        // Step 1: Download video
        console.log('Starting download...');
        
        const videoStream = ytdl(url, {
            quality: 'highest',
            filter: format === 'webp' ? 'videoonly' : 'audioandvideo'
        });

        const writeStream = fs.createWriteStream(inputPath);
        
        await new Promise((resolve, reject) => {
            videoStream.pipe(writeStream);
            videoStream.on('end', resolve);
            videoStream.on('error', reject);
            writeStream.on('error', reject);
        });

        console.log('Download complete. Processing...');

        // Step 2: Process with FFmpeg
        const actualStartTime = startTime + (skipFrames || 0);

        await new Promise((resolve, reject) => {
            let command = ffmpeg(inputPath)
                .setStartTime(actualStartTime)
                .setDuration(duration);

            // Format-specific settings
            if (format === 'webp') {
                command
                    .outputOptions([
                        '-vcodec libwebp',
                        '-lossless 0',
                        '-compression_level 3',
                        '-q:v 70',
                        '-loop 0',
                        '-preset default',
                        '-an',
                        '-vsync 0'
                    ]);
            } else if (format === 'webm') {
                command
                    .outputOptions([
                        '-c:v libvpx-vp9',
                        '-crf 30',
                        '-b:v 0',
                        '-c:a libopus'
                    ]);
            } else {
                // MP4
                command
                    .outputOptions([
                        '-c:v libx264',
                        '-preset medium',
                        '-crf 23',
                        '-c:a aac'
                    ]);
            }

            command
                .output(outputPath)
                .on('end', () => {
                    console.log('Processing complete');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .on('progress', (progress) => {
                    console.log(`Processing: ${progress.percent}% done`);
                })
                .run();
        });

        // Step 3: Send file
        res.download(outputPath, `highlight_${videoId}.${format}`, (err) => {
            // Cleanup
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            
            if (err) {
                console.error('Error sending file:', err);
            }
        });

    } catch (error) {
        // Cleanup on error
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        
        console.error('Processing error:', error);
        res.status(500).json({ 
            error: 'Failed to process video',
            details: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Temp directory: ${TEMP_DIR}`);
});
