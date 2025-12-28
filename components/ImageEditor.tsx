import React, { useState, useRef } from 'react';
import { editImage } from '../services/genai';
import { GenerationStatus } from '../types';

interface ImageEditorProps {
  isOffline: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ isOffline }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setResultImage(null);
      setStatus('idle');
    }
  };

  const handleEdit = async () => {
    if (!imageFile || !instruction) return;
    if (isOffline) return;

    setStatus('processing');
    setError(null);
    setResultImage(null);

    try {
      const result = await editImage(imageFile, instruction);
      setResultImage(result);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to edit image");
      setStatus('failed');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
       <div className="flex flex-col lg:flex-row gap-6 h-full">
         
         {/* Controls */}
         <div className="w-full lg:w-1/3 space-y-6 bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
           <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
             Magic Editor (Nano)
           </h2>
           
           <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">1. Upload Image</label>
            <div 
              onClick={() => !isOffline && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isOffline ? 'cursor-not-allowed opacity-50 border-gray-600' : imageFile ? 'border-yellow-500/50 bg-gray-700/30' : 'border-gray-600 hover:bg-gray-700/50 cursor-pointer'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={isOffline}
              />
              {!imageFile ? (
                 <>
                  <svg className="w-8 h-8 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400">Upload photo to edit</p>
                 </>
              ) : (
                 <div className="text-sm text-yellow-400 font-medium truncate">
                    {imageFile.name}
                 </div>
              )}
            </div>
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-medium text-gray-300">2. Instruction</label>
             <textarea
               className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none h-24 disabled:opacity-50"
               placeholder="e.g., Add a retro filter, remove the person in background..."
               value={instruction}
               onChange={(e) => setInstruction(e.target.value)}
               disabled={isOffline}
             />
           </div>

           <button
             onClick={handleEdit}
             disabled={status === 'processing' || !imageFile || !instruction || isOffline}
             className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg
               ${isOffline
                 ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                 : status === 'processing' 
                   ? 'bg-gray-600 cursor-wait' 
                   : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:shadow-yellow-500/25'
               }
               disabled:opacity-50 disabled:shadow-none
             `}
           >
             {isOffline 
               ? 'Offline - Internet Required' 
               : status === 'processing' 
                 ? 'Editing...' 
                 : 'Generate Edit'
             }
           </button>

           {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
         </div>

         {/* Visuals */}
         <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {imageFile && (
               <div className="bg-black rounded-xl border border-gray-800 p-2 relative group overflow-hidden">
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">Original</div>
                 <img 
                   src={URL.createObjectURL(imageFile)} 
                   alt="Original" 
                   className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-lg" 
                 />
               </div>
            )}
            
            <div className="flex-1 bg-black rounded-xl border border-gray-800 p-2 flex items-center justify-center min-h-[300px] relative">
               {!resultImage && status !== 'processing' && (
                  <div className="text-gray-500 text-sm">Edited result will appear here</div>
               )}
               {status === 'processing' && (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mb-2"></div>
                    <p className="text-yellow-500 text-sm animate-pulse">Applying magic...</p>
                  </div>
               )}
               {resultImage && (
                 <>
                  <div className="absolute top-2 left-2 bg-yellow-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded z-10">Result</div>
                  <img src={resultImage} alt="Result" className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-2xl" />
                 </>
               )}
            </div>
         </div>

       </div>
    </div>
  );
};

export default ImageEditor;