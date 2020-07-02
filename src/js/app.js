/**
 * @copyright 2020 Timur Atalay 
 * @homepage https://github.com/bornova/numpad
 * @license MIT https://github.com/bornova/numpad/blob/master/LICENSE
 */

// Get element by id
const $ = (id) => document.getElementById(id);

// Codemirror
CodeMirror.defineMode("numpad", () => {
    return {
        token: (stream, state) => {
            if (stream.match(/\/\/.*/) || stream.match(/#.*/)) return "comment";
            if (stream.match(/\d/)) return "number";
            if (stream.match(/(?:\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%)/)) return 'operator';

            stream.eatWhile(/\w/);
            try {
                if (math.unit(stream.current()).units.length > 0) return "unit";
            } catch (e) {}
            try {
                if (Object.getOwnPropertyNames(math[stream.current()]).includes('signatures')) return "function";
            } catch (e) {}
            if (stream.current().match(/\b(?:ans|total|subtotal|avg|today|now|line\d+)\b/)) return "scope";
            stream.next();
            return "text";
        }
    };
});

CodeMirror.defineMode("plain", () => {
    return {
        token: (stream, state) => {
            stream.next();
            return "text";
        }
    };
});

var cm = CodeMirror.fromTextArea($('input'));

(() => {
    // localStorage
    const ls = {
        get: (key) => JSON.parse(localStorage.getItem(key)),
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
    };

    // User agent
    var isWin = navigator.userAgent.toLowerCase().includes('win');
    var isNode = navigator.userAgent.toLowerCase().includes('electron');

    var ipc = isNode ? require('electron').ipcRenderer : null;
    var appName = isNode ? ipc.sendSync('getName') : 'Numpad';
    var appVersion = isNode ? ipc.sendSync('getVersion') : ' - Web';

    // Set app info
    document.title = appName;
    $('dialog-about-title').innerHTML = appName + ' Calculator';
    $('dialog-about-appVersion').innerHTML = 'Version ' + appVersion;

    // Set headers
    if (isNode && isWin) {
        $('header-mac').remove();
        $('header-win').style.display = 'block';
        $('header-win-title').innerHTML = appName;

        if (ipc.sendSync('isNormal')) $('unmax').style.display = 'none';
        if (ipc.sendSync('isMaximized')) $('max').style.display = 'none';
        ipc.on('fullscreen', (event, isFullscreen) => {
            if (isFullscreen) $('max').click();
        });

        $('winButtons').addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'min':
                    ipc.send('minimize');
                    break;
                case 'max':
                    ipc.send('maximize');
                    $('unmax').style.display = 'block';
                    $('max').style.display = 'none';
                    break;
                case 'unmax':
                    ipc.send('unmaximize');
                    $('unmax').style.display = 'none';
                    $('max').style.display = 'block';
                    break;
                case 'close':
                    ipc.send('close');
                    break;
            }
            e.stopPropagation();
        });
    } else {
        $('header-win').remove();
        $('header-mac').style.display = 'block';
        $('header-mac-title').innerHTML = appName;
    }

    document.getElementsByClassName('CodeMirror-scroll')[0].setAttribute('name', 'sync');

    // Load last calculations
    cm.setValue(ls.get('input') || '');

    // App settings
    const defaultSettings = {
        bigNumber: false,
        currencies: true,
        dateFormat: 'l',
        fontSize: '1.1rem',
        fontWeight: '400',
        inputWidth: 50,
        lineErrors: true,
        lineNumbers: true,
        lineWrap: true,
        plotClosed: false,
        plotGridLines: false,
        plotTipLines: false,
        precision: '4',
        resizable: true,
        syntax: true,
        thouSep: true
    };
    Object.freeze(defaultSettings);

    // Initiate app settings and theme
    if (!ls.get('settings')) ls.set('settings', defaultSettings);

    // Check settings for property changes
    var settings;
    var initSettings = ls.get('settings');
    var newSettings = {};
    Object.entries(defaultSettings).map(([p, v]) => {
        newSettings[p] = p in initSettings ? initSettings[p] : defaultSettings[p];
        ls.set('settings', newSettings);
    });

    function applyTheme() {
        var theme = ls.get('theme') || 'light';
        $('style').setAttribute('href', theme == 'light' ? 'light.css' : 'dark.css');
        $('themeIcon').setAttribute('data-feather', theme == 'light' ? 'moon' : 'sun');
        feather.replace();
        UIkit.tooltip('#themeButton', {
            title: theme == 'light' ? 'Dark Mode' : 'Light Mode'
        });
        if (isNode) ipc.send('darkMode', theme == 'dark');
    }

    function applySettings() {
        settings = ls.get('settings');

        var elements = document.getElementsByClassName('panelFont');
        for (var el of elements) {
            el.style.fontSize = settings.fontSize;
            el.style.fontWeight = settings.fontWeight;
        }

        math.config({
            number: settings.bigNumber ? 'BigNumber' : 'number'
        });

        $('lineNo').style.display = settings.lineNumbers ? 'block' : 'none';
        $('inputPane').style.width = (settings.resizable ? settings.inputWidth : defaultSettings.inputWidth) + '%';
        $('inputPane').style.marginLeft = settings.lineNumbers ? '0px' : '18px';
        $('output').style.textAlign = settings.resizable ? 'left' : 'right';
        $('handle').style.display = settings.resizable ? 'block' : 'none';

        cm.setOption('mode', settings.syntax ? 'numpad' : 'plain');
        cm.setOption('lineWrapping', settings.lineWrap);
        cm.refresh();
        calculate();
    }

    // Apply theme and settings
    applyTheme();
    applySettings();

    // Prep input
    cm.focus();
    cm.setCursor(cm.lineCount(), 0);
    cm.on('change', calculate);

    // Panel resizer
    var resizeDelay;
    var isResizing = false;
    var handle = document.querySelector('.handle');
    var panel = handle.closest('.panel');
    var resize = panel.querySelector('.resize');

    $('handle').addEventListener('mousedown', (e) => isResizing = e.target == handle);
    $('panel').addEventListener('mouseup', (e) => isResizing = false);
    $('panel').addEventListener('mousemove', (e) => {
        var offset = $('lineNo').style.display == 'block' ? 44 : 20;
        var pointerRelativeXpos = e.clientX - panel.offsetLeft - offset;
        var iWidth = pointerRelativeXpos / panel.clientWidth * 100;
        var inputWidth = iWidth < 0 ? 0 : iWidth > 100 ? 100 : iWidth;
        if (isResizing) {
            resize.style.width = inputWidth + '%';
            settings.inputWidth = inputWidth;
            ls.set('settings', settings);
            clearTimeout(resizeDelay);
            resizeDelay = setTimeout(() => {
                calculate();
                cm.refresh();
            }, 10);
        }
    });

    // Exchange rates
    if (settings.currencies) {
        math.createUnit('USD', {
            aliases: ['usd']
        });
        getRates();
    }

    function getRates() {
        var url = 'https://www.floatrates.com/widget/1030/cfc5515dfc13ada8d7b0e50b8143d55f/usd.json';
        if (navigator.onLine) {
            fetch(url)
                .then(rates => rates.json())
                .then(data => {
                    ls.set('rates', data);
                    createRateUnits();
                    $('lastUpdated').innerHTML = ls.get('rateDate');
                    showMsg('Updated exchange rates');
                }).catch((e) => showMsg('Failed to get exchange rates'));
        } else {
            showMsg('No internet connection.');
        }
    }

    function createRateUnits() {
        var data = ls.get('rates');
        var dups = ['cup'];
        Object.keys(data).map(currency => {
            math.createUnit(data[currency].code, {
                definition: math.unit(data[currency].inverseRate + 'USD'),
                aliases: [dups.includes(data[currency].code.toLowerCase()) ? '' : data[currency].code.toLowerCase()]
            }, {
                override: true
            });
            ls.set('rateDate', data[currency].date);
        });
        calculate();
    }

    // Show modal dialog
    function showModal(id) {
        UIkit.modal(id, {
            bgClose: false,
            stack: true
        }).show();
    }

    // Update open button count
    var savedCount = () => Object.keys(ls.get('saved') || {}).length;
    var updateSavedCount = () => UIkit.tooltip('#openButton', {
        title: 'Open (' + savedCount() + ')'
    });
    updateSavedCount();
    $('openButton').className = savedCount() > 0 ? 'action' : 'noAction';

    // App button actions
    $('actions').addEventListener('click', (e) => {
        switch (e.target.id) {
            case 'clearButton': // Clear board
                if (cm.getValue() != '') {
                    ls.set('undoData', cm.getValue());
                    cm.setValue('');
                    cm.focus();
                    calculate();
                    showMsg('Board cleared');
                    $('undoButton').style.visibility = 'visible';
                }
                break;
            case 'printButton': // Print calculations
                UIkit.tooltip('#printButton').hide();
                if (cm.getValue() != '') {
                    $('printLines').style.display = settings.lineNumbers ? 'block' : 'none';
                    $('printInput').style.width = settings.resizable ? settings.inputWidth : '50%';
                    $('printInput').style.marginLeft = settings.lineNumbers ? '0px' : '18px';
                    $('printInput').style.borderRightWidth = settings.resizable ? '1px' : '0';
                    $('printOutput').style.textAlign = settings.resizable ? 'left' : 'right';

                    $('print-title').innerHTML = appName;
                    $('printLines').innerHTML = $('lineNo').innerHTML;
                    $('printInput').innerHTML = cm.getValue();
                    $('printOutput').innerHTML = $('output').innerHTML;
                    if (isNode) {
                        ipc.send('print');
                        ipc.once('printReply', (event, response) => showMsg(response));
                    } else {
                        window.print();
                    }
                }
                break;
            case 'saveButton': // Save calcualtions
                if (cm.getValue() != '') {
                    $('saveTitle').value = '';
                    showModal('#dialog-save');
                    $('saveTitle').focus();
                }
                break;
            case 'openButton': // Open saved calculations
                if (Object.keys(ls.get('saved') || {}).length > 0) showModal('#dialog-open');
                break;
            case 'undoButton': // Undo action
                cm.setValue(ls.get('undoData'));
                $('undoButton').style.visibility = 'hidden';
                calculate();
                break;
            case 'themeButton': // Open settings dialog
                var theme = ls.get('theme');
                theme = theme == 'light' ? 'dark' : 'light';
                ls.set('theme', theme);
                applyTheme();
                break;
            case 'settingsButton': // Open settings dialog
                showModal('#dialog-settings');
                break;
            case 'helpButton': // Open help dialog
                showModal('#dialog-help');
                $('searchBox').focus();
                break;
            case 'aboutButton': // Open app info dialog
                showModal('#dialog-about');
                break;
        }
        e.stopPropagation();
    });

    // Output actions
    $('output').addEventListener('click', (e) => {
        switch (e.target.className) {
            case 'plotButton': // Plot function
                func = e.target.getAttribute('data-func');
                try {
                    $('plotGridLines').checked = settings.plotGridLines;
                    $('plotTipLines').checked = settings.plotTipLines;
                    $('plotClosed').checked = settings.plotClosed;
                    plot();
                    showModal('#dialog-plot');
                } catch (error) {
                    showError(error);
                }
                break;
            case 'lineError': // Show line error
                var num = e.target.getAttribute('data-line');
                var err = e.target.getAttribute('data-error');
                showError(err, 'Error on Line ' + num);
                break;
        }
        e.stopPropagation();
    });

    // Dialog button actions
    document.addEventListener('click', (e) => {
        switch (e.target.id) {
            case 'dialog-save-save': // Save calculation
                var obj = ls.get('saved') || {};
                var id = moment().format('x');
                var title = $('saveTitle').value.replace(/<|>/g, '').trim() || 'No title';
                var data = cm.getValue();

                obj[id] = [title, data];
                ls.set('saved', obj);
                UIkit.modal('#dialog-save').hide();
                $('openButton').className = 'action';
                updateSavedCount();
                showMsg('Saved');
                break;
            case 'dialog-open-deleteAll': // Delete all saved calculations
                confirm('All saved calculations will be deleted.', () => {
                    localStorage.removeItem('saved');
                    populateSaved();
                    UIkit.modal('#dialog-open').hide();
                    showMsg('Deleted all saved calculations');
                });
                break;
            case 'defaultSettingsButton': // Revert back to default settings
                confirm('All settings will revert back to defaults.', () => {
                    ls.set('settings', defaultSettings);
                    applySettings();
                    if (!$('currencyButton').checked) getRates();
                    UIkit.modal('#dialog-settings').hide();
                    showMsg('Default settings applied');
                });
                break;
            case 'dialog-settings-reset': // Reset app
                confirm('All user settings and data will be lost.', () => {
                    if (isNode) {
                        ipc.send('resetApp');
                    } else {
                        localStorage.clear();
                        location.reload();
                    }
                });
                break;
            case 'bigNumWarn':
                showError('Using the BigNumber option will disable Plot functionality.<br><br><a target="_blank" href="https://mathjs.org/docs/datatypes/bignumbers.html">More information on BigNumbers</a>', 'BigNumber Limitations');
                break;
            case 'sizeReset': // Reset panel size
                settings.inputWidth = defaultSettings.inputWidth;
                $('sizeReset').style.display = 'none';
                ls.set('settings', settings);
                applySettings();
                $('defaultSettingsButton').style.display = JSON.stringify(settings) == JSON.stringify(defaultSettings) ? 'none' : 'block';
                break;
            case 'currencyButton': // Enable currency rates
                if (settings.currencies) {
                    $('currencyUpdate').style.display = settings.currencies ? $('currencyButton').checked ? "block" : "none" : null;
                }
                break;
            case 'resizeButton': // Enable currency rates
                $('sizeReset').style.visibility = $('resizeButton').checked ? "visible" : "hidden";
                break;
            case 'dialog-settings-save': // Save settings
                settings.syntax = $('syntaxButton').checked;
                settings.fontSize = $('fontSize').value;
                settings.fontWeight = $('fontWeight').value;
                settings.lineNumbers = $('lineNoButton').checked;
                settings.lineWrap = $('lineWrapButton').checked;
                settings.lineErrors = $('lineErrorButton').checked;
                settings.resizable = $('resizeButton').checked;
                settings.precision = $('precisionRange').value;
                settings.bigNumber = $('bigNumberButton').checked;
                settings.dateFormat = $('dateFormat').value;
                settings.thouSep = $('thouSepButton').checked;

                if (!settings.currencies && $('currencyButton').checked) {
                    getRates();
                } else if (!$('currencyButton').checked) {
                    localStorage.removeItem('rates');
                    localStorage.removeItem('rateDate');
                }
                settings.currencies = $('currencyButton').checked;

                ls.set('settings', settings);
                applySettings();

                UIkit.modal('#dialog-settings').hide();
                showMsg('Settings saved');
                break;

                // Plot settings
            case 'plotGridLines':
                settings.plotGridLines = $('plotGridLines').checked;
                ls.set('settings', settings);
                plot();
                break;
            case 'plotTipLines':
                settings.plotTipLines = $('plotTipLines').checked;
                ls.set('settings', settings);
                plot();
                break;
            case 'plotClosed':
                settings.plotClosed = $('plotClosed').checked;
                ls.set('settings', settings);
                plot();
                break;

                // Load demo
            case 'demoButton':
                ls.set('undoData', cm.getValue());
                cm.setValue(demo);
                calculate();
                $('undoButton').style.visibility = 'visible';
                UIkit.modal('#dialog-help').hide();
                break;
        }
    });

    // Open saved calculations dialog actions
    $('dialog-open').addEventListener('click', (e) => {
        var pid;
        var saved = ls.get('saved');
        if (e.target.parentNode.getAttribute('data-action') == 'load') {
            pid = e.target.parentNode.parentNode.id;
            ls.set('undoData', cm.getValue());
            cm.setValue(saved[pid][1]);
            calculate();
            $('undoButton').style.visibility = 'visible';
            UIkit.modal('#dialog-open').hide();
        }
        if (e.target.getAttribute('data-action') == 'delete') {
            pid = e.target.parentNode.id;
            confirm('Calculation "' + saved[pid][0] + '" will be deleted.', () => {
                delete saved[pid];
                ls.set('saved', saved);
                populateSaved();
            });
        }
    });

    // Populate saved calculation
    UIkit.util.on('#dialog-open', 'beforeshow', () => populateSaved());

    function populateSaved() {
        var obj = ls.get('saved') || {};
        var savedItems = Object.entries(obj);
        $('dialog-open-body').innerHTML = '';
        if (savedItems.length > 0) {
            $('dialog-open-deleteAll').disabled = false;
            savedItems.map(([id, val]) => {
                $('dialog-open-body').innerHTML += `
                    <div class="dialog-open-wrapper" id="${id}">
                        <div data-action="load">
                            <div class="dialog-open-title">${val[0]}</div>
                            <div class="dialog-open-date">${moment(Number(id)).format('lll')}</div>
                        </div>
                        <div class="dialog-open-delete" data-action="delete">&#10005;</div>
                    </div>
                    `;
            });
        } else {
            $('dialog-open-deleteAll').disabled = true;
            $('dialog-open-body').innerHTML = 'No saved calculations.';
            $('openButton').className = 'noAction';
        }
        updateSavedCount();
    }

    // Initiate settings dialog
    UIkit.util.on('#setswitch', 'beforeshow', (e) => e.stopPropagation());
    UIkit.util.on('#dialog-settings', 'beforeshow', () => {
        $('syntaxButton').checked = settings.syntax;
        $('fontSize').value = settings.fontSize;
        $('fontWeight').value = settings.fontWeight;
        $('lineNoButton').checked = settings.lineNumbers;
        $('lineWrapButton').checked = settings.lineWrap;
        $('lineErrorButton').checked = settings.lineErrors;
        $('resizeButton').checked = settings.resizable;
        $('sizeReset').style.display = settings.inputWidth == defaultSettings.inputWidth ? 'none' : 'inline-block';
        $('sizeReset').style.visibility = settings.resizable ? 'visible' : 'hidden';
        $('precisionRange').value = settings.precision;
        $('precision-label').innerHTML = settings.precision;
        $('bigNumberButton').checked = settings.bigNumber;
        $('dateFormat').innerHTML = `
            <option value="l">${moment().format('l')}</option>
            <option value="L">${moment().format('L')}</option>
            <option value="MMM DD, YYYY">${moment().format('MMM DD, YYYY')}</option>
            <option value="ddd, l">${moment().format('ddd, l')}</option>
            <option value="ddd, L">${moment().format('ddd, L')}</option>
            <option value="ddd, MMM DD, YYYY">${moment().format('ddd, MMM DD, YYYY')}</option>
            `;
        $('dateFormat').value = settings.dateFormat;
        $('thouSepButton').checked = settings.thouSep;
        $('currencyButton').checked = settings.currencies;
        $('lastUpdated').innerHTML = settings.currencies ? ls.get('rateDate') : '';
        $('currencyUpdate').style.display = settings.currencies ? "block" : "none";
        $('defaultSettingsButton').style.display = JSON.stringify(settings) == JSON.stringify(defaultSettings) ? 'none' : 'block';
    });

    $('precisionRange').addEventListener('input', () => $('precision-label').innerHTML = $('precisionRange').value);

    // Help dialog content
    $('searchBox').addEventListener('input', (e) => {
        var str = $('searchBox').value.trim();
        if (str) {
            try {
                $('searchResults').innerHTML = '';
                var res = JSON.stringify(math.help(str).toJSON());
                var obj = JSON.parse(res);
                $('searchResults').innerHTML = `
                    <div>Name:</div><div>${obj.name}</div>
                    <div>Description:</div><div>${obj.description}</div>
                    <div>Category:</div><div>${obj.category}</div>
                    <div>Syntax:</div><div>${String(obj.syntax).split(',').join(', ')}</div>
                    <div>Examples:</div><div>${String(obj.examples).split(',').join(', ')}</div>
                    <div>Also see:</div><div>${String(obj.seealso).split(',').join(', ')}</div>
                    `;
            } catch (error) {
                $('searchResults').innerHTML = `No results for "${str}"`;
            }
        } else {
            $('searchResults').innerHTML = 'Start typing above to search...';
        }
    });

    // Plot
    var func;
    var activePlot;
    var functionPlot = window.functionPlot;

    function plot() {
        $('plotTitle').innerHTML = func;

        var f = func.split('=')[1];
        var domain = math.abs(math.evaluate(f, {
            x: 0
        })) * 2;

        if (domain == Infinity || domain == 0) domain = 10;

        var xDomain = activePlot ? activePlot.meta.xScale.domain() : [-domain, domain];
        var yDomain = activePlot ? activePlot.meta.yScale.domain() : [-domain, domain];

        activePlot = functionPlot({
            target: '#plot',
            height: window.innerHeight - 175,
            width: window.innerWidth - 55,
            xAxis: {
                domain: xDomain
            },
            yAxis: {
                domain: yDomain
            },
            tip: {
                xLine: settings.plotTipLines,
                yLine: settings.plotTipLines,
            },
            grid: settings.plotGridLines,
            data: [{
                fn: f,
                graphType: 'polyline',
                closed: settings.plotClosed
            }],
            plugins: [functionPlot.plugins.zoomBox()]
        });
    }

    UIkit.util.on('#dialog-plot', 'hide', () => activePlot = false);

    // Relayout plot on window resize
    var windowResizeDelay;
    window.addEventListener('resize', () => {
        if (activePlot && document.querySelector('#dialog-plot').classList.contains('uk-open')) plot();
        clearTimeout(windowResizeDelay);
        windowResizeDelay = setTimeout(() => {
            calculate();
            cm.refresh();
        }, 10);
    });

    // Show confirmation dialog
    function confirm(msg, action) {
        $('confirmMsg').innerHTML = msg;
        showModal('#dialog-confirm');
        var yesAction = (e) => {
            action();
            e.stopPropagation();
            UIkit.modal('#dialog-confirm').hide();
            $('confirm-yes').removeEventListener('click', yesAction);
        };
        $('confirm-yes').addEventListener('click', yesAction);
        UIkit.util.on('#dialog-confirm', 'hidden', () => $('confirm-yes').removeEventListener('click', yesAction));
    }

    // Show error dialog
    function showError(e, title) {
        UIkit.util.on('#dialog-error', 'beforeshow', () => {
            $('errTitle').innerHTML = title || 'Error';
            $('errMsg').innerHTML = e;
        });
        showModal('#dialog-error');
    }

    // Show app messages
    function showMsg(msg) {
        $('msg').innerHTML = msg;
        $('msg').style.opacity = '1';
        setTimeout(() => $('msg').style.opacity = '0', 3000);
        setTimeout(() => $('msg').innerHTML = '', 3500);
    }

    /**
     * @fileoverview syncscroll - scroll several areas simultaniously
     * @version 0.0.3
     * 
     * @license MIT, see http://github.com/asvd/intence
     * @copyright 2015 asvd <heliosframework@gmail.com>
     * 
     * Modified by Timur Atalay
     */
    (() => {
        var names = {};
        var elems = document.getElementsByName('sync');
        var i, j, el, found, name;
        var scrollSync = (el, name) => {
            el.addEventListener('scroll', el.syn = () => {
                var elems = names[name];
                var scrollY = el.scrollTop;
                var yRate = scrollY / (el.scrollHeight - el.clientHeight);
                var updateY = scrollY != el.eY;

                el.eY = scrollY;
                for (i in elems) {
                    var otherEl = elems[i++];
                    if (otherEl != el) {
                        if (updateY && Math.round(otherEl.scrollTop - (scrollY = otherEl.eY = Math.round(yRate * (otherEl.scrollHeight - otherEl.clientHeight))))) {
                            otherEl.scrollTop = scrollY;
                        }
                    }
                }
            }, 0);
        };

        for (i = 0; i < elems.length;) {
            found = j = 0;
            el = elems[i++];
            if (!(name = el.getAttribute('name'))) continue;
            el = el.scroller || el;
            for (j in (names[name] = names[name] || [])) found |= names[name][j++] == el;
            if (!found) names[name].push(el);
            el.eX = el.eY = 0;
            scrollSync(el, name);
        }
    })();

    // Mousetrap
    var traps = {
        clearButton: ['command+d', 'ctrl+d'],
        printButton: ['command+p', 'ctrl+p'],
        saveButton: ['command+s', 'ctrl+s'],
        openButton: ['command+o', 'ctrl+o']
    };
    Object.entries(traps).map(([b, c]) => {
        Mousetrap.bindGlobal(c, (e) => {
            e.preventDefault();
            if (document.getElementsByClassName('uk-open').length === 0) $(b).click();
        });
    });

    // Demo input
    var demo = '# In addition to all math.js features you can do:\n' +
        '# Subtotal all numbers in a block\n' +
        '3+5\n' +
        '8*2\n' +
        'subtotal\n' +
        '\n' +
        '# Total everything up to this point\n' +
        'total\n' +
        '\n' +
        '# Average everything up to this point\n' +
        'avg\n' +
        '\n' +
        'lineErrors\n' +
        '# Dates & Times\n' +
        'today\n' +
        'today + 1 day + 2 weeks\n' +
        'today + 5 years\n' +
        '5/8/2019 + 1 week\n' +
        'May 8, 2019 - 2 months\n' +
        '\n' +
        'now\n' +
        'now + 2 hours\n' +
        'ans + 30 minutes\n' +
        '\n' +
        '# ans token\n' +
        'ans + 5 days\n' +
        '2+2\n' +
        'ans * 5\n' +
        '\n' +
        '# line# token\n' +
        'line28 * 5 / 2\n' +
        '\n' +
        '# Percentages\n' +
        '5% of 100\n' +
        '100 + 5%\n' +
        '100 + 25%%4 + 1\n' +
        '100 + 20% of 100 + 10%3 - 10%\n' +
        '(100 + 20%)% of 80 + 10%3 - 10%\n' +
        '120% of 80 + (10%3 - 10%)\n' +
        'line31% of 80\n' +
        'line31 - ans%\n' +
        '\n' +
        '# Currencies (data from floatrates.com)\n' +
        '1 USD to EUR\n' +
        '25 EUR to CAD\n' +
        '\n' +
        '# Plot functions\n' +
        'f(x) = sin(x)\n' +
        'f(x) = 2x^2 + 3x -5\n';
})();