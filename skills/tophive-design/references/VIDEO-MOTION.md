# Video / Motion / Compositing — choose the actual medium

Distinguish three requests before building:
1. Video-led website (existing or new clips embedded as media).
2. Kinetic graphics / animated branding (vector/HTML/WebGL sequences).
3. Video editor or rendered output (timeline, compositing, audio and export). The third is an application/media engine, not a landing-page animation.

## Technology decision
- Video-led site: native `<video>`, poster image, correctly encoded sources, captions/transcripts for meaningful speech, controls, mobile-appropriate playsInline/muted behavior. Autoplay may be blocked; never require it to reveal content.
- Short vector micro-interaction: SVG/CSS/WAAPI or Lottie/Rive if interaction complexity and asset origin justify dependencies.
- Programmatically rendered composition: Remotion (React-based frame/timeline composition) when requested/export needed; inspect licenses, runtime and rendering environment.
- Real editor: dedicated timeline/data model, clip-trim/split/seek, track order, waveforms, media ingestion/storage, audio sync, encoding/export and recoverable job queue; WebCodecs/FFmpeg only when supported/authorized. A mock timeline is not a video editor.
- WebGL/3D video mixing: only where render pipeline, color space and media sync are understood. Do not claim native media support without verified device/browser tests.

## Media engineering contract
- Inventory user-provided/licensed original assets, codecs/resolution/bitrate, poster, duration, looping, captions, copyright permissions, delivery CDN and offline fallback.
- Control decode/seek/playback; cleanup Video/AudioContext/frame callbacks and media streams on unmount. Don't spawn many simultaneously playing full-resolution video layers on mobile.
- For timeline editor, record source/in-out, track type, frame rate, composition duration, timeline units, undo history, autosave and deterministic render IDs. Resolve audio/video sync and transition semantics explicitly.
- Respect prefers-reduced-motion: remove autoplay decorative motion and provide stable poster/fallback. Pause offscreen media where practical.
- Preserve browser controls or real accessible equivalents, mute status, keyboard seek where appropriate and no surprise audio.

## Acceptance
Video-led website: initial poster, play/pause, mobile inline playback, loading/error, captions, reduced-motion and network throttling.
Rendered composition: deterministic frame duration/size/fps, playback, audio levels, successful export verified by inspecting actual output (not just launching job).
Editor: multi-track editing journey + undo/redo + save/reload + scrub/audio sync + cancel/retry export tested; label unsupported formats truthfully.
Never claim actual codec, GPU, render or multimedia functionality tested from static screenshots.
Official docs: https://www.remotion.dev/docs/composition and https://www.remotion.dev/docs/render ; check APIs and license at implementation time.
