gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("laptopCanvas");
const context = canvas.getContext("2d");

const frameCount = 25;
const images = [];
let currentFrame = index => `images/laptopAnim/${String(index).padStart(3, '0')}.png`;

function setCanvasSize() {
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  const size = Math.min(containerWidth, containerHeight);
  
  canvas.style.width = "1500px";
  canvas.style.height = "1500px";
  
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;
  
  context.scale(pixelRatio, pixelRatio);
  
  canvas.style.position = 'absolute';
  canvas.style.top = '75%';
  canvas.style.left = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';
}

setCanvasSize();

const img = new Image();
img.src = currentFrame(0);
img.onload = () => {
  const displaySize = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
  context.clearRect(0, 0, displaySize, displaySize);
  context.drawImage(img, 0, 0, displaySize, displaySize);
};

for (let i = 0; i < frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

const render = index => {
  const image = images[index];
  if (!image) return;
  
  const displaySize = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
  context.clearRect(0, 0, displaySize, displaySize);
  context.drawImage(image, 0, 0, displaySize, displaySize);
};

let animationStarted = false;
let animationComplete = false;

const laptopAnimation = gsap.to({ frame: 0 }, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  paused: true,
  scrollTrigger: {
    trigger: "#home",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      if (self.progress === 0 && !animationStarted) {
        animationStarted = true;
      }
      
      const titleOpacity = Math.max(0, 1 - self.progress * 2); // Fade out faster
      gsap.set("#main-content", { opacity: titleOpacity });
      
      if (self.progress > 0 && self.progress < 0.95) {
        showScrollMessage();
      } else {
        hideScrollMessage();
      }
      
      if (self.progress > 0.95) {
        animationComplete = true;
        hideScrollMessage();
      }
    },
    onComplete: () => {
      animationComplete = true;
    }
  },
  onUpdate: function () {
    render(Math.round(this.targets()[0].frame));
  }
});

ScrollTrigger.create({
  trigger: "#home",
  start: "top top",
  end: "bottom top",
  onUpdate: (self) => {
    if (self.progress > 0.95 && !animationComplete) {
      window.scrollTo(0, self.start + (self.end - self.start) * 0.95);
    }
  }
});

let scrollMessage = null;

function showScrollMessage() {
  if (!scrollMessage) {
    scrollMessage = document.createElement('div');
    scrollMessage.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        right: 30px;
        transform: translateY(-50%);
        z-index: 100;
        color: white;
        text-align: center;
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.5s ease-out;
        max-width: 200px;
      ">
        <div style="font-size: 14px; margin-bottom: 8px;">Keep scrolling to open laptop</div>
        <i class="fas fa-mouse" style="font-size: 20px; opacity: 0.6;"></i>
      </div>
    `;
    document.body.appendChild(scrollMessage);
  }
}

function hideScrollMessage() {
  if (scrollMessage) {
    scrollMessage.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => {
      if (scrollMessage && scrollMessage.parentNode) {
        scrollMessage.remove();
        scrollMessage = null;
      }
    }, 500);
  }
}

let isScrollingLocked = false;

ScrollTrigger.create({
  trigger: "#home",
  start: "top top",
  end: "bottom top",
  onEnter: () => {
    isScrollingLocked = true;
  },
  onLeave: () => {
    if (animationComplete) {
      isScrollingLocked = false;
    }
  },
  onEnterBack: () => {
    isScrollingLocked = true;
  },
  onLeaveBack: () => {
    isScrollingLocked = false;
  }
});

window.addEventListener('resize', () => {
  setCanvasSize();
  
  const currentFrameIndex = Math.round(laptopAnimation.progress() * (frameCount - 1));
  render(currentFrameIndex);
  
  ScrollTrigger.refresh();
});

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-50%) translateX(20px); }
    to { opacity: 1; transform: translateY(-50%) translateX(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
