import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  placeholder?: string;
  className?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ 
  onTranscript, 
  placeholder = "Click mic to search by voice...",
  className = ""
}) => {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak
  } = useVoice();

  useEffect(() => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
    }
  }, [transcript, onTranscript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleSpeak = (text: string) => {
    speak(text);
  };

  if (!isSupported) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Voice search not supported in your browser
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={handleVoiceToggle}
        className="flex items-center gap-2"
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Voice Search
          </>
        )}
      </Button>

      {transcript && (
        <>
          <div className="flex-1 text-sm text-muted-foreground bg-muted p-2 rounded">
            {transcript || placeholder}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSpeak(transcript)}
            className="p-2"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </>
      )}
      
      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;