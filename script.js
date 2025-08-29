const { createApp } = Vue;

createApp({
    data() {
        return {
            inputText: '',
            outputText: '',
            loadingAction: null, // 'encode' or 'decode'
            theme: localStorage.getItem('theme') || 'dark'
        };
    },
    methods: {
        encodeText() {
            this.loadingAction = 'encode';
            setTimeout(() => {
                this.outputText = encodeURIComponent(this.inputText);
                this.loadingAction = null;
            }, 300);
        },
        decodeText() {
            this.loadingAction = 'decode';
            setTimeout(() => {
                try {
                    this.outputText = decodeURIComponent(this.inputText);
                } catch {
                    this.outputText = 'Invalid encoded URL';
                }
                this.loadingAction = null;
            }, 300);
        },
        copyToClipboard() {
            if (this.outputText.trim() !== '') {
                navigator.clipboard.writeText(this.outputText)
                    .then(() => {
                        console.log('Copied to clipboard');

                        // Try to find the element
                        const outputBox = document.getElementById('output');
                        if (outputBox) {
                            outputBox.classList.add('blink');
                            setTimeout(() => outputBox.classList.remove('blink'), 1800); // 0.6s × 3
                        } else {
                            console.warn('Output element not found. Check the ID.');
                        }
                    })
                    .catch(err => console.error('Copy failed', err));
            }
        },
        clearAll() {
            this.inputText = '';
            this.outputText = '';
        },
        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', this.theme);
            document.body.className = this.theme;
        }
    },
    mounted() {
        document.body.className = this.theme;
    }
}).mount('#app');
