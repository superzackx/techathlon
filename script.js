gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("laptopCanvas");
const context = canvas.getContext("2d");

canvas.width = 4880;
canvas.height = 4880;

const frameCount = 25;
const images = [];
let currentFrame = index => `images/laptopAnim/${String(index).padStart(3, '0')}.png`;

const img = new Image();
img.src = currentFrame(0);
img.onload = () => context.drawImage(img, 0, 0, canvas.width, canvas.height);

for (let i = 0; i < frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

const render = index => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
};

gsap.to({ frame: 0 }, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: true,
    pin: ".scroll-animation-container",
    end: "+=100%",
  },
  onUpdate: function () {
    render(this.targets()[0].frame);
  }
});
