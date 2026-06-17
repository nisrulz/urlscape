const { createApp } = Vue;

createApp({
  data() {
    return {
      inputText: '',
      outputText: '',
      theme: localStorage.getItem('theme') || 'dark',
      _updating: false
    };
  },
  computed: {
    inputChars() { return this.inputText.length; },
    inputBytes() { return new Blob([this.inputText]).size; },
    outputChars() { return this.outputText.length; },
    outputBytes() { return new Blob([this.outputText]).size; },
    isValidUrl() {
      if (!this.inputText) return null;
      try { new URL(this.inputText); return true; } catch { return false; }
    }
  },
  watch: {
    inputText(val) { this._sync('output', val); },
    outputText(val) { this._sync('input', val); }
  },
  methods: {
    _sync(target, val) {
      if (this._updating) return;
      this._updating = true;
      const key = target + 'Text';
      if (!val) { this[key] = ''; }
      else if (/%(?:[0-9A-Fa-f]{2})+/.test(val)) {
        try { this[key] = decodeURIComponent(val); } catch { this[key] = encodeURIComponent(val); }
      } else {
        this[key] = encodeURIComponent(val);
      }
      this._updating = false;
    },
    _flash(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('blink');
      setTimeout(() => el.classList.remove('blink'), 1800);
    },
    encodeText() {
      this._updating = true;
      this.outputText = encodeURIComponent(this.inputText);
      this._updating = false;
    },
    decodeText() {
      this._updating = true;
      try { this.outputText = decodeURIComponent(this.inputText); }
      catch { this.outputText = 'Invalid encoded URL'; }
      this._updating = false;
    },
    copyInput() {
      if (!this.inputText) return;
      navigator.clipboard.writeText(this.inputText)
        .then(() => this._flash('input'))
        .catch(err => console.error('Copy failed', err));
    },
    copyOutput() {
      if (!this.outputText) return;
      navigator.clipboard.writeText(this.outputText)
        .then(() => this._flash('output'))
        .catch(err => console.error('Copy failed', err));
    },
    clearInput() { this.inputText = ''; },
    clearOutput() { this.outputText = ''; },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      document.body.className = this.theme;
    }
  },
  mounted() {
    document.body.className = this.theme;
    window.addEventListener('keydown', (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'e') { e.preventDefault(); this.encodeText(); }
      if (mod && e.key === 'd') { e.preventDefault(); this.decodeText(); }
      if (mod && e.shiftKey && e.key === 'C') { e.preventDefault(); this.copyOutput(); }
    });
  }
}).mount('#app');
