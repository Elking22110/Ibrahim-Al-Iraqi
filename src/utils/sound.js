export const playCinematicSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        const play = () => {
            // Deep Drone (Bass)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(50, ctx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.5);
            gain1.gain.setValueAtTime(0, ctx.currentTime);
            gain1.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.5);
            gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start();
            osc1.stop(ctx.currentTime + 2.5);

            // Low Hum (Sub)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(80, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 2.0);
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start();
            osc2.stop(ctx.currentTime + 2.0);

            // Shimmer (High Frequency)
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(800, ctx.currentTime);
            osc3.frequency.exponentialRampToValueAtTime(0, ctx.currentTime + 1.5); // Dropping pitch
            gain3.gain.setValueAtTime(0, ctx.currentTime);
            gain3.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
            gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.start();
            osc3.stop(ctx.currentTime + 1.5);
        };

        if (ctx.state === 'suspended') {
            const unlock = () => {
                ctx.resume().then(() => {
                    play();
                    cleanup();
                });
            };

            const cleanup = () => {
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
                document.removeEventListener('keydown', unlock);
            };

            document.addEventListener('click', unlock);
            document.addEventListener('touchstart', unlock);
            document.addEventListener('keydown', unlock);

            // Return a cancel function to stop listening if the loader unmounts
            return cleanup;
        } else {
            play();
            return () => { }; // No-op cleanup
        }

    } catch (e) {
        console.error("Audio play failed", e);
    }
};
