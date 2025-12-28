# Gemini Veo & Nano Studio - AI Agent Instructions

## Project Overview
React + TypeScript single-page application for creative AI generation using Google's Gemini API. Two primary features:
- **Veo Video Generation**: Text-to-video and image-to-video using `veo-3.1-fast-generate-preview`
- **Nano Image Editing**: Natural language image editing using `gemini-2.5-flash-image`

**Deployment**: AI Studio (Google's platform) - NOT a typical web server. Accessed via `https://ai.studio/apps/drive/...`

## Architecture & Critical Patterns

### API Key Management (AI Studio Platform-Specific)
- API keys managed by `window.aistudio` global (injected by AI Studio platform)
- **Never** use standard `.env` or localStorage for keys in user-facing code
- Use `checkApiKey()` and `selectApiKey()` from [services/genai.ts](services/genai.ts)
- `ApiKeyGuard` component gates entire app until key is selected
- Keys auto-appended to video URLs: `${videoUri}&key=${process.env.API_KEY}`

### API Environment Injection
- Vite config injects `GEMINI_API_KEY` from `.env.local` as `process.env.API_KEY`
- **Key pattern**: All service functions call `getClient()` to get fresh GoogleGenAI instance with latest key
- Required for Veo operations where key must be current

### Video Generation Workflow ([services/genai.ts](services/genai.ts#L48-L104))
1. Create operation: `ai.models.generateVideos()` with model `veo-3.1-fast-generate-preview`
2. **Long polling loop**: Poll `ai.operations.getVideosOperation()` every 5s until `operation.done === true`
3. Extract URI from `operation.response.generatedVideos[0].video.uri`
4. Append API key to URI for browser access

**Important**: Veo is async with operations - not instant response like chat models.

### State Management Pattern
All components use local useState - no Redux/Context. Status lifecycle:
- `'idle'` → `'processing'` → `'completed'` | `'failed'`
- See [types.ts](types.ts#L15) for `GenerationStatus` type

### Offline Detection & Handling
- `navigator.onLine` monitored in [App.tsx](App.tsx#L8-L20)
- Red banner shown when offline, all generation buttons disabled
- All generation functions throw early if `!navigator.onLine`

## Key Component Patterns

### VideoGenerator Component ([components/VideoGenerator.tsx](components/VideoGenerator.tsx))
- Supports both text-to-video and image-to-video modes
- `imageFile` state determines mode: if set, uses `image` param in API call
- Template prompts: Hard-coded array at top for quick-start UX
- Export feature: MP4 (direct download) or GIF (uses `window.gifshot` library)
- **GIF Export**: Asynchronous callback pattern, not Promise-based

### ImageEditor Component ([components/ImageEditor.tsx](components/ImageEditor.tsx))
- Single image upload + instruction textarea pattern
- Uses `gemini-2.5-flash-image` model with multipart content (image + text)
- Returns edited image as base64 data URL
- Side-by-side display: original vs edited result

## Development Commands
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Vite production build
npm run preview  # Preview production build locally
```

## Dependencies & External Libraries
- `@google/genai`: Official Google Gemini SDK (v1.31.0)
- `window.gifshot`: Loaded externally by AI Studio platform (not in package.json)
- React 19.2.1 with strict mode

## Common Pitfalls
1. **Don't use standard auth patterns** - This is AI Studio-hosted, not cloud-deployed
2. **Don't assume instant API responses** - Veo requires polling operations
3. **File encoding**: Always use `fileToBase64()` helper, strip data URL prefix
4. **Error handling**: Check for `"Requested entity was not found"` → trigger `openSelectKey()`
5. **Aspect ratio types**: Use enum `AspectRatio.LANDSCAPE` ('16:9') or `AspectRatio.PORTRAIT` ('9:16')

## Testing & Debugging
- No automated tests configured (manual testing workflow)
- Check browser console for API errors
- Video generation typically takes 30-60s (poll interval: 5s)
- Image editing is near-instant (< 5s usually)

## File Structure Conventions
- `/components`: React UI components (one per file, default exports)
- `/services`: API integration logic (named exports, client-agnostic)
- `/types.ts`: Centralized TypeScript enums and interfaces
- Tailwind CSS classes inline (no separate CSS files)
