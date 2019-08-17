/* global api */
class enfr_Collins {
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

    r    renderCSS() {
        let css = `
            <style>
            .link { color: #1b85e5; }
            .containerDesktop--2_5JC, .containerMobile--1sbY7 {
                line-height: 24px;
                font-family: -apple-system,system-ui,BlinkMacSystemFont,’Segoe UI’,Roboto,Ubuntu,’Helvetica Neue’,Arial,sans-serif;
            }
            .entry--3tNUi { margin-top: 3px; }
            .posContainer--2xs-U { margin-top: 3px; }
            .inline--CJsLA { display: inline; }
            .indent--FyTYr { margin-left: 5px; }
            .context--1vspK { color: #58b40b; }
            .order--1TgBO { font-weight: 700; }
            .neodictTranslation--C2TP2 {
                color: #1b85e5;
                text-decoration: none;
                font-weight: 700;
            }
            .dash--SIa20 {
                display: inline-block;
                border-top-color: #a6a6a6;
                border-top-style: solid;
                border-top-width: 1px;
                width: 13px;
                height: 4px;
                margin-left: 8px;
                margin-right: 10px;
            }
            .exampleDesktop--3n1hN {
                color: #7b7b7b;
                font-style: normal;
            }
            </style>`;

        return css;
    }
}
