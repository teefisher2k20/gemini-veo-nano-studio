<div align="center">
<img width="1200" height="475" alt="Gemini Veo & Nano Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎬 Gemini Veo & Nano Studio

**Create stunning AI-powered videos and edit images with Google's most advanced models**

[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini API](https://img.shields.io/badge/Gemini-API-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](https://ai.studio/apps/drive/1Iykkz_zocVfo9RNIf0qvUoX4O28hvF8y) • [Report Bug](https://github.com/teefisher2k20/gemini-veo-nano-studio/issues) • [Request Feature](https://github.com/teefisher2k20/gemini-veo-nano-studio/issues)

</div>

---

## ✨ Features

### 🎥 **Veo Video Generation**
- **Text-to-Video**: Generate high-quality videos from text prompts using Veo 3.1
- **Image-to-Video**: Animate your images with cinematic effects
- **Aspect Ratios**: 16:9 landscape or 9:16 portrait support
- **Export Options**: Download as MP4 or convert to GIF
- **Template Prompts**: Quick-start with pre-built cinematic prompts

### 🎬 **Storyboard Creator** ⭐ NEW
- **Multi-Shot Sequences**: Create 3-10 connected video shots
- **Individual Control**: Unique prompts, durations, and transitions per shot
- **Sequential Generation**: Automatic API rate limit handling
- **Real-Time Status**: Track each shot's progress (Ready → Generating → Complete)
- **Export Metadata**: Download storyboard data as JSON

### 🖼️ **Magic Image Editor**
- **Natural Language Editing**: Use Gemini 2.5 Flash Image for instant transformations
- **Side-by-Side Preview**: Compare original and edited results
- **Fast Processing**: Near-instant edits (typically < 5 seconds)

### 🔒 **Smart Features**
- Offline detection with automatic UI updates
- API key management via AI Studio platform
- Error handling with user-friendly messages
- Responsive dark theme design

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Gemini API Key** from [Google AI Studio](https://ai.google.dev)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/teefisher2k20/gemini-veo-nano-studio.git
   cd gemini-veo-nano-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 🎯 Usage

### Video Generation

1. Navigate to the **Veo Video** tab
2. Enter a descriptive prompt (e.g., "A cinematic drone shot flying through a cyberpunk city")
3. Choose aspect ratio (16:9 or 9:16)
4. Optional: Upload an image to animate
5. Click **Generate** and wait ~30-60 seconds
6. Download as MP4 or export as GIF

### Storyboard Creation

1. Navigate to the **🎬 Storyboard** tab
2. Enter a title for your storyboard
3. Fill in prompts for each shot (add up to 10)
4. Set duration and transition type for each
5. Click **Generate Storyboard**
6. Videos generate sequentially
7. Download metadata JSON when complete

### Image Editing

1. Navigate to the **Nano Image** tab
2. Upload an image
3. Type editing instructions (e.g., "Add a retro filter and remove background")
4. Click **Generate Edit**
5. Compare original vs edited side-by-side

---

## 🏗️ Project Structure

```
gemini-veo-nano-studio/
├── components/
│   ├── VideoGenerator.tsx      # Veo video generation
│   ├── ImageEditor.tsx          # Gemini image editing
│   ├── StoryboardGenerator.tsx  # Multi-shot storyboard
│   └── ApiKeyGuard.tsx          # API key validation
├── services/
│   └── genai.ts                 # Gemini API integration
├── types.ts                     # TypeScript interfaces
├── App.tsx                      # Main app with routing
├── vite.config.ts               # Vite configuration
└── .github/
    └── copilot-instructions.md  # AI agent guidance
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.1 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (utility-first)
- **AI Models**: 
  - Veo 3.1 Fast Generate (video)
  - Gemini 2.5 Flash Image (editing)
- **SDK**: `@google/genai` v1.31.0

---

## 📝 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

### Vite Configuration

The app uses custom environment injection to support AI Studio platform:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

---

## 🌐 Deployment

### Option 1: AI Studio (Recommended)
View the live app: [AI Studio Link](https://ai.studio/apps/drive/1Iykkz_zocVfo9RNIf0qvUoX4O28hvF8y)

### Option 2: GitHub Pages
1. Build the project:
   ```bash
   npm run build
   ```
2. The `dist/` folder contains your static files
3. Deploy to GitHub Pages, Vercel, or Netlify

### Option 3: Local Build
```bash
npm run build
npm run preview  # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini Team** for the incredible AI models
- **Veo 3.1** for high-quality video generation
- **React Team** for the robust framework

---

## 📧 Contact

**Terrance Fisher** - [@teefisher2k20](https://github.com/teefisher2k20)

Project Link: [https://github.com/teefisher2k20/gemini-veo-nano-studio](https://github.com/teefisher2k20/gemini-veo-nano-studio)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ using Google Gemini API

</div>
