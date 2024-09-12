//水印

class WaterMark {
  constructor(opts = {}) {
    this.ob = null;
    this.dom = null;
    this.set(opts);
  }

  set(opts = {}) {
    this.text = opts.text || '请添加水\n印文字';
    this.fontSize = opts.fontSize || 18;
    this.gap = opts.gap || 2.9;
    this.color = opts.color || 'rgba(210,210,210,0.5)';
    this.destroy();
    return this;
  }

  init() {
    const params = this.getMarkImage();
    this.addMark(params);
    this.ob = new MutationObserver((records) => {
      for (const record of records) {
        for (const dom of record.removedNodes) {
          if (dom === this.dom) {
            console.log(dom, dom === this.dom)
            return this.addMark(params);
          }
        }
        if (record.target === this.dom) {
          this.removeDom();
          return this.addMark(params);
        }
      }
    });
    // 包括子节点的变化、属性的变化以及子树的变化
    this.ob.observe(document, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ['class', 'style']
    });
  }

  getMarkImage() {
    const canvas = document.createElement("canvas");
    const devicePixelRatio = window.devicePixelRatio || 1;
    const fontSize = this.fontSize * devicePixelRatio;
    const font = fontSize + "px serif";
    const ctx = canvas.getContext("2d");
    ctx.font = font;
    const texts = this.text.split('\n');
    const widths = texts.map(t => ctx.measureText(t)?.width || 0);
    const canvasSize = Math.max(60, ...widths) * this.gap + devicePixelRatio;
    console.log('canvasSize', widths, canvasSize)
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Math.PI / 180) * -45);
    ctx.fillStyle = this.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = font;

    const lh = (fontSize * texts.length + (texts.length - 1) * 10) / 2;
    texts.forEach((t, i) => ctx.fillText(t, 0, lh * (texts.length / -2 + i)));

    return {
      base64: canvas.toDataURL(),
      size: canvasSize,
      styleSize: canvasSize / devicePixelRatio
    };
  }

  addMark(params) {
    this.dom = document.createElement('div');
    this.dom.style.position = `absolute`;
    this.dom.style.left = `0`;
    this.dom.style.right = `0`;
    this.dom.style.bottom = `0`;
    this.dom.style.top = `0`;
    this.dom.style.backgroundImage = `url(${params.base64})`;
    this.dom.style.backgroundSize = `${params.styleSize}px ${params.styleSize}px`;
    this.dom.style.backgroundRepeat = "repeat";
    this.dom.style.zIndex = '99999';
    this.dom.style.pointerEvents = "none";
    document.body.appendChild(this.dom);
  }

  removeDom() {
    if (this.dom) {
      document.body.removeChild(this.dom);
      // this.dom.remove();
      this.dom = null;
    }
  }

  destroy() {
    if (this.ob) {
      this.ob.disconnect();
      this.ob = null;
    }
    this.removeDom();
  }
}

export default WaterMark;
