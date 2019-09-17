/* global api */
class enen_Collins {
class fren_Collins {
    constructor(options) {
        this.options = options;
        this.maxexample = 2;
@@ -10,32 +10,21 @@ class enen_Collins {
        let locale = await api.locale();
        if (locale.indexOf('CN') != -1) return '柯林斯西英词典';
        if (locale.indexOf('TW') != -1) return '柯林斯西英词典';
        return 'Collins Spanish English Dictionary';
        return 'Collins ES->EN Dictionary';
    }


    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    async findTerm(word) {
        this.word = word;
        //let deflection = api.deinflect(word);
        let results = await Promise.all([this.findCollins(word)]);
        return [].concat(...results).filter(x => x);
        return await this.findCollins(word);
    }

    async findCollins(word) {
        let notes = [];
        if (!word) return notes; // return empty notes

        function T(node) {
            if (!node)
                return '';
            else
                return node.innerText.trim();
        }
        if (!word) return null;

        let base = 'https://www.collinsdictionary.com/dictionary/spanish-english/';
        let url = base + encodeURIComponent(word);
@@ -45,73 +34,61 @@ class enen_Collins {
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        } catch (err) {
            return [];
            return null;
        }

        let dictionary = doc.querySelector('.dictionary.Cob_Adv_Brit');
        if (!dictionary) return notes; // return empty notes

        let expression = T(dictionary.querySelector('.h2_entry'));
        let reading = T(dictionary.querySelector('.pron'));

        let band = dictionary.querySelector('.word-frequency-img');
        let bandnum = band ? band.dataset.band : '';
        let extrainfo = bandnum ? `<span class="band">${'\u25CF'.repeat(Number(bandnum))}</span>` : '';

        let sound = dictionary.querySelector('a.hwd_sound');
        let audios = sound ? [sound.dataset.srcMp3] : [];
        // make definition segement
        let definitions = [];
        let defblocks = dictionary.querySelectorAll('.hom') || [];
        for (const defblock of defblocks) {
            let pos = T(defblock.querySelector('.pos'));
            pos = pos ? `<span class="pos">${pos}</span>` : '';
            let eng_tran = T(defblock.querySelector('.sense .def'));
            if (!eng_tran) continue;
            let definition = '';
            eng_tran = eng_tran.replace(RegExp(expression, 'gi'), '<b>$&</b>');
            eng_tran = `<span class='eng_tran'>${eng_tran}</span>`;
            let tran = `<span class='tran'>${eng_tran}</span>`;
            definition += `${pos}${tran}`;

            // make exmaple segement
            let examps = defblock.querySelectorAll('.sense .cit.type-example') || '';
            if (examps.length > 0 && this.maxexample > 0) {
                definition += '<ul class="sents">';
                for (const [index, examp] of examps.entries()) {
                    if (index > this.maxexample - 1) break; // to control only 2 example sentence.
                    let eng_examp = T(examp) ? T(examp).replace(RegExp(expression, 'gi'), '<b>$&</b>') : '';
                    definition += eng_examp ? `<li class='sent'><span class='eng_sent'>${eng_examp}</span></li>` : '';
                }
                definition += '</ul>';
            }
            definition && definitions.push(definition);
        }
        let content = doc.querySelector('.content') || '';
        if (!content) return null;
        let css = this.renderCSS();
        notes.push({
            css,
            expression,
            reading,
            extrainfo,
            definitions,
            audios,
        });
        return notes;
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
