/**
 * @copyright 2021 Timur Atalay
 * @homepage https://github.com/bornova/numara-calculator
 * @license MIT - https://github.com/bornova/numara-calculator/blob/master/LICENSE
 */

appInfo = {
    productName: 'Numara',
    description:'Numara Calculator',
    version: '3.8.1',
    author: 'Timur Atalay',
    homepage: 'https://github.com/bornova/numara-calculator',
    licence: 'MIT',
    website: 'https://numara.io'
};
(()=>{const e=(e,t)=>t?document.querySelectorAll(e):document.querySelector(e),t=e=>JSON.parse(localStorage.getItem(e)),n=(e,t)=>{localStorage.setItem(e,JSON.stringify(t))},a=luxon.DateTime;feather.replace();const o=CodeMirror.fromTextArea(e("#inputArea"),{theme:"numara",coverGutterNextToScrollbar:!0,inputStyle:"textarea",viewportMargin:1/0});o.setValue(t("input")||""),o.execCommand("goDocEnd"),e("#udfInput").setAttribute("placeholder",'// Define new functions and variables:\n    myvalue: 42,\n    hello: (name) => {\n    \treturn "hello, " + name + "!"\n    }'.replace(/^ +/gm,""));const i=CodeMirror.fromTextArea(e("#udfInput"),{mode:"javascript",autoCloseBrackets:!0,smartIndent:!1});e("#uduInput").setAttribute("placeholder",'// Define new units:\n    foo: {\n    \tprefixes: "long",\n    \tbaseName: "essence-of-foo"\n    },\n    bar: "40 foo",\n    baz: {\n    \tdefinition: "1 bar/hour",\n    \tprefixes: "long"\n    }'.replace(/^ +/gm,""));const r=CodeMirror.fromTextArea(e("#uduInput"),{mode:"javascript",autoCloseBrackets:!0,smartIndent:!1}),s=navigator.userAgent.toLowerCase().includes("mac"),c=navigator.userAgent.toLowerCase().includes("electron"),l=c?require("electron").ipcRenderer:null;function p(){l.send(l.sendSync("isMaximized")?"unmaximize":"maximize")}let d;document.title=appInfo.description,e("#dialog-about-title").innerHTML=appInfo.description,e("#dialog-about-copyright").innerHTML=`Copyright ©️ ${a.local().year} ${appInfo.author}`,e("#dialog-about-appVersion").innerHTML=c?"Version "+appInfo.version:`Version ${appInfo.version}\n      <div class="versionCtnr">\n        <div>\n          <a href="https://github.com/bornova/numara-calculator/releases" target="_blank">Download desktop version</a>\n        </div>\n      </div>`,e("#gitLink").setAttribute("href",appInfo.homepage),e("#webLink").setAttribute("href",appInfo.website),e("#licenseLink").setAttribute("href",appInfo.homepage+"/blob/master/LICENSE"),c?(l.on("themeUpdate",L),l.on("fullscreen",((e,t)=>{t&&l.send("maximize")}))):"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch((()=>{console.log("Service worker registration failed")})),c&&!s?(e("#header-mac").remove(),e("#header-win").style.display="block",e("#header-win-title").innerHTML=appInfo.productName,e("#max").style.display=l.sendSync("isMaximized")?"none":"block",e("#unmax").style.display=l.sendSync("isMaximized")?"block":"none",e("#winButtons").addEventListener("click",(e=>{switch(e.target.id){case"min":l.send("minimize");break;case"max":l.send("maximize");break;case"unmax":l.send("unmaximize");break;case"close":l.send("close")}e.stopPropagation()})),l.on("isMax",((t,n)=>{e("#unmax").style.display=n?"block":"none",e("#max").style.display=n?"none":"block"})),e("#header-win").addEventListener("dblclick",p)):(e("#header-win").remove(),e("#header-mac").style.display="block",e("#header-mac-title").innerHTML=appInfo.productName,c&&e("#header-mac").addEventListener("dblclick",p));const u={app:{autocomplete:!0,closeBrackets:!0,contPrevLine:!0,currencies:!0,dateDay:!1,dateFormat:"M/d/yyyy",divider:!0,fontSize:"1.1rem",fontWeight:"400",keywordTips:!0,lineErrors:!0,lineNumbers:!0,lineWrap:!0,matchBrackets:!0,matrixType:"Matrix",numericOutput:"number",precision:"4",predictable:!1,syntax:!0,theme:"system",thouSep:!0,timeFormat:"h:mm a"},inputWidth:60,plot:{plotArea:!1,plotCross:!1,plotGrid:!1}};d=t("settings"),d?DeepDiff.observableDiff(d,u,(e=>{"E"!==e.kind&&(DeepDiff.applyChange(d,u,e),n("settings",d))})):(d=u,n("settings",u)),math.createUnit("USD",{aliases:["usd"]});let m,h={};function g(){navigator.onLine?(e("#lastUpdated").innerHTML='<div uk-spinner="ratio: 0.3"></div>',fetch("https://www.floatrates.com/widget/1030/cfc5515dfc13ada8d7b0e50b8143d55f/usd.json").then((e=>e.json())).then((a=>{h=a;const o=["cup"];Object.keys(a).forEach((e=>{math.createUnit(a[e].code,{definition:math.unit(a[e].inverseRate+"USD"),aliases:[o.includes(a[e].code.toLowerCase())?"":a[e].code.toLowerCase()]},{override:!0}),n("rateDate",a[e].date)})),L(),e("#lastUpdated").innerHTML=t("rateDate")})).catch((t=>{e("#lastUpdated").innerHTML="n/a",q("Failed to get exchange rates ("+t+")","warning")}))):(e("#lastUpdated").innerHTML="No internet connection.",q("No internet connection. Could not update exchange rates.","warning"))}function f(){const t=[],i=[],r=[];let s="";function c(e){const n=math.evaluate(t.length>0?"("+math.mean(t)+")":0),o=math.evaluate(i.length>0?"("+i.join("+")+")":0),s=math.evaluate(r.length>0?"("+r.join("+")+")":0);m.now=a.local().toFormat((d.app.dateDay?"ccc, ":"")+d.app.dateFormat+" "+d.app.timeFormat),m.today=a.local().toFormat((d.app.dateDay?"ccc, ":"")+d.app.dateFormat);const c=(e=e.replace(/\bans\b/g,m.ans).replace(/\bnow\b/g,m.now).replace(/\btoday\b/g,m.today).replace(/\bavg\b/g,n).replace(/\btotal\b/g,o).replace(/\bsubtotal\b/g,s)).match(/\bline\d+\b/g);c&&c.forEach((t=>{e=m[t]?e.replace(t,m[t]):t}));if(e.match(/'millisecond|second|minute|hour|day|week|month|quarter|year|decade|century|centuries|millennium|millennia'/g)){const t=e.split(/[+-]/)[0],n=t.replace(/[A-Za-z]+,/,"").trim(),o=e.replace(t,"").trim(),i=d.app.dateFormat,r=d.app.dateFormat+" "+d.app.timeFormat,s=a.fromFormat(n,i),c=a.fromFormat(n,r),l=s.isValid?s:c.isValid?c:null,p=String(math.evaluate(o+" to hours",m)),u=Number(p.split(" ")[0]);if(!l)return"Invalid Date";{const t=l.toFormat(d.app.dateFormat+"hh:mm:ss:SSS").endsWith("12:00:00:000");e=`"${l.plus({hours:u}).toFormat((d.app.dateDay?"ccc, ":"")+(t?i:r))}"`}}return e=e.match(/[\w.]*%[ ]*of[ ]*/g)?e.replace(/%[ ]*of[ ]*/g,"/100*"):e,math.evaluate(e,m)}N&&o.refresh(),m={},o.eachLine((e=>{const n=o.getLineNumber(e),a=n+1;o.removeLineClass(n,"gutter","lineNoError");let l="",p=e.text.trim().split("//")[0].split("#")[0];if(p)try{p=a>1&&p.charAt(0).match(/[+\-*/]/)&&o.getLine(a-2).length>0&&d.app.contPrevLine?m.ans+p:p;try{l=math.evaluate(p,m)}catch(e){if(p.match(/:/))try{math.evaluate(p.split(":")[0])}catch(e){p=p.substring(p.indexOf(":")+1)}for(;p.match(/\([^)]+\)/);){let e=p.substring(p.lastIndexOf("(")+1),t=p.substring(p.lastIndexOf("("));if(e=e.substring(0,e.indexOf(")")),t=t.substring(0,t.indexOf(")")+1),0===t.length)break;try{p=p.replace(t,c(e))}catch(e){break}}l=c(p)}if(void 0!==l){if(m.ans=l,m["line"+a]=l,isNaN(l)||(t.push(l),i.push(l),r.push(l)),l=y(math.format(l,{lowerExp:-12,upperExp:12})),l.match(/\w\(x\)/)){const e=/\w\(x\)$/.test(l)?p.trim():l.trim();l=`<a class="plotButton" data-func="${e}">Plot</a>`,m.ans=e,m["line"+a]=e}}else r.length=0,l=""}catch(e){const t=String(e).replace(/'|"/g,"`");l=d.app.lineErrors?`<a class="lineError" data-line="${a}" data-error="${t}">Error</a>`:"",d.app.lineErrors&&o.addLineClass(n,"gutter","lineNoError")}else r.length=0;s+=`\n        <div style="height:${e.height}px">\n          <span class="${l&&!l.startsWith("<a")?"answer":""}" >${l}</span>\n        </div>`})),e("#output").innerHTML=s,e("#clearButton").className=""===o.getValue()?"noAction":"action",e("#printButton").className=""===o.getValue()?"noAction":"action",e("#saveButton").className=""===o.getValue()?"noAction":"action",n("input",o.getValue())}function y(e){const t=(e=String(e)).trim().split(" ")[0],n=e.replace(t,""),a={maximumFractionDigits:d.app.precision};return t.includes("e")||isNaN(t)?t.match(/e-?\d+/)?parseFloat(Number(t.split("e")[0]).toFixed(d.app.precision))+"e"+e.split("e")[1]+n:function(e){let t=e.length;return'"'===e.charAt(0)&&(e=e.substring(1,t--)),'"'===e.charAt(--t)&&(e=e.substring(0,t)),e}(e):d.app.thouSep?Number(t).toLocaleString(void 0,a)+n:parseFloat(Number(t).toFixed(d.app.precision))+n}const k=[],v=[];function b(t){try{new Function(`'use strict'; math.import({${t}}, {override: true})`)(),f(),n("udf",t);const e=new Function(`'use strict'; return {${t}}`)();for(const t in e)k.push(t);UIkit.modal("#dialog-udfu").hide()}catch(t){e("#udfSyntaxError").innerHTML=t}}function w(t){try{new Function(`'use strict'; math.createUnit({${t}}, {override: true})`)(),f(),n("udu",t);const e=new Function(`'use strict'; return {${t}}`)();for(const t in e)v.push(t);UIkit.modal("#dialog-udfu").hide()}catch(t){e("#uduSyntaxError").innerHTML=t}}UIkit.util.on("#dialog-udfu","beforeshow",(()=>{e("#udfSyntaxError").innerHTML="",e("#uduSyntaxError").innerHTML="";const n=t("udf").trim(),a=t("udu").trim();i.setValue(n),r.setValue(a)})),UIkit.util.on("#dialog-udfu","shown",(()=>{i.refresh(),r.refresh()})),t("udf")||n("udf",""),t("udu")||n("udu",""),b(t("udf")),w(t("udu")),CodeMirror.defineMode("numara",(()=>({token:(e,t)=>{if(e.match(/\/\/.*/)||e.match(/#.*/))return"comment";if(e.match(/\d/))return"number";if(e.match(/(?:\+|-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%)/))return"operator";e.eatWhile(/\w/);const n=e.current();if(d.app.currencies&&(n.toLowerCase()in h||"usd"===n.toLowerCase()))return"currency";try{if(math.unit(n).units.length>0)return"unit"}catch(e){}if(k.includes(n))return"udf";if(v.includes(n))return"udu";if("function"==typeof math[n]&&Object.getOwnPropertyNames(math[n]).includes("signatures"))return"function";if(n.match(/\b(?:ans|total|subtotal|avg|today|now)\b/))return"scope";if(n.match(/\b(?:line\d+)\b/))return"lineNo";try{math.evaluate(n)}catch(e){return"variable"}return e.next(),"space"}}))),CodeMirror.defineMode("plain",(()=>({token:(e,t)=>(e.next(),"text")})));const x=["ans","now","today","total","subtotal","avg"];function L(){d=t("settings"),e("#style").setAttribute("href","system"===d.app.theme?c&&l.sendSync("isDark")?"css/dark.css":"css/light.css":"light"===d.app.theme?"css/light.css":"css/dark.css"),c&&l.send("setTheme",d.app.theme);const n=e(".panelFont, .CodeMirror",!0);for(const e of n)e.style.fontSize=d.app.fontSize,e.style.fontWeight=d.app.fontWeight;e("#input").style.width=(d.app.divider?d.inputWidth:u.inputWidth)+"%",e("#divider").style.display=d.app.divider?"block":"none",e("#output").style.textAlign=d.app.divider?"left":"right",o.setOption("mode",d.app.syntax?"numara":"plain"),o.setOption("lineNumbers",d.app.lineNumbers),o.setOption("lineWrapping",d.app.lineWrap),o.setOption("autoCloseBrackets",d.app.closeBrackets),o.setOption("matchBrackets",!(!d.app.syntax||!d.app.matchBrackets)&&{maxScanLines:1});const a="system"===d.app.theme?c&&l.sendSync("isDark")?"material-darker":"default":"light"===d.app.theme?"default":"material-darker";i.setOption("theme",a),r.setOption("theme",a),math.config({matrix:d.app.matrixType,number:d.app.numericOutput,predictable:d.app.predictable}),setTimeout(f,10)}function B(e){UIkit.modal(e,{bgClose:!1,stack:!0}).show()}Object.getOwnPropertyNames(math).forEach((e=>{"function"==typeof math[e]&&Object.getOwnPropertyNames(math[e]).includes("signatures")&&x.push(e)})),CodeMirror.registerHelper("hint","numaraHints",(e=>{const t=e.getCursor(),n=e.getLine(t.line);let a=t.ch,o=a;for(;o<n.length&&/[\w$]/.test(n.charAt(o));)++o;for(;a&&/[\w$]/.test(n.charAt(a-1));)--a;const i=a!==o&&n.slice(a,o),r=new RegExp("^"+i,"i");return{list:(i?x.filter((e=>e.match(r))):[]).sort(),from:CodeMirror.Pos(t.line,a),to:CodeMirror.Pos(t.line,o)}})),CodeMirror.commands.autocomplete=e=>{CodeMirror.showHint(e,CodeMirror.hint.numaraHints,{completeSingle:!1})},o.on("changes",f),o.on("inputRead",((e,t)=>{d.app.autocomplete&&CodeMirror.commands.autocomplete(e)})),o.on("update",(()=>{const t=e(".cm-function",!0);if(t.length>0&&d.app.keywordTips)for(const e of t)try{const t=JSON.stringify(math.help(e.innerText).toJSON()),n=JSON.parse(t);UIkit.tooltip(e,{title:n.description,pos:"top-left"})}catch(t){UIkit.tooltip(e,{title:"Description not available.",pos:"top-left"})}const n=e(".cm-udf",!0);if(n.length>0&&d.app.keywordTips)for(const e of n)UIkit.tooltip(e,{title:"User defined function.",pos:"top-left"});const a=e(".cm-udu",!0);if(a.length>0&&d.app.keywordTips)for(const e of a)UIkit.tooltip(e,{title:"User defined unit.",pos:"top-left"});const o=e(".cm-currency",!0);if(o.length>0&&d.app.keywordTips)for(const e of o)try{const t=e.innerText.toLowerCase(),n="usd"===t?"U.S. Dollar":h[t].name;UIkit.tooltip(e,{title:n,pos:"top-left"})}catch(t){UIkit.tooltip(e,{title:"Description not available.",pos:"top-left"})}const i=e(".cm-unit",!0);if(i.length>0&&d.app.keywordTips)for(const e of i)UIkit.tooltip(e,{title:`Unit '${e.innerText}'`,pos:"top-left"});const r=e(".cm-lineNo",!0);if(r.length>0&&d.app.keywordTips)for(const e of r){let t;try{t=y(math.evaluate(e.innerText,m))}catch(e){t="Undefined"}UIkit.tooltip(e,{title:t,pos:"top-left"})}})),L(),d.app.currencies&&g(),UIkit.mixin({data:{delay:500,offset:5}},"tooltip"),UIkit.util.on(".modal","hidden",(()=>{o.focus()})),UIkit.util.on(".uk-switcher","show",(()=>{o.getInputField().blur()}));const T=()=>Object.keys(t("saved")||{}).length;function S(){UIkit.tooltip("#openButton",{title:"Open ("+T()+")"})}S(),e("#openButton").className=T()>0?"action":"noAction",e("#actions").addEventListener("click",(n=>{switch(n.target.id){case"clearButton":""!==o.getValue()&&(o.setValue(""),o.focus(),f());break;case"printButton":UIkit.tooltip("#printButton").hide(),""!==o.getValue()&&(e("#print-title").innerHTML=appInfo.productName,e("#printBox").innerHTML=e("#panel").innerHTML,c?(l.send("print"),l.on("printReply",((t,n)=>{n&&q(n),e("#printBox").innerHTML=""}))):window.print());break;case"saveButton":""!==o.getValue()&&(e("#saveTitle").value="",B("#dialog-save"),e("#saveTitle").focus());break;case"openButton":Object.keys(t("saved")||{}).length>0&&B("#dialog-open");break;case"udfuButton":B("#dialog-udfu");break;case"settingsButton":B("#dialog-settings");break;case"helpButton":B("#dialog-help"),e("#searchBox").focus();break;case"aboutButton":B("#dialog-about")}n.stopPropagation()})),e("#output").addEventListener("click",(t=>{switch(t.target.className){case"answer":navigator.clipboard.writeText(t.target.innerText),q(`Copied '${t.target.innerText}' to clipboard.`);break;case"plotButton":W=t.target.getAttribute("data-func");try{e("#plotGrid").checked=d.plot.plotGrid,e("#plotCross").checked=d.plot.plotCross,e("#plotArea").checked=d.plot.plotArea,j(),B("#dialog-plot")}catch(e){G(e)}break;case"lineError":G(t.target.getAttribute("data-error"),"Error on Line "+t.target.getAttribute("data-line"))}t.stopPropagation()})),e("#output").addEventListener("mousedown",(()=>{const e=document.getElementsByClassName("CodeMirror-selected");for(;e[0];)e[0].classList.remove("CodeMirror-selected")}));let M,N=!0;function I(){const n=t("saved")||{},o=Object.entries(n);e("#dialog-open-body").innerHTML="",o.length>0?(e("#dialog-open-deleteAll").disabled=!1,o.forEach((([t,n])=>{e("#dialog-open-body").innerHTML+=`\n          <div class="dialog-open-wrapper" id="${t}">\n            <div data-action="load">\n              <div class="dialog-open-title">${n[0]}</div>\n              <div class="dialog-open-date">${a.fromFormat(t,"yyyyMMddHHmmssSSS").toFormat("ff")}</div>\n            </div>\n            <span class="dialog-open-delete" data-action="delete"><i data-feather="x-circle"></i></span>\n          </div>`})),feather.replace()):(e("#dialog-open-deleteAll").disabled=!0,e("#dialog-open-body").innerHTML="No saved calculations.",e("#openButton").className="noAction"),S()}function E(){const n=["M/d/yyyy","d/M/yyyy","MMM d, yyyy"],o=["h:mm a","H:mm"],i=["Matrix","Array"],r=["number","BigNumber","Fraction"];e("#themeList").value=d.app.theme,e("#fontSize").value=d.app.fontSize,e("#fontWeight").value=d.app.fontWeight,e("#dateFormat").innerHTML="";for(const t of n)e("#dateFormat").innerHTML+=`<option value="${t}">${a.local().toFormat(t)}</option>`;e("#dateFormat").value=d.app.dateFormat,e("#timeFormat").innerHTML="";for(const t of o)e("#timeFormat").innerHTML+=`<option value="${t}">${a.local().toFormat(t)}</option>`;e("#timeFormat").value=d.app.timeFormat,e("#dateDay").checked=d.app.dateDay,e("#syntaxButton").checked=d.app.syntax,A(),e("#keywordTipsButton").checked=d.app.keywordTips,e("#matchBracketsButton").checked=d.app.matchBrackets,e("#precisionRange").value=d.app.precision,e("#precision-label").innerHTML=d.app.precision,e("#numericOutput").innerHTML="";for(const t of r)e("#numericOutput").innerHTML+=`<option value="${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</option>`;e("#numericOutput").value=d.app.numericOutput,"BigNumber"===d.app.numericOutput&&H(),e("#contPrevLineButton").checked=d.app.contPrevLine,e("#matrixType").innerHTML="";for(const t of i)e("#matrixType").innerHTML+=`<option value="${t}">${t}</option>`;e("#matrixType").value=d.app.matrixType,e("#predictableButton").checked=d.app.predictable,e("#thouSepButton").checked=d.app.thouSep,e("#currencyButton").checked=d.app.currencies,e("#lastUpdated").innerHTML=d.app.currencies?t("rateDate"):"",e("#currencyUpdate").style.display=d.app.currencies?"block":"none",e("#autocompleteButton").checked=d.app.autocomplete,e("#closeBracketsButton").checked=d.app.closeBrackets,e("#dividerButton").checked=d.app.divider,e("#lineNoButton").checked=d.app.lineNumbers,e("#lineErrorButton").checked=d.app.lineErrors,e("#lineWrapButton").checked=d.app.lineWrap,U(),C()}function U(){e("#defaultSettingsButton").style.display=DeepDiff.diff(d.app,u.app)?"inline":"none"}function C(){e("#resetSizeButton").style.display=c&&l.sendSync("isResized")&&!l.sendSync("isMaximized")?"block":"none"}function A(){e("#keywordTipsButton").disabled=!e("#syntaxButton").checked,e("#matchBracketsButton").disabled=!e("#syntaxButton").checked,e("#keywordTipsButton").parentNode.style.opacity=e("#syntaxButton").checked?"1":"0.5",e("#matchBracketsButton").parentNode.style.opacity=e("#syntaxButton").checked?"1":"0.5"}function H(){e("#bigNumWarn").style.display="BigNumber"===e("#numericOutput").value?"inline-block":"none"}function F(){d.app.theme=e("#themeList").value,d.app.fontSize=e("#fontSize").value,d.app.fontWeight=e("#fontWeight").value,d.app.dateFormat=e("#dateFormat").value,d.app.timeFormat=e("#timeFormat").value,d.app.dateDay=e("#dateDay").checked,d.app.syntax=e("#syntaxButton").checked,d.app.keywordTips=e("#keywordTipsButton").checked,d.app.matchBrackets=e("#matchBracketsButton").checked,d.app.precision=e("#precisionRange").value,d.app.numericOutput=e("#numericOutput").value,d.app.contPrevLine=e("#contPrevLineButton").checked,d.app.matrixType=e("#matrixType").value,d.app.predictable=e("#predictableButton").checked,d.app.thouSep=e("#thouSepButton").checked,!d.app.currencies&&e("#currencyButton").checked?g():e("#currencyButton").checked||(localStorage.removeItem("rateDate"),h={}),d.app.currencies=e("#currencyButton").checked,d.app.autocomplete=e("#autocompleteButton").checked,d.app.closeBrackets=e("#closeBracketsButton").checked,d.app.divider=e("#dividerButton").checked,d.app.lineNumbers=e("#lineNoButton").checked,d.app.lineErrors=e("#lineErrorButton").checked,d.app.lineWrap=e("#lineWrapButton").checked,n("settings",d),U(),L()}document.addEventListener("keydown",(e=>{N=!e.repeat})),document.addEventListener("keyup",(e=>{N=!0})),document.addEventListener("click",(s=>{switch(s.target.id){case"dialog-save-save":{const i=a.local().toFormat("yyyyMMddHHmmssSSS"),r=t("saved")||{},s=o.getValue(),c=e("#saveTitle").value.replace(/<|>/g,"").trim()||"No title";r[i]=[c,s],n("saved",r),UIkit.modal("#dialog-save").hide(),e("#openButton").className="action",S(),q(`Saved as '${c}' <a class="notificationLink" onclick="document.querySelector('#openButton').click()">View saved calculations</a>`);break}case"dialog-open-deleteAll":R("All saved calculations will be deleted.",(()=>{localStorage.removeItem("saved"),I(),UIkit.modal("#dialog-open").hide(),q("Deleted all saved calculations")}));break;case"dialog-udfu-save-f":b(i.getValue().trim());break;case"dialog-udfu-save-u":w(r.getValue().trim());break;case"defaultSettingsButton":R("All settings will revert back to defaults.",(()=>{d.app=u.app,n("settings",d),L(),e("#currencyButton").checked||g(),E()}));break;case"dialog-settings-reset":R("All user settings and data will be lost.",(()=>{c?l.send("resetApp"):(localStorage.clear(),location.reload())}));break;case"resetSizeButton":c&&l.send("resetSize");break;case"syntaxButton":A();break;case"bigNumWarn":G('Using the BigNumber may break function plotting and is not compatible with some math functions. \n          It may also cause unexpected behavior and affect overall performance.<br><br>\n          <a target="_blank" href="https://mathjs.org/docs/datatypes/bignumbers.html">Read more on BigNumbers</a>',"Caution: BigNumber Limitations");break;case"currencyButton":e("#currencyUpdate").style.visibility=e("#currencyButton").checked?"visible":"hidden";break;case"plotGrid":d.plot.plotGrid=e("#plotGrid").checked,n("settings",d),j();break;case"plotCross":d.plot.plotCross=e("#plotCross").checked,n("settings",d),j();break;case"plotArea":d.plot.plotArea=e("#plotArea").checked,n("settings",d),j();break;case"restartButton":l.send("updateApp");break;case"demoButton":o.setValue(K),f(),UIkit.modal("#dialog-help").hide()}})),e("#dialog-open").addEventListener("click",(e=>{let a;const i=t("saved");"load"===e.target.parentNode.getAttribute("data-action")&&(a=e.target.parentNode.parentNode.id,o.setValue(i[a][1]),f(),UIkit.modal("#dialog-open").hide()),"delete"===e.target.getAttribute("data-action")&&(a=e.target.parentNode.id,R('Calculation "'+i[a][0]+'" will be deleted.',(()=>{delete i[a],n("saved",i),I()})))})),UIkit.util.on("#dialog-open","beforeshow",I),UIkit.util.on("#setswitch","beforeshow",(e=>{e.stopPropagation()})),UIkit.util.on("#dialog-settings","beforeshow",E),UIkit.util.on("#dialog-settings","hidden",(()=>{o.focus()})),e("#numericOutput").addEventListener("change",H),e("#precisionRange").addEventListener("input",(()=>{e("#precision-label").innerHTML=e("#precisionRange").value})),document.querySelectorAll(".settingItem").forEach((e=>{e.addEventListener("change",F)})),e("#searchBox").addEventListener("input",(()=>{const t=e("#searchBox").value.trim();if(t)try{const n=JSON.parse(JSON.stringify(math.help(t).toJSON()));e("#searchResults").innerHTML=`\n          <div>Name:</div><div>${n.name}</div>\n          <div>Description:</div><div>${n.description}</div>\n          <div>Category:</div><div>${n.category}</div>\n          <div>Syntax:</div><div>${String(n.syntax).split(",").join(", ")}</div>\n          <div>Examples:</div><div>${String(n.examples).split(",").join(", ")}</div>\n          <div>Also see:</div><div>${String(n.seealso).split(",").join(", ")}</div>`}catch(n){e("#searchResults").innerHTML=`No results for "${t}"`}else e("#searchResults").innerHTML="Start typing above to search..."}));let O=!1;const D=e("#panel"),$=e("#divider");let W,z;e("#divider").addEventListener("dblclick",(function(){d.inputWidth=u.inputWidth,n("settings",d),L()})),e("#divider").addEventListener("mousedown",(e=>{O=e.target===$})),e("#panel").addEventListener("mouseup",(()=>{O=!1})),e("#panel").addEventListener("mousemove",(t=>{if(O){const a=d.app.lineNumbers?12:27,o=(t.clientX-D.offsetLeft-a)/D.clientWidth*100,i=o<0?0:o>100?100:o;e("#input").style.width=i+"%",d.inputWidth=i,n("settings",d),clearTimeout(M),M=setTimeout(f,10)}}));const V=window.functionPlot;function j(){e("#plotTitle").innerHTML=W;const t=W.split("=")[1];let n=2*math.abs(math.evaluate(t,{x:0}));n!==1/0&&0!==n||(n=10);const a=z?z.meta.xScale.domain():[-n,n],o=z?z.meta.yScale.domain():[-n,n];z=V({target:"#plot",height:e("#plot").clientHeight,width:e("#plot").clientWidth,xAxis:{domain:a},yAxis:{domain:o},tip:{xLine:d.plot.plotCross,yLine:d.plot.plotCross},grid:d.plot.plotGrid,data:[{fn:t,graphType:"polyline",closed:d.plot.plotArea}],plugins:[V.plugins.zoomBox()]})}let P;function R(t,n){e("#confirmMsg").innerHTML=t,B("#dialog-confirm");const a=t=>{n(),t.stopPropagation(),UIkit.modal("#dialog-confirm").hide(),e("#confirm-yes").removeEventListener("click",a)};e("#confirm-yes").addEventListener("click",a),UIkit.util.on("#dialog-confirm","hidden",(()=>{e("#confirm-yes").removeEventListener("click",a)}))}function G(t,n){UIkit.util.on("#dialog-error","beforeshow",(()=>{e("#errTitle").innerHTML=n||"Error",e("#errMsg").innerHTML=t})),B("#dialog-error")}function q(e,t){UIkit.notification({message:e,status:t||"primary",pos:"bottom-center",timeout:3e3})}UIkit.util.on("#dialog-plot","shown",j),UIkit.util.on("#dialog-plot","hide",(()=>{z=!1})),window.addEventListener("resize",(()=>{z&&e("#dialog-plot").classList.contains("uk-open")&&j(),clearTimeout(P),P=setTimeout(f,10),C()}));let J=!1,_=!1;const X=e(".CodeMirror-scroll"),Z=e("#output");X.addEventListener("scroll",(()=>{J||(_=!0,Z.scrollTop=X.scrollTop),J=!1})),Z.addEventListener("scroll",(()=>{_||(J=!0,X.scrollTop=Z.scrollTop),_=!1,e("#scrollTop").style.display=e("#output").scrollTop>50?"block":"none"})),e("#scrollTop").addEventListener("click",(()=>{e("#output").scrollTop=0}));Object.entries({clearButton:["command+d","ctrl+d"],printButton:["command+p","ctrl+p"],saveButton:["command+s","ctrl+s"],openButton:["command+o","ctrl+o"]}).forEach((([t,n])=>{Mousetrap.bindGlobal(n,(n=>{n.preventDefault(),0===e(".uk-open",!0).length&&e(t).click()}))})),c&&(l.send("checkUpdate"),l.on("notifyUpdate",(t=>{q('Updating Numara... <a class="notificationLink" onclick="document.querySelector(`#aboutButton`).click()">View update status</a>'),e("#notificationDot").style.display="block"})),l.on("updateStatus",((t,n)=>{"ready"===n?(e("#dialog-about-updateStatus").innerHTML="Restart Numara to finish updating.",e("#restartButton").style.display="inline-block",e("#dialog-about").classList.contains("uk-open")||q('Restart Numara to finish updating. <a class="notificationLink" onclick="document.querySelector(`#restartButton`).click()">Restart Now</a>')):e("#dialog-about-updateStatus").innerHTML=n})));const K="1+2\n\n    # In addition to mathjs functions, you can do:\n    ans // Get last answer\n    total // Total up to this point\n    avg // Average up to this point\n    line4 // Get answer from a line#\n    subtotal // Subtotal last block\n\n    # Percentages:\n    10% of 20\n    40 + 30%\n\n    # Dates\n    today\n    now\n    today - 3 weeks\n    now + 36 hours - 2 days\n\n    # Currency conversion\n    1 usd to try\n    20 cad to usd\n\n    # Plot functions\n    f(x) = sin(x)\n    f(x) = 2x^2 + 3x - 5\n    ".replace(/^ +/gm,"");setTimeout((()=>{e(".CodeMirror-code").lastChild.scrollIntoView()}),250),setTimeout((()=>{o.focus()}),500)})();