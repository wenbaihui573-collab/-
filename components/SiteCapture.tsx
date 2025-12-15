
import React, { useState, useRef } from 'react';
import { Camera, X, MapPin, HelpCircle, ChevronRight, Hand } from 'lucide-react';
import { Marker, SiteData, FeatureType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SiteCaptureProps {
  onComplete: (data: SiteData) => void;
}

const SiteCapture: React.FC<SiteCaptureProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [tempMarkerPos, setTempMarkerPos] = useState<{ x: number, y: number } | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const [selectedType, setSelectedType] = useState<FeatureType>(FeatureType.MODIFY);
  const [tutorialStep, setTutorialStep] = useState<number>(1); // 0: None, 1: Upload, 2: Mark
  
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setTutorialStep(2); // Auto-trigger step 2 when image loads
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTempMarkerPos({ x, y });
    setIsAdding(true);
    if (tutorialStep === 2) setTutorialStep(0); // Dismiss tutorial on first interaction
  };

  const confirmMarker = () => {
    if (tempMarkerPos && labelInput) {
      const newMarker: Marker = {
        id: Date.now().toString(),
        x: tempMarkerPos.x,
        y: tempMarkerPos.y,
        label: labelInput,
        type: selectedType
      };
      setMarkers([...markers, newMarker]);
      setIsAdding(false);
      setLabelInput('');
      setTempMarkerPos(null);
    }
  };

  const removeMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  const openHelp = () => {
    setTutorialStep(image ? 2 : 1);
  };

  return (
    <div className="flex flex-col h-full bg-urban-100 relative">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm z-10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-brand-900">{t.capture.step1Title}</h2>
          <p className="text-sm text-gray-500">{t.capture.step1Desc}</p>
        </div>
        <button 
          onClick={openHelp}
          className="p-2 text-brand-600 hover:bg-brand-50 rounded-full transition"
          title={t.capture.tutorial.view}
        >
          <HelpCircle size={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {!image ? (
          <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:border-brand-500 transition-colors relative">
             <Camera className="w-12 h-12 text-gray-400 mb-2" />
             <label className="cursor-pointer bg-brand-500 text-white px-6 py-3 rounded-full hover:bg-brand-600 transition shadow-md font-medium z-10">
               {t.capture.uploadBtn}
               <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
             </label>
             {/* Subtle pulse behind button if on step 1 */}
             {tutorialStep === 1 && (
                <span className="absolute w-40 h-16 bg-brand-200 rounded-full animate-ping opacity-20 top-[calc(50%+4px)]"></span>
             )}
          </div>
        ) : (
          <div className="relative w-full max-w-lg shadow-lg rounded-lg overflow-hidden group">
            <img 
              ref={imageRef}
              src={image} 
              alt="Site" 
              className="w-full h-auto object-cover cursor-crosshair"
              onClick={handleImageClick}
            />
            {/* Instruction Overlay */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none flex items-center gap-1">
              <Hand size={12} /> {t.capture.overlayInstruction}
            </div>

            {/* Existing Markers */}
            {markers.map(m => (
              <div 
                key={m.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/marker z-10"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    m.type === FeatureType.RETAIN ? 'bg-green-500' :
                    m.type === FeatureType.REMOVE ? 'bg-red-500' :
                    m.type === FeatureType.ISSUE ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <span className="mt-1 bg-white/90 text-[10px] px-2 py-0.5 rounded shadow text-gray-800 whitespace-nowrap font-medium backdrop-blur-sm">
                    {m.label}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeMarker(m.id); }}
                  className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/marker:opacity-100 transition scale-90 hover:scale-100"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            {/* Adding Marker Modal/Popover */}
            {isAdding && tempMarkerPos && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in duration-200" onClick={() => setIsAdding(false)}>
                <div className="bg-white p-4 rounded-xl shadow-2xl w-64 ring-1 ring-black/5 transform scale-100" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-500" />
                    {t.capture.addMarkerTitle}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.capture.labelDesc}</label>
                      <input 
                        type="text" 
                        placeholder={t.capture.labelPlaceholder} 
                        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        value={labelInput}
                        onChange={e => setLabelInput(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div>
                       <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.capture.labelType}</label>
                       <select 
                        className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value as FeatureType)}
                      >
                        {Object.values(FeatureType).map(typeKey => (
                          <option key={typeKey} value={typeKey}>
                             {t.featureTypes[typeKey]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">{t.capture.cancel}</button>
                      <button onClick={confirmMarker} className="flex-1 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium">{t.capture.confirm}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Marker List Preview */}
        {markers.length > 0 && (
          <div className="w-full max-w-lg mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">{t.capture.markedFeatures} ({markers.length})</h3>
            <div className="flex flex-wrap gap-2">
              {markers.map(m => (
                <span key={m.id} className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full flex items-center gap-1.5 text-gray-700">
                  <div className={`w-2 h-2 rounded-full ${
                    m.type === FeatureType.RETAIN ? 'bg-green-500' :
                    m.type === FeatureType.REMOVE ? 'bg-red-500' :
                    m.type === FeatureType.ISSUE ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 bg-white border-t z-10">
        <button 
          onClick={() => image && onComplete({ image, markers, description: '' })}
          disabled={!image}
          className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-brand-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {t.capture.nextBtn} <ChevronRight size={18} />
        </button>
      </footer>

      {/* TUTORIAL OVERLAY */}
      {tutorialStep > 0 && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-sm shadow-2xl relative w-full transform transition-all scale-100">
             <button 
                onClick={() => setTutorialStep(0)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
             >
               <X size={20} />
             </button>

             {tutorialStep === 1 ? (
               <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4 text-brand-600">
                   <Camera size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">{t.capture.tutorial.step1Title}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed mb-6">
                   {t.capture.tutorial.step1Desc}
                 </p>
                 <button 
                   onClick={() => setTutorialStep(0)}
                   className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-600 transition"
                 >
                   {t.capture.tutorial.step1Btn}
                 </button>
               </div>
             ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.capture.tutorial.step2Title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    <span className="font-semibold text-gray-800">{t.capture.tutorial.step2DescPart1}</span> {t.capture.tutorial.step2DescPart2}
                    <br/><br/>
                    <span className="whitespace-pre-line">{t.capture.tutorial.step2Examples}</span>
                  </p>
                  <button 
                    onClick={() => setTutorialStep(0)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    {t.capture.tutorial.step2Btn}
                  </button>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteCapture;
