// packages/ui/src/hooks/usePlaySound.ts
import { useCallback, useRef } from 'react';

type PlaySoundOptions = {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
};

type PlaySoundReturn = {
  play: (options?: PlaySoundOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isPlaying: boolean;
};

export function usePlaySound(src: string): PlaySoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener('ended', () => {
        isPlayingRef.current = false;
      });
    }
    return audioRef.current;
  }, [src]);

  const play = useCallback(
    (options?: PlaySoundOptions) => {
      const audio = getAudio();

      // Apply options
      audio.volume = options?.volume ?? 1;
      audio.loop = options?.loop ?? false;
      audio.playbackRate = options?.playbackRate ?? 1;

      // Reset to start and play
      audio.currentTime = 0;
      audio.play();
      isPlayingRef.current = true;
    },
    [getAudio]
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    isPlayingRef.current = false;
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    isPlayingRef.current = true;
  }, []);

  return {
    play,
    stop,
    pause,
    resume,
    get isPlaying() {
      return isPlayingRef.current;
    },
  };
}
