# YouTube Highlight Maker - Backend API

Backend service per il YouTube Highlight Maker. Gestisce il download e processing di video YouTube usando `ytdl-core` e `ffmpeg`.

## 🚀 Quick Start

### Prerequisiti

1. **Node.js** (v16 o superiore)
2. **FFmpeg** installato sul sistema

#### Installare FFmpeg:

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
- Scarica da [ffmpeg.org](https://ffmpeg.org/download.html)
- Aggiungi al PATH di sistema

### Installazione

```bash
# Clone o scarica il progetto
cd youtube-highlight-backend

# Installa dipendenze
npm install

# Crea file .env (opzionale)
cp .env.example .env

# Avvia il server
npm start
```

Il server sarà disponibile su `http://localhost:3000`

## 📡 API Endpoints

### GET `/`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "YouTube Highlight Maker API",
  "endpoints": { ... }
}
```

### GET `/api/video-info`
Ottieni informazioni su un video YouTube

**Query Parameters:**
- `url` (string, required): URL del video YouTube

**Example:**
```
GET /api/video-info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Response:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Video Title",
  "duration": 213,
  "thumbnail": "https://...",
  "author": "Channel Name"
}
```

### POST `/api/process`
Processa un video YouTube e crea un highlight

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "startTime": 10,
  "duration": 5,
  "format": "mp4",
  "skipFrames": 2
}
```

**Parameters:**
- `url` (string, required): URL del video YouTube
- `startTime` (number, required): Tempo di inizio in secondi
- `duration` (number, required): Durata del clip in secondi
- `format` (string, required): Formato output (`mp4`, `webm`, `webp`)
- `skipFrames` (number, optional): Secondi da skippare all'inizio (default: 0)

**Response:**
File download con il clip processato

## 🔧 Integrazione Frontend

Aggiorna il frontend HTML per usare il backend:

```javascript
// Nel file youtube-highlight-maker.html

async function processYouTubeVideo(url, startTime, duration, format, skipFrames) {
    try {
        const response = await fetch('http://localhost:3000/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                startTime,
                duration,
                format,
                skipFrames
            })
        });

        if (!response.ok) {
            throw new Error('Processing failed');
        }

        // Download del file
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `highlight_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

## 🌐 Deploy

### Opzione 1: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# Sul server
git clone <your-repo>
cd youtube-highlight-backend
npm install

# Installa FFmpeg
sudo apt install ffmpeg

# Usa PM2 per mantenere il processo attivo
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Opzione 2: Heroku

Crea un `Procfile`:
```
web: node server.js
```

Aggiungi FFmpeg buildpack:
```bash
heroku buildpacks:add --index 1 https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
```

Deploy:
```bash
git push heroku main
```

### Opzione 3: Vercel (con limitazioni)

⚠️ **Nota:** Vercel ha limitazioni sulla dimensione dei file e timeout di 10 secondi per i serverless functions. Potrebbe non essere adatto per video lunghi.

### Opzione 4: Railway.app (Consigliato)

1. Crea account su [railway.app](https://railway.app)
2. Connetti il repo GitHub
3. Deploy automatico
4. FFmpeg è già disponibile

## ⚙️ Environment Variables

Crea un file `.env`:

```
PORT=3000
```

## 🐛 Troubleshooting

### "FFmpeg not found"
Assicurati che FFmpeg sia installato e nel PATH:
```bash
ffmpeg -version
```

### CORS errors
Il backend già include CORS. Se hai problemi, verifica che l'URL del frontend sia corretto.

### "Video unavailable"
Alcuni video YouTube hanno restrizioni. Verifica che il video sia pubblicamente accessibile.

### Timeout su video lunghi
Per video molto lunghi (>10 min), considera di:
- Aumentare i timeout nel frontend
- Usare un sistema di job queue (Redis + Bull)
- Implementare websocket per aggiornamenti real-time

## 📝 Note Tecniche

- **ytdl-core**: Libreria per download YouTube (potrebbe avere problemi con aggiornamenti di YouTube)
- **fluent-ffmpeg**: Wrapper Node.js per FFmpeg
- **Temporary files**: I file vengono automaticamente puliti dopo 1 ora
- **Formati supportati**: MP4, WebM, WebP (solo 5s)

## 🔒 Sicurezza

Per production:
- Aggiungi rate limiting (es. `express-rate-limit`)
- Implementa autenticazione
- Valida input rigorosi
- Limita dimensioni file
- Usa HTTPS

## 📊 Performance

Il processing dipende da:
- Lunghezza del video originale
- Durata del clip
- Formato output
- CPU del server

Tempi medi:
- Download: 5-30s (dipende dal video)
- Processing: 2-10s per clip

## 🤝 Contribuire

Pull requests are welcome!

## 📄 License

ISC
