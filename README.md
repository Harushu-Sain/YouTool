# YouTool

> A fast and simple YouTube downloader for Termux on Android.

[![Platform](https://img.shields.io/badge/Platform-Termux-000000?logo=termux)](https://termux.dev/)
[![Runtime](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Engine](https://img.shields.io/badge/Engine-yt--dlp-blue)](https://github.com/yt-dlp/yt-dlp)
[![License](https://img.shields.io/badge/License-Apache%202.0-red)](LICENSE)

**YouTool** is a lightweight command-line YouTube downloader designed specifically for **Termux + Android**.

Download videos or extract audio directly from your Android terminal with a simple interactive interface.

---

## ✨ Features

- 🎬 **Video downloads** — MP4
- 🎵 **Audio downloads** — MP3
- ⚡ **Fast downloads** powered by `yt-dlp`
- 🎚️ Multiple video quality options
- 🎧 Multiple audio quality options
- 🖼️ Thumbnail embedding
- 🏷️ Metadata embedding
- 📱 Android storage integration
- 🎨 Clean interactive terminal interface
- 📊 Live download progress

---

## 📱 Requirements

Before installing YouTool, make sure you have:

- Android
- Termux
- Internet connection

The installer automatically installs the required packages:

- Node.js
- Python
- FFmpeg
- yt-dlp

---

## 🚀 Quick Install

Copy and run this command in **Termux**:

```bash
git clone https://github.com/Harushu-Sain/YouTool.git ~/YouTool && pkg install -y nodejs python ffmpeg && python -m pip install -U yt-dlp && termux-setup-storage && install -m 755 ~/YouTool/yt-download.js $PREFIX/bin/youtool
```

---

## ▶️ Run YouTool

After installation, simply run:

```bash
youtool
```

That's it.

---

## 🎥 Video

YouTool allows you to choose the video quality before downloading.

Available quality options include:

```text
Best
1440p
1080p
720p
480p
360p
```

Videos are saved to:

```text
~/storage/shared/Movies/
```

---

## 🎵 Audio

You can also extract audio as MP3.

Available quality options include:

```text
Best
High
Standard
Low
```

Audio files are saved to:

```text
~/storage/shared/Music/
```

---

## 🛠️ Troubleshooting

### yt-dlp is not installed

```bash
python -m pip install -U yt-dlp
```

### FFmpeg is missing

```bash
pkg install ffmpeg -y
```

### Android storage is not available

Run:

```bash
termux-setup-storage
```

Then allow the storage permission.

### Update YouTool

```bash
cd ~/YouTool && git pull
```

Then reinstall the command:

```bash
install -m 755 ~/YouTool/yt-download.js $PREFIX/bin/youtool
```

---

## 📂 Project Structure

```text
YouTool/
├── yt-download.js
├── README.md
└── LICENSE
```

---

## ⚙️ How It Works

```text
          YouTube URL
               │
               ▼
          ┌─────────┐
          │ YouTool │
          └────┬────┘
               │
               ▼
            yt-dlp
          ┌────┴────┐
          │         │
       Video      Audio
          │         │
          ▼         ▼
       Movies     Music
```

---

## 🔐 Responsible Use

YouTool is intended for downloading content that you are legally permitted to download.

Please respect:

- Copyright laws
- Content creators
- Licensing restrictions
- YouTube's Terms of Service
- Applicable local laws

Do not use YouTool to download or redistribute copyrighted content without permission.

---

## 🤝 Contributing

Contributions, bug reports and suggestions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Open a Pull Request

---

## ⭐ Support

If you find **YouTool** useful:

⭐ Star the repository  
🐛 Report bugs  
💡 Suggest features  
🤝 Contribute

---

## 📄 License

This project is licensed under the **Apache License 2.0**.

See the [`LICENSE`](LICENSE) file for details.

---

<div align="center">

**Made for Termux & Android**

⭐ **YouTool**

</div>
