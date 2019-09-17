/* global api */
class fren_Collins {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
        this.word = '';
    }

    async displayName() {
        let locale = await api.locale();
        if (locale.indexOf('CN') != -1) return '柯林斯西英词典';
        if (locale.indexOf('TW') != -1) return '柯林斯西英词典';
        return 'Collins ES->EN Dictionary';
    }

    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        return await this.findCollins(word);
    }

    async findCollins(word) {
        if (!word) return null;

        let base = 'https://www.collinsdictionary.com/dictionary/spanish-english/';
        let url = base + encodeURIComponent(word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return null;
        }

        let content = doc.querySelector('.content') || '';
        if (!content) return null;
        let css = this.renderCSS();
        return css + content.innerHTML;
    }

    renderCSS() {
   let css = `
            <style>
                span.band {color:#e52920;}
                span.pos  {text-transform:lowercase; font-size:0.9em; margin-right:5px; padding:2px 4px; color:white; background-color:#0d47a1; border-radius:3px;}
                span.tran {margin:0; padding:0;}
                span.eng_tran {margin-right:3px; padding:0;}
                span.chn_tran {color:#0d47a1;}
                ul.sents {font-size:0.8em; list-style:square inside; margin:3px 0;padding:5px;background:rgba(13,71,161,0.1); border-radius:5px;}
                li.sent  {margin:0; padding:0;}
                span.eng_sent {margin-right:5px;}
                span.chn_sent {color:#0d47a1;}
                .copyright{
                    display:none;
                }
                .orth {
                    font-size: 100%;
                    font-weight: bold;
                }
                .quote {
                    font-style: normal;
                    color: #1683be;
                }
                .colloc {
                    font-style: italic;
                    font-weight: normal;
                }
                .sense {
                    border: 1px solid;
                    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
                    border-radius: 3px;
                    padding: 5px;
                    margin-top: 3px;
                }
                .sense .re {
                    font-size: 100%;
                    margin-left: 0;
                }
                .sense .sense {
                    border: initial;
                    border-color: initial;
                    border-radius: initial;
                    padding: initial;
                    margin-top: initial;
                }
                a {
                    color: #000;
                    text-decoration: none;
                }
                * {
                    word-wrap: break-word;
                    box-sizing: border-box;
                }
            </style>`;
        return css;
    }
}
