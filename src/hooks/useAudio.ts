import { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

export const useAudio = (url: string | null) => {
    const player = useRef<Tone.Player | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime] = useState(0);

    useEffect(() => {
        if (!url) return;

        const loadAudio = async () => {
            setIsLoaded(false);
            const newPlayer = new Tone.Player({
                url,
                onload: () => {
                    setIsLoaded(true);
                    setDuration(newPlayer.buffer.duration);
                },
                autostart: false,
            }).toDestination();

            player.current = newPlayer;
        };

        loadAudio();

        return () => {
            player.current?.dispose();
        };
    }, [url]);

    const play = async () => {
        if (player.current && isLoaded) {
            await Tone.start();
            player.current.start();
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (player.current && isPlaying) {
            player.current.stop(); // Tone.Player stop behaves like pause if we track time manually, but simplistically here
            setIsPlaying(false);
        }
    };

    const setPlaybackRate = (rate: number) => {
        if (player.current) {
            player.current.playbackRate = rate;
        }
    };

    const setVolume = (volume: number) => {
        if (player.current) {
            // Volume in Tone is db, we map 0-1 to reasonable db range
            player.current.volume.value = Tone.gainToDb(volume);
        }
    };

    return {
        isLoaded,
        isPlaying,
        duration,
        currentTime,
        play,
        pause,
        setPlaybackRate,
        setVolume
    };
};
