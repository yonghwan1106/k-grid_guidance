// Presentation Navigation Script

// State management
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;

// DOM elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideElement = document.getElementById('currentSlide');
const totalSlidesElement = document.getElementById('totalSlides');

// Initialize
function init() {
    // Set total slides
    totalSlidesElement.textContent = totalSlides;

    // Show first slide
    showSlide(currentSlide);

    // Add event listeners
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyPress);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            previousSlide();
        }
    }
}

// Show specific slide
function showSlide(slideNumber) {
    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Add active class to current slide
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        slides[slideNumber - 1].classList.add('active');
        currentSlide = slideNumber;
        currentSlideElement.textContent = currentSlide;

        // Update button states
        updateButtonStates();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Add animation
        slides[slideNumber - 1].style.animation = 'none';
        setTimeout(() => {
            slides[slideNumber - 1].style.animation = 'slideIn 0.5s ease-out';
        }, 10);
    }
}

// Navigate to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

// Navigate to previous slide
function previousSlide() {
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

// Update button states
function updateButtonStates() {
    // Disable previous button on first slide
    if (currentSlide === 1) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }

    // Disable next button on last slide
    if (currentSlide === totalSlides) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Handle keyboard navigation
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
        case 'Enter':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            showSlide(1);
            break;
        case 'End':
            e.preventDefault();
            showSlide(totalSlides);
            break;
        // Number keys to jump to specific slide
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                showSlide(slideNum);
            }
            break;
    }
}

// Progress indicator
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    progressBar.id = 'progress-bar';
    document.body.appendChild(progressBar);

    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progress = (currentSlide / totalSlides) * 100;
        progressBar.style.width = progress + '%';
    }
}

// Update progress bar when slide changes
function showSlideWithProgress(slideNumber) {
    showSlide(slideNumber);
    updateProgressBar();
}

// Override showSlide to include progress
const originalShowSlide = showSlide;
showSlide = function(slideNumber) {
    originalShowSlide(slideNumber);
    updateProgressBar();
};

// Fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add fullscreen button
function createFullscreenButton() {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        padding: 0.75rem 1rem;
        background: rgba(15, 23, 42, 0.95);
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    fullscreenBtn.title = 'Toggle Fullscreen (F11)';
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    fullscreenBtn.addEventListener('mouseenter', () => {
        fullscreenBtn.style.background = '#2563EB';
        fullscreenBtn.style.transform = 'scale(1.1)';
    });

    fullscreenBtn.addEventListener('mouseleave', () => {
        fullscreenBtn.style.background = 'rgba(15, 23, 42, 0.95)';
        fullscreenBtn.style.transform = 'scale(1)';
    });

    document.body.appendChild(fullscreenBtn);
}

// Presentation timer
let presentationStartTime = null;
let timerInterval = null;

function createPresentationTimer() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'presentation-timer';
    timerDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 2rem;
        padding: 0.75rem 1.5rem;
        background: rgba(15, 23, 42, 0.95);
        color: white;
        border-radius: 0.5rem;
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 1000;
        backdrop-filter: blur(10px);
        font-family: 'Courier New', monospace;
    `;
    timerDiv.textContent = '00:00';
    document.body.appendChild(timerDiv);

    startPresentationTimer();
}

function startPresentationTimer() {
    presentationStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - presentationStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timerDiv = document.getElementById('presentation-timer');
    if (timerDiv) {
        timerDiv.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Change color based on time (10 minutes = 600 seconds)
        if (elapsed > 540) { // > 9 minutes
            timerDiv.style.background = 'rgba(239, 68, 68, 0.95)'; // Red
        } else if (elapsed > 480) { // > 8 minutes
            timerDiv.style.background = 'rgba(245, 158, 11, 0.95)'; // Yellow
        }
    }
}

// Slide notes (presenter mode)
function createSlideNotes() {
    const notesData = {
        1: "환영 인사 및 프로젝트 소개 (30초)",
        2: "문제점 강조 - 기후변화와 시민 참여 부족 (1분)",
        3: "솔루션 개요 - 4가지 핵심 기능 설명 (1분 30초)",
        4: "기술 스택 및 시스템 아키텍처 (1분)",
        5: "안전 미션 작동 방식 상세 설명 (1분)",
        6: "에너지 효율 미션 및 개인화 프로세스 (1분)",
        7: "게이미피케이션 엔진 - 참여 동기 부여 (1분)",
        8: "실제 프로토타입 시연 및 체험 유도 (30초)",
        9: "시장 규모 및 목표 고객 (1분)",
        10: "3단계 로드맵 설명 (1분)",
        11: "정량적 기대효과 강조 (1분)",
        12: "ESG 경영 기여도 (1분)",
        13: "혁신성 및 차별성 (1분)",
        14: "확장 가능성 및 글로벌 전략 (1분)",
        15: "마무리 및 행동 촉구 (30초)"
    };

    const notesPanel = document.createElement('div');
    notesPanel.id = 'slide-notes';
    notesPanel.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        max-width: 600px;
        padding: 1rem 2rem;
        background: rgba(15, 23, 42, 0.95);
        color: white;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
        display: none;
    `;
    document.body.appendChild(notesPanel);

    // Toggle notes with 'N' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'n' || e.key === 'N') {
            const notes = document.getElementById('slide-notes');
            if (notes.style.display === 'none') {
                notes.style.display = 'block';
                notes.textContent = notesData[currentSlide] || '노트 없음';
            } else {
                notes.style.display = 'none';
            }
        }
    });
}

// Slide overview mode
function createSlideOverview() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'o' || e.key === 'O') {
            toggleOverviewMode();
        }
    });
}

function toggleOverviewMode() {
    const presentationContainer = document.querySelector('.presentation-container');

    if (!document.body.classList.contains('overview-mode')) {
        // Enter overview mode
        document.body.classList.add('overview-mode');
        presentationContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
        `;

        slides.forEach((slide, index) => {
            slide.style.display = 'block';
            slide.style.transform = 'scale(0.3)';
            slide.style.transformOrigin = 'top left';
            slide.style.cursor = 'pointer';
            slide.style.height = '600px';
            slide.style.overflow = 'hidden';

            slide.onclick = () => {
                toggleOverviewMode();
                showSlide(index + 1);
            };
        });

        document.querySelector('.nav-controls').style.display = 'none';
    } else {
        // Exit overview mode
        document.body.classList.remove('overview-mode');
        presentationContainer.style.cssText = '';

        slides.forEach(slide => {
            slide.style.display = '';
            slide.style.transform = '';
            slide.style.cursor = '';
            slide.style.height = '';
            slide.style.overflow = '';
            slide.onclick = null;
        });

        showSlide(currentSlide);
        document.querySelector('.nav-controls').style.display = 'flex';
    }
}

// Help overlay
function createHelpOverlay() {
    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'help-overlay';
    helpOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 2rem;
    `;

    helpOverlay.innerHTML = `
        <div style="max-width: 600px; background: rgba(15, 23, 42, 0.95); padding: 3rem; border-radius: 1rem;">
            <h2 style="margin-bottom: 2rem; font-size: 2rem;">키보드 단축키</h2>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; font-size: 1.1rem;">
                <div><strong>→ / Space / Enter</strong></div><div>다음 슬라이드</div>
                <div><strong>←</strong></div><div>이전 슬라이드</div>
                <div><strong>Home</strong></div><div>첫 슬라이드</div>
                <div><strong>End</strong></div><div>마지막 슬라이드</div>
                <div><strong>1-9</strong></div><div>특정 슬라이드로 이동</div>
                <div><strong>F11</strong></div><div>전체화면 토글</div>
                <div><strong>N</strong></div><div>발표 노트 표시</div>
                <div><strong>O</strong></div><div>슬라이드 개요 모드</div>
                <div><strong>?</strong></div><div>도움말 표시/숨김</div>
            </div>
            <p style="margin-top: 2rem; text-align: center; color: #94a3b8;">
                ESC 또는 ? 키를 눌러 닫기
            </p>
        </div>
    `;

    document.body.appendChild(helpOverlay);

    // Toggle help with '?' or 'ESC'
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || e.key === 'Escape') {
            const help = document.getElementById('help-overlay');
            help.style.display = help.style.display === 'none' ? 'flex' : 'none';
        }
    });

    // Click to close
    helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
            helpOverlay.style.display = 'none';
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    createProgressIndicator();
    createFullscreenButton();
    createPresentationTimer();
    createSlideNotes();
    createSlideOverview();
    createHelpOverlay();

    // Show help on first load (optional)
    setTimeout(() => {
        const help = document.getElementById('help-overlay');
        help.style.display = 'flex';
        setTimeout(() => {
            help.style.display = 'none';
        }, 3000);
    }, 500);
});

// Auto-save current slide position
window.addEventListener('beforeunload', () => {
    localStorage.setItem('presentation-current-slide', currentSlide);
});

// Restore slide position on load
window.addEventListener('load', () => {
    const savedSlide = localStorage.getItem('presentation-current-slide');
    if (savedSlide) {
        const slideNum = parseInt(savedSlide);
        if (slideNum >= 1 && slideNum <= totalSlides) {
            showSlide(slideNum);
        }
    }
});

// Export functions for external use
window.presentationAPI = {
    nextSlide,
    previousSlide,
    showSlide,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    toggleFullscreen,
    toggleOverviewMode
};
