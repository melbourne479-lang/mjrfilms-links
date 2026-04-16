document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.link-item');
    const spotlight = document.getElementById('spotlight');
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    const profileCard = document.querySelector('.profile-card');
    const mainContent = document.querySelector('.main-content');
    
    // Video Elements
    const introVideo = document.getElementById('intro-video');
    const bgLoop = document.getElementById('bg-loop');
    const introContainer = document.getElementById('video-intro-container');
    const loopContainer = document.getElementById('video-loop-container');
    const volumeToggle = document.getElementById('volume-toggle');
    const iconSoundOn = document.getElementById('icon-sound-on');
    const iconSoundOff = document.getElementById('icon-sound-off');

    // Initialize as muted for autoplay compatibility
    if (introVideo) introVideo.muted = true;
    if (bgLoop) bgLoop.muted = true;

    let width, height;
    let mouse = { x: -1000, y: -1000 };

    // 1. Canvas Dimensions
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 2. Cinematic Entrance Controller
    function startIntro() {
        if (introVideo) {
            introVideo.playbackRate = 1.5; 
            
            // Safety: If video stalls or fails, force transition after 8s
            const safetyTimeout = setTimeout(() => {
                console.log("Intro timed out, forcing transition");
                finishIntro();
            }, 8000);

            introVideo.play().catch(e => {
                console.log("Autoplay prevented, jumping to loop");
                clearTimeout(safetyTimeout);
                finishIntro();
            });
            
            // Trigger link entrance immediately (but faded)
            triggerLinkEntrance();
            
            introVideo.onended = () => {
                clearTimeout(safetyTimeout);
                finishIntro();
            };
        } else {
            finishIntro();
        }
    }

    function finishIntro() {
        // Transition to Loop & Full UI focus
        if (introContainer) introContainer.classList.add('hidden');
        if (loopContainer) loopContainer.classList.remove('hidden');
        if (mainContent) mainContent.classList.add('visible'); // Fully faded in here
        
        if (bgLoop) {
            bgLoop.play();
        }
    }

    // Start the sequence
    startIntro();

    // 3. Smoke Engine (Disabled for full transparency/clarity)
    /*
    class Smoke {
        ...
    }
    const smokeParticles = Array.from({ length: 25 }, () => new Smoke());
    function animate() {
        ctx.clearRect(0, 0, width, height);
        smokeParticles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
    */
    function clearCanvas() {
        ctx.clearRect(0, 0, width, height);
    }
    clearCanvas();

    // 4. Mouse Interaction
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        if (spotlight) {
            spotlight.style.left = e.clientX + 'px';
            spotlight.style.top = e.clientY + 'px';
        }

        const x = (window.innerWidth / 2 - e.pageX) / 60;
        const y = (window.innerHeight / 2 - e.pageY) / 60;
        
        if (profileCard) {
            profileCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        }
    });

    // 5. Sequential Link Entrance
    function triggerLinkEntrance() {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.98)';
            
            setTimeout(() => {
                card.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 100 * index + 300);
        });
    }

    // 6. Volume Control Logic
    if (volumeToggle) {
        volumeToggle.addEventListener('click', () => {
            const isMuted = bgLoop.muted; // Use bgLoop as source of truth
            const newMutedState = !isMuted;
            
            // Toggle muting for both videos
            [introVideo, bgLoop].forEach(video => {
                if (video) {
                    video.muted = newMutedState;
                    video.volume = 1.0;
                    
                    // Force play in case the browser paused it due to autoplay restrictions
                    if (!newMutedState) {
                        video.play().catch(err => console.log("Audio play failed:", err));
                    }
                }
            });
            
            // Toggle icons
            if (newMutedState) {
                iconSoundOn.classList.add('hidden');
                iconSoundOff.classList.remove('hidden');
            } else {
                iconSoundOn.classList.remove('hidden');
                iconSoundOff.classList.add('hidden');
            }
        });
    }

    // Click Feedback
    cards.forEach(card => {
        card.addEventListener('mousedown', () => card.style.transform = 'scale(0.97)');
        card.addEventListener('mouseup', () => card.style.transform = 'scale(1.02)');
    });
});
