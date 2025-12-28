import React, { useState } from 'react';
import { StoryboardShot, GenerationStatus, AspectRatio } from '../types';
import { generateVideo } from '../services/genai';

interface StoryboardGeneratorProps {
  isOffline: boolean;
}

const StoryboardGenerator: React.FC<StoryboardGeneratorProps> = ({ isOffline }) => {
  const [shots, setShots] = useState<StoryboardShot[]>([
    { id: '1', prompt: '', duration: 5, transition: 'fade', status: 'idle' },
    { id: '2', prompt: '', duration: 5, transition: 'fade', status: 'idle' },
    { id: '3', prompt: '', duration: 5, transition: 'fade', status: 'idle' },
  ]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [storyboardTitle, setStoryboardTitle] = useState('My Storyboard');
  const [isGenerating, setIsGenerating] = useState(false);

  const addShot = () => {
    const newShot: StoryboardShot = {
      id: Date.now().toString(),
      prompt: '',
      duration: 5,
      transition: 'fade',
      status: 'idle',
    };
    setShots([...shots, newShot]);
  };

  const removeShot = (id: string) => {
    if (shots.length > 1) {
      setShots(shots.filter(shot => shot.id !== id));
    }
  };

  const updateShot = (id: string, field: keyof StoryboardShot, value: any) => {
    setShots(shots.map(shot => 
      shot.id === id ? { ...shot, [field]: value } : shot
    ));
  };

  const generateAllShots = async () => {
    if (!navigator.onLine) {
      return;
    }

    const emptyPrompts = shots.filter(shot => !shot.prompt.trim());
    if (emptyPrompts.length > 0) {
      return;
    }

    setIsGenerating(true);

    // Generate videos sequentially to avoid API rate limits
    for (const shot of shots) {
      try {
        // Update status to processing
        setShots(prev => prev.map(s => 
          s.id === shot.id ? { ...s, status: 'processing' as GenerationStatus } : s
        ));

        const videoUri = await generateVideo(
          shot.prompt, 
          aspectRatio === AspectRatio.LANDSCAPE ? '16:9' : '9:16'
        );

        // Update with video URI
        setShots(prev => prev.map(s => 
          s.id === shot.id 
            ? { ...s, videoUri: videoUri || undefined, status: 'completed' as GenerationStatus } 
            : s
        ));

      } catch (error) {
        console.error(`Error generating shot ${shot.id}:`, error);
        setShots(prev => prev.map(s => 
          s.id === shot.id 
            ? { 
                ...s, 
                status: 'failed' as GenerationStatus, 
                error: error instanceof Error ? error.message : 'Generation failed' 
              } 
            : s
        ));
      }
    }

    setIsGenerating(false);
  };

  const downloadStoryboard = () => {
    const completedShots = shots.filter(s => s.videoUri);
    if (completedShots.length === 0) {
      return;
    }

    // Create a JSON file with storyboard data
    const storyboardData = {
      title: storyboardTitle,
      shots: completedShots.map(shot => ({
        prompt: shot.prompt,
        videoUri: shot.videoUri,
        duration: shot.duration,
        transition: shot.transition,
      })),
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(storyboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyboardTitle.replace(/\s+/g, '-')}-storyboard.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: GenerationStatus) => {
    switch (status) {
      case 'processing': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          🎬 Storyboard Generator
        </h2>
        <p className="text-gray-400 mb-6">
          Create a multi-shot video sequence. Each shot will be generated as a separate video using Gemini Veo.
        </p>

        {/* Storyboard Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Storyboard Title</label>
            <input
              type="text"
              value={storyboardTitle}
              onChange={(e) => setStoryboardTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter storyboard title"
              disabled={isOffline}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              disabled={isOffline}
            >
              <option value={AspectRatio.LANDSCAPE}>16:9 Landscape</option>
              <option value={AspectRatio.PORTRAIT}>9:16 Portrait</option>
            </select>
          </div>
        </div>

        {/* Shots List */}
        <div className="space-y-4 mb-6">
          {shots.map((shot, index) => (
            <div key={shot.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Shot {index + 1}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(shot.status)}`}>
                    {shot.status === 'processing' && '⏳ Generating...'}
                    {shot.status === 'completed' && '✓ Complete'}
                    {shot.status === 'failed' && '✗ Failed'}
                    {shot.status === 'idle' && '⚪ Ready'}
                  </span>
                  {shots.length > 1 && (
                    <button
                      onClick={() => removeShot(shot.id)}
                      disabled={isGenerating || isOffline}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove shot"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={shot.prompt}
                onChange={(e) => updateShot(shot.id, 'prompt', e.target.value)}
                disabled={isGenerating || isOffline}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none mb-3 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={3}
                placeholder="Describe this shot... (e.g., 'A wide shot of a city at sunrise, cinematic 35mm film')"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    value={shot.duration}
                    onChange={(e) => updateShot(shot.id, 'duration', parseInt(e.target.value) || 5)}
                    disabled={isGenerating || isOffline}
                    min={1}
                    max={10}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Transition</label>
                  <select
                    value={shot.transition}
                    onChange={(e) => updateShot(shot.id, 'transition', e.target.value)}
                    disabled={isGenerating || isOffline}
                    className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="fade">Fade</option>
                    <option value="cut">Cut</option>
                    <option value="dissolve">Dissolve</option>
                  </select>
                </div>
              </div>

              {shot.error && (
                <div className="mt-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                  Error: {shot.error}
                </div>
              )}

              {shot.videoUri && (
                <div className="mt-3">
                  <video
                    src={shot.videoUri}
                    controls
                    className="w-full rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={addShot}
            disabled={isGenerating || shots.length >= 10 || isOffline}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
          >
            ➕ Add Shot
          </button>
          <button
            onClick={generateAllShots}
            disabled={isGenerating || shots.some(s => !s.prompt.trim()) || isOffline}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none flex-1"
          >
            {isOffline 
              ? 'Offline - Internet Required'
              : isGenerating 
                ? '⏳ Generating All Shots...' 
                : '🎬 Generate Storyboard'
            }
          </button>
          <button
            onClick={downloadStoryboard}
            disabled={!shots.some(s => s.videoUri)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
          >
            💾 Download Data
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-200">
              ℹ️ Generating shots sequentially to avoid API rate limits. This may take several minutes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryboardGenerator;
