const Input = {
  keys: {},
  keysPressed: {},
  mouseX: 0,
  mouseY: 0,
  mouseDown: false,
  mouseClicked: false,

  init() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed[e.code] = true;
      }
      this.keys[e.code] = true;
      
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    const canvas = document.getElementById('game-canvas');
    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (!this.mouseDown) {
        this.mouseClicked = true;
      }
      this.mouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  },

  isKeyDown(code) {
    return this.keys[code] || false;
  },

  isKeyPressed(code) {
    return this.keysPressed[code] || false;
  },

  wasClicked() {
    return this.mouseClicked;
  },

  update() {
    this.keysPressed = {};
    this.mouseClicked = false;
  },

  getDirection() {
    let dx = 0, dy = 0;
    if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) dx = -1;
    if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) dx = 1;
    if (this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW')) dy = -1;
    if (this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS')) dy = 1;
    return { dx, dy };
  },

  isJumpPressed() {
    return this.isKeyPressed('Space') || this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW');
  },

  isAttackPressed() {
    return this.isKeyPressed('KeyJ') || this.isKeyPressed('KeyZ');
  },

  getSkillKey() {
    if (this.isKeyPressed('KeyU') || this.isKeyPressed('KeyX')) return 0;
    if (this.isKeyPressed('KeyI') || this.isKeyPressed('KeyC')) return 1;
    if (this.isKeyPressed('KeyO') || this.isKeyPressed('KeyV')) return 2;
    if (this.isKeyPressed('KeyP') || this.isKeyPressed('KeyB')) return 3;
    return -1;
  },

  isInteractPressed() {
    return this.isKeyPressed('KeyE') || this.isKeyPressed('KeyF');
  },

  isInventoryPressed() {
    return this.isKeyPressed('KeyI') || this.isKeyPressed('Tab');
  },

  isEscapePressed() {
    return this.isKeyPressed('Escape');
  }
};
