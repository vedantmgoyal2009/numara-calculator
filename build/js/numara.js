/**
 * @copyright 2021 [object Object]
 * @homepage https://github.com/bornova/numara-calculator
 * @license MIT - https://github.com/bornova/numara-calculator/blob/master/LICENSE
 */

const appInfo = {
    productName: 'Numara',
    description:'Numara Calculator',
    version: '3.4.1',
    author: 'Timur Atalay',
    homepage: 'https://github.com/bornova/numara-calculator',
    licence: 'MIT',
    website: 'https://numara.io'
}
const solve=math.evaluate;function calculate(){var e=[],t=[],a=[],i=[],n={},s={},o={lowerExp:-12,upperExp:12},r={maximumFractionDigits:settings.app.precision};function l(e){s.avg=solve(t.length>0?"("+math.mean(t)+")":0),s.total=solve(a.length>0?"("+a.join("+")+")":0),s.subtotal=solve(i.length>0?"("+i.join("+")+")":0);var o=(e=e.replace(/\bans\b/g,n.ans).replace(/\bnow\b/g,n.now).replace(/\btoday\b/g,n.today).replace(/\bavg\b/g,s.avg).replace(/\btotal\b/g,s.total).replace(/\bsubtotal\b/g,s.subtotal)).match(/\bline\d+\b/g);o&&o.map((t=>e=e.replace(t,n[t])));var r=new RegExp("millisecond|second|minute|hour|day|week|month|quarter|year|decade|century|centuries|millennium|millennia");if(e.match(r)){var l=e.split(/[\+\-]/),c=l[0].replace(/[A-Za-z]+,/,"").trim(),d=e.replace(l[0],"").trim(),p=settings.app.dateFormat,u=settings.app.dateFormat+" "+settings.app.timeFormat,g=DateTime.fromFormat(c,p),m=DateTime.fromFormat(c,u),h=g.isValid?g:m.isValid?m:null,f=String(solve(d+" to hours",n)),v=Number(f.split(" ")[0]);if(!h)return"Invalid Date";var y=!!h.toFormat(settings.app.dateFormat+"hh:mm:ss:SSS").endsWith("12:00:00:000");e='"'+h.plus({hours:v}).toFormat((settings.app.dateDay?"ccc, ":"")+(y?p:u))+'"'}var $=/\d*\.?\d%\d*\.?\d/g,k=/[\w.]*%/g;for((e=e.match(/[\w.]*%[ ]*of[ ]*/g)?e.replace(/%[ ]*of[ ]*/g,"/100*"):e).match($)&&e.match($).map((t=>e=e.replace(t,solve(t,n))));e.match(k)&&!e.match($);){var b=e.match(k)[0],w=solve(b.slice(0,-1),n),S=e.split(b)[0],B=solve(S.trim().slice(0,-1),n);newval=solve(B+"*"+w+"/100",n),e=e.replace(S+b,solve(S+newval,n))}return solve(e,n)}n.now=DateTime.local().toFormat((settings.app.dateDay?"ccc, ":"")+settings.app.dateFormat+" "+settings.app.timeFormat),n.today=DateTime.local().toFormat((settings.app.dateDay?"ccc, ":"")+settings.app.dateFormat),cm.refresh(),cm.eachLine((s=>{var c=s.text.trim().split("//")[0].split("#")[0],d=cm.getLineNumber(s),p=d+1,u=s.height,g="";if(cm.removeLineClass(d,"gutter","lineNoError"),c)try{c=p>1&&c.charAt(0).match(/[\+\-\*\/]/)&&cm.getLine(p-2).length>0?n.ans+c:c;try{g=solve(c,n)}catch(e){if(c.match(/:/))try{solve(c.split(":")[0])}catch(e){c=c.substring(c.indexOf(":")+1)}for(;c.match(/\([^\)]+\)/);){var m=c.substring(c.lastIndexOf("(")+1),h=c.substring(c.lastIndexOf("("));if(m=m.substring(0,m.indexOf(")")),0===(h=h.substring(0,h.indexOf(")")+1)).length)break;try{c=c.replace(h,l(m))}catch(e){break}}g=l(c)}if(void 0!==g){if(n.ans=n["line"+p]=g,isNaN(g)||(t.push(g),a.push(g),i.push(g)),(g=function(e){var t=(e=String(e)).trim().split(" ")[0],a=e.replace(t,"");return formattedAnswer=t.includes("e")||isNaN(t)?t.match(/e-?\d+/)?parseFloat(Number(t.split("e")[0]).toFixed(settings.app.precision))+"e"+e.split("e")[1]+a:function(e){var t=e.length;'"'===e.charAt(0)&&(e=e.substring(1,t--));'"'===e.charAt(--t)&&(e=e.substring(0,t));return e}(e):settings.app.thouSep?Number(t).toLocaleString(void 0,r)+a:parseFloat(Number(t).toFixed(settings.app.precision))+a,formattedAnswer}(math.format(g,o))).match(/\w\(x\)/)){var f=/\w\(x\)$/.test(g)?c.trim():g.trim();g=`<a class="plotButton" data-func="${f}">Plot</a>`,n.ans=n["line"+p]=f}}else i.length=0}catch(e){var v=String(e).replace(/'|"/g,"`");g=settings.app.lineErrors?`<a class="lineError" data-line="${p}" data-error="${v}">Error</a>`:"",settings.app.lineErrors&&cm.addLineClass(d,"gutter","lineNoError")}else i.length=0;e+=`<div style="height:${u}px"><span class="${g&&!g.startsWith("<a")?"answer":""}" >${g}</span></div>`})),$("output").innerHTML=e,$("clearButton").className=""==cm.getValue()?"noAction":"action",$("printButton").className=""==cm.getValue()?"noAction":"action",$("saveButton").className=""==cm.getValue()?"noAction":"action",ls.set("input",cm.getValue())}const $=e=>document.getElementById(e),ls={get:e=>JSON.parse(localStorage.getItem(e)),set:(e,t)=>localStorage.setItem(e,JSON.stringify(t))},DateTime=luxon.DateTime,cm=CodeMirror.fromTextArea($("inputArea"),{theme:"numara",coverGutterNextToScrollbar:!0,inputStyle:"textarea",viewportMargin:1/0});cm.setValue(ls.get("input")||""),cm.execCommand("goDocEnd"),$("udfInput").setAttribute("placeholder","// Define new functions and variables:\nmyvalue: 42,\nhello: (name) => {\n\treturn 'hello, ' + name + '!'\n}");const udfInput=CodeMirror.fromTextArea($("udfInput"),{mode:"javascript",autoCloseBrackets:!0,smartIndent:!1});$("uduInput").setAttribute("placeholder","// Define new units:\nfoo: {\n\tprefixes: 'long',\n\tbaseName: 'essence-of-foo'\n},\nbar: '40 foo',\nbaz: {\n\tdefinition: '1 bar/hour',\n\tprefixes: 'long'\n}");const uduInput=CodeMirror.fromTextArea($("uduInput"),{mode:"javascript",autoCloseBrackets:!0,smartIndent:!1});let settings;(()=>{let isMac=navigator.userAgent.toLowerCase().includes("mac"),isNode=navigator.userAgent.toLowerCase().includes("electron"),ipc=isNode?require("electron").ipcRenderer:null;function toggleMax(){ipc.send(ipc.sendSync("isMaximized")?"unmaximize":"maximize")}document.title=appInfo.description,$("dialog-about-title").innerHTML=appInfo.description,$("dialog-about-copyright").innerHTML=`Copyright ©️ ${DateTime.local().year} ${appInfo.author}`,$("dialog-about-appVersion").innerHTML=isNode?"Version "+appInfo.version:`Version ${appInfo.version}\n        <div class="versionCtnr">\n            <div><a href="https://github.com/bornova/numara-calculator/releases" target="_blank">Download desktop version</a></div>\n        </div>`,$("gitLink").setAttribute("href",appInfo.homepage),$("webLink").setAttribute("href",appInfo.website),$("licenseLink").setAttribute("href",appInfo.homepage+"/blob/master/LICENSE"),isNode?(ipc.on("themeUpdate",(()=>applySettings())),ipc.on("fullscreen",((e,t)=>{t&&ipc.send("maximize")}))):"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").catch((()=>console.log("Service worker registration failed"))),isNode&&!isMac?($("header-mac").remove(),$("header-win").style.display="block",$("header-win-title").innerHTML=appInfo.productName,$("max").style.display=ipc.sendSync("isMaximized")?"none":"block",$("unmax").style.display=ipc.sendSync("isMaximized")?"block":"none",$("winButtons").addEventListener("click",(e=>{switch(e.target.id){case"min":ipc.send("minimize");break;case"max":ipc.send("maximize");break;case"unmax":ipc.send("unmaximize");break;case"close":ipc.send("close")}e.stopPropagation()})),ipc.on("isMax",((e,t)=>{$("unmax").style.display=t?"block":"none",$("max").style.display=t?"none":"block"})),$("header-win").addEventListener("dblclick",toggleMax)):($("header-win").remove(),$("header-mac").style.display="block",$("header-mac-title").innerHTML=appInfo.productName,isNode&&$("header-mac").addEventListener("dblclick",toggleMax)),feather.replace();const defaultSettings={app:{autocomplete:!0,closeBrackets:!0,currencies:!0,dateDay:!1,dateFormat:"M/d/yyyy",divider:!0,fontSize:"1.1rem",fontWeight:"400",keywordTips:!0,lineErrors:!0,lineNumbers:!0,lineWrap:!0,matchBrackets:!0,matrixType:"Matrix",numericOutput:"number",precision:"4",predictable:!1,syntax:!0,theme:"system",thouSep:!0,timeFormat:"h:mm a"},inputWidth:60,plot:{plotArea:!1,plotCross:!1,plotGrid:!1}};settings=ls.get("settings"),settings?DeepDiff.observableDiff(settings,defaultSettings,(e=>{"E"!==e.kind&&(DeepDiff.applyChange(settings,defaultSettings,e),ls.set("settings",settings))})):(settings=defaultSettings,ls.set("settings",defaultSettings)),math.createUnit("USD",{aliases:["usd"]});let currencyRates={};function getRates(){navigator.onLine?($("lastUpdated").innerHTML='<div uk-spinner="ratio: 0.3"></div>',fetch("https://www.floatrates.com/widget/1030/cfc5515dfc13ada8d7b0e50b8143d55f/usd.json").then((e=>e.json())).then((e=>{currencyRates=e;var t=["cup"];Object.keys(e).map((a=>{math.createUnit(e[a].code,{definition:math.unit(e[a].inverseRate+"USD"),aliases:[t.includes(e[a].code.toLowerCase())?"":e[a].code.toLowerCase()]},{override:!0}),ls.set("rateDate",e[a].date)})),applySettings(),$("lastUpdated").innerHTML=ls.get("rateDate")})).catch((e=>{$("lastUpdated").innerHTML="n/a",notify("Failed to get exchange rates ("+e+")","warning")}))):($("lastUpdated").innerHTML="No internet connection.",notify("No internet connection. Could not update exchange rates.","warning"))}let udfList=[],uduList=[];CodeMirror.defineMode("numara",(()=>({token:(e,t)=>{if(e.match(/\/\/.*/)||e.match(/#.*/))return"comment";if(e.match(/\d/))return"number";if(e.match(/(?:\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%)/))return"operator";e.eatWhile(/\w/);var a=e.current();if(settings.app.currencies&&(a.toLowerCase()in currencyRates||"usd"==a.toLowerCase()))return"currency";try{if(math.unit(a).units.length>0)return"unit"}catch(e){}if(udfList.includes(a))return"udf";if(uduList.includes(a))return"udu";if("function"==typeof math[a]&&Object.getOwnPropertyNames(math[a]).includes("signatures"))return"function";if(a.match(/\b(?:ans|total|subtotal|avg|today|now|line\d+)\b/))return"scope";try{math.evaluate(a)}catch(e){return"variable"}return e.next(),"space"}}))),CodeMirror.defineMode("plain",(()=>({token:(e,t)=>(e.next(),"text")})));let numaraHints=["ans","now","today","total","subtotal","avg"];function applySettings(){settings=ls.get("settings"),$("style").setAttribute("href","system"==settings.app.theme?isNode&&ipc.sendSync("isDark")?"css/dark.css":"css/light.css":"light"==settings.app.theme?"css/light.css":"css/dark.css"),isNode&&ipc.send("setTheme",settings.app.theme);var e=document.querySelectorAll(".panelFont, .CodeMirror");for(var t of e)t.style.fontSize=settings.app.fontSize,t.style.fontWeight=settings.app.fontWeight;$("input").style.width=(settings.app.divider?settings.inputWidth:defaultSettings.inputWidth)+"%",$("divider").style.display=settings.app.divider?"block":"none",$("output").style.textAlign=settings.app.divider?"left":"right",cm.setOption("mode",settings.app.syntax?"numara":"plain"),cm.setOption("lineNumbers",settings.app.lineNumbers),cm.setOption("lineWrapping",settings.app.lineWrap),cm.setOption("autoCloseBrackets",settings.app.closeBrackets),cm.setOption("matchBrackets",!(!settings.app.syntax||!settings.app.matchBrackets)&&{maxScanLines:1}),udfInput.setOption("theme","system"==settings.app.theme?isNode&&ipc.sendSync("isDark")?"material-darker":"default":"light"==settings.app.theme?"default":"material-darker"),uduInput.setOption("theme","system"==settings.app.theme?isNode&&ipc.sendSync("isDark")?"material-darker":"default":"light"==settings.app.theme?"default":"material-darker"),math.config({matrix:settings.app.matrixType,number:settings.app.numericOutput,predictable:settings.app.predictable}),setTimeout(calculate,15)}function showModal(e){UIkit.modal(e,{bgClose:!1,stack:!0}).show()}Object.getOwnPropertyNames(math).forEach((e=>{"function"==typeof math[e]&&Object.getOwnPropertyNames(math[e]).includes("signatures")&&numaraHints.push(e)})),CodeMirror.registerHelper("hint","numaraHints",(e=>{for(var t=e.getCursor(),a=e.getLine(t.line),i=t.ch,n=i;n<a.length&&/[\w$]/.test(a.charAt(n));)++n;for(;i&&/[\w$]/.test(a.charAt(i-1));)--i;var s=i!==n&&a.slice(i,n),o=new RegExp("^"+s,"i");return{list:(s?numaraHints.filter((e=>e.match(o))):[]).sort(),from:CodeMirror.Pos(t.line,i),to:CodeMirror.Pos(t.line,n)}})),CodeMirror.commands.autocomplete=e=>{CodeMirror.showHint(e,CodeMirror.hint.numaraHints,{completeSingle:!1})},cm.on("changes",calculate),cm.on("inputRead",((e,t)=>{settings.app.autocomplete&&CodeMirror.commands.autocomplete(e)})),cm.on("update",(()=>{var e=document.getElementsByClassName("cm-function");if(e.length>0&&settings.app.keywordTips)for(var t of e)try{var a=JSON.stringify(math.help(t.innerHTML).toJSON()),i=JSON.parse(a);UIkit.tooltip(t,{title:i.description,pos:"top-left"})}catch(e){UIkit.tooltip(t,{title:"Description not available.",pos:"top-left"})}var n=document.getElementsByClassName("cm-udf");if(n.length>0&&settings.app.keywordTips)for(var t of n)UIkit.tooltip(t,{title:"User defined function.",pos:"top-left"});var s=document.getElementsByClassName("cm-udu");if(s.length>0&&settings.app.keywordTips)for(var o of s)UIkit.tooltip(o,{title:"User defined unit.",pos:"top-left"});if((l=document.getElementsByClassName("cm-currency")).length>0&&settings.app.keywordTips)for(var r of l)try{var l,c="usd"==(l=r.innerHTML.toLowerCase())?"U.S. Dollar":currencyRates[l].name;UIkit.tooltip(r,{title:c,pos:"top-left"})}catch(e){UIkit.tooltip(r,{title:"Description not available.",pos:"top-left"})}var d=document.getElementsByClassName("cm-unit");if(d.length>0&&settings.app.keywordTips)for(var o of d)UIkit.tooltip(o,{title:`Unit '${o.innerHTML}'`,pos:"top-left"})})),applySettings(),settings.app.currencies&&getRates(),UIkit.mixin({data:{delay:500,offset:5}},"tooltip"),UIkit.util.on(".modal","hidden",(()=>cm.focus())),UIkit.util.on(".uk-switcher","show",(()=>cm.getInputField().blur()));const savedCount=()=>Object.keys(ls.get("saved")||{}).length;function updateSavedCount(){UIkit.tooltip("#openButton",{title:"Open ("+savedCount()+")"})}function populateSaved(){var e=ls.get("saved")||{},t=Object.entries(e);$("dialog-open-body").innerHTML="",t.length>0?($("dialog-open-deleteAll").disabled=!1,t.map((([e,t])=>{$("dialog-open-body").innerHTML+=`\n                <div class="dialog-open-wrapper" id="${e}">\n                    <div data-action="load">\n                        <div class="dialog-open-title">${t[0]}</div>\n                        <div class="dialog-open-date">${DateTime.fromFormat(e,"yyyyMMddHHmmssSSS").toFormat("ff")}</div>\n                    </div>\n                    <span class="dialog-open-delete" data-action="delete"><i data-feather="x-circle"></i></span>\n                </div>`})),feather.replace()):($("dialog-open-deleteAll").disabled=!0,$("dialog-open-body").innerHTML="No saved calculations.",$("openButton").className="noAction"),updateSavedCount()}function applyUdf(udf){try{loadUdf=new Function(`"use strict";math.import({${udf}}, {override: true})`),loadUdf(),calculate(),ls.set("udf",udf);var udfs=eval("[{"+udf+"}]");udfList=[],udfs.forEach((e=>Object.keys(e).forEach((e=>udfList.push(e))))),UIkit.modal("#dialog-udfu").hide()}catch(e){$("udfSyntaxError").innerHTML=e}}function applyUdu(udu){try{loadUdu=new Function(`"use strict";math.createUnit({${udu}}, {override: true})`),loadUdu(),calculate(),ls.set("udu",udu);var udus=eval("[{"+udu+"}]");uduList=[],udus.forEach((e=>Object.keys(e).forEach((e=>uduList.push(e))))),UIkit.modal("#dialog-udfu").hide()}catch(e){$("uduSyntaxError").innerHTML=e}}function prepSettings(){for(var e of($("themeList").value=settings.app.theme,$("fontSize").value=settings.app.fontSize,$("fontWeight").value=settings.app.fontWeight,$("dateFormat").innerHTML="",["M/d/yyyy","d/M/yyyy","MMM d, yyyy"]))$("dateFormat").innerHTML+=`<option value="${e}">${DateTime.local().toFormat(e)}</option>`;for(var t of($("dateFormat").value=settings.app.dateFormat,$("timeFormat").innerHTML="",["h:mm a","H:mm"]))$("timeFormat").innerHTML+=`<option value="${t}">${DateTime.local().toFormat(t)}</option>`;for(var a of($("timeFormat").value=settings.app.timeFormat,$("dateDay").checked=settings.app.dateDay,$("syntaxButton").checked=settings.app.syntax,syntaxToggle(),$("keywordTipsButton").checked=settings.app.keywordTips,$("matchBracketsButton").checked=settings.app.matchBrackets,$("precisionRange").value=settings.app.precision,$("precision-label").innerHTML=settings.app.precision,$("numericOutput").innerHTML="",["number","BigNumber","Fraction"]))$("numericOutput").innerHTML+=`<option value="${a}">${a.charAt(0).toUpperCase()+a.slice(1)}</option>`;for(var i of($("numericOutput").value=settings.app.numericOutput,"BigNumber"==settings.app.numericOutput&&bigNumberWarning(),$("matrixType").innerHTML="",["Matrix","Array"]))$("matrixType").innerHTML+=`<option value="${i}">${i}</option>`;$("matrixType").value=settings.app.matrixType,$("predictableButton").checked=settings.app.predictable,$("thouSepButton").checked=settings.app.thouSep,$("currencyButton").checked=settings.app.currencies,$("lastUpdated").innerHTML=settings.app.currencies?ls.get("rateDate"):"",$("currencyUpdate").style.display=settings.app.currencies?"block":"none",$("autocompleteButton").checked=settings.app.autocomplete,$("closeBracketsButton").checked=settings.app.closeBrackets,$("dividerButton").checked=settings.app.divider,$("lineNoButton").checked=settings.app.lineNumbers,$("lineErrorButton").checked=settings.app.lineErrors,$("lineWrapButton").checked=settings.app.lineWrap,checkDefaultSettings(),checkWindowSize()}function checkDefaultSettings(){$("defaultSettingsButton").style.display=DeepDiff.diff(settings.app,defaultSettings.app)?"inline":"none"}function checkWindowSize(){$("resetSizeButton").style.display=isNode&&ipc.sendSync("isResized")&&!ipc.sendSync("isMaximized")?"block":"none"}function syntaxToggle(){$("keywordTipsButton").disabled=!$("syntaxButton").checked,$("matchBracketsButton").disabled=!$("syntaxButton").checked,$("keywordTipsButton").parentNode.style.opacity=$("syntaxButton").checked?"1":"0.5",$("matchBracketsButton").parentNode.style.opacity=$("syntaxButton").checked?"1":"0.5"}function bigNumberWarning(){$("bigNumWarn").style.display="BigNumber"==$("numericOutput").value?"inline-block":"none"}function saveSettings(){settings.app.theme=$("themeList").value,settings.app.fontSize=$("fontSize").value,settings.app.fontWeight=$("fontWeight").value,settings.app.dateFormat=$("dateFormat").value,settings.app.timeFormat=$("timeFormat").value,settings.app.dateDay=$("dateDay").checked,settings.app.syntax=$("syntaxButton").checked,settings.app.keywordTips=$("keywordTipsButton").checked,settings.app.matchBrackets=$("matchBracketsButton").checked,settings.app.precision=$("precisionRange").value,settings.app.numericOutput=$("numericOutput").value,settings.app.matrixType=$("matrixType").value,settings.app.predictable=$("predictableButton").checked,settings.app.thouSep=$("thouSepButton").checked,!settings.app.currencies&&$("currencyButton").checked?getRates():$("currencyButton").checked||(localStorage.removeItem("rateDate"),currencyRates={}),settings.app.currencies=$("currencyButton").checked,settings.app.autocomplete=$("autocompleteButton").checked,settings.app.closeBrackets=$("closeBracketsButton").checked,settings.app.divider=$("dividerButton").checked,settings.app.lineNumbers=$("lineNoButton").checked,settings.app.lineErrors=$("lineErrorButton").checked,settings.app.lineWrap=$("lineWrapButton").checked,ls.set("settings",settings),checkDefaultSettings(),applySettings()}let resizeDelay;updateSavedCount(),$("openButton").className=savedCount()>0?"action":"noAction",$("actions").addEventListener("click",(e=>{switch(e.target.id){case"clearButton":""!=cm.getValue()&&(cm.setValue(""),cm.focus(),calculate());break;case"printButton":UIkit.tooltip("#printButton").hide(),""!=cm.getValue()&&($("print-title").innerHTML=appInfo.productName,$("printBox").innerHTML=$("panel").innerHTML,isNode?(ipc.send("print"),ipc.on("printReply",((e,t)=>{t&&notify(t),$("printBox").innerHTML=""}))):window.print());break;case"saveButton":""!=cm.getValue()&&($("saveTitle").value="",showModal("#dialog-save"),$("saveTitle").focus());break;case"openButton":Object.keys(ls.get("saved")||{}).length>0&&showModal("#dialog-open");break;case"udfuButton":showModal("#dialog-udfu");break;case"settingsButton":showModal("#dialog-settings");break;case"helpButton":showModal("#dialog-help"),$("searchBox").focus();break;case"aboutButton":showModal("#dialog-about")}e.stopPropagation()})),$("output").addEventListener("click",(e=>{switch(e.target.className){case"answer":var t=e.target.innerText;navigator.clipboard.writeText(t),notify(`Copied '${t}' to clipboard.`);break;case"plotButton":func=e.target.getAttribute("data-func");try{$("plotGrid").checked=settings.plot.plotGrid,$("plotCross").checked=settings.plot.plotCross,$("plotArea").checked=settings.plot.plotArea,plot(),showModal("#dialog-plot")}catch(e){showError(e)}break;case"lineError":var a=e.target.getAttribute("data-line");showError(e.target.getAttribute("data-error"),"Error on Line "+a)}e.stopPropagation()})),$("output").addEventListener("mousedown",(()=>{for(var e=document.getElementsByClassName("CodeMirror-selected");e[0];)e[0].classList.remove("CodeMirror-selected")})),document.addEventListener("click",(e=>{switch(e.target.id){case"dialog-save-save":var t=DateTime.local().toFormat("yyyyMMddHHmmssSSS"),a=ls.get("saved")||{},i=cm.getValue(),n=$("saveTitle").value.replace(/<|>/g,"").trim()||"No title";a[t]=[n,i],ls.set("saved",a),UIkit.modal("#dialog-save").hide(),$("openButton").className="action",updateSavedCount(),notify("Saved");break;case"dialog-open-deleteAll":confirm("All saved calculations will be deleted.",(()=>{localStorage.removeItem("saved"),populateSaved(),UIkit.modal("#dialog-open").hide(),notify("Deleted all saved calculations")}));break;case"dialog-udfu-save-f":applyUdf(udfInput.getValue().trim());break;case"dialog-udfu-save-u":applyUdu(uduInput.getValue().trim());break;case"defaultSettingsButton":confirm("All settings will revert back to defaults.",(()=>{settings.app=defaultSettings.app,ls.set("settings",settings),applySettings(),$("currencyButton").checked||getRates(),prepSettings()}));break;case"dialog-settings-reset":confirm("All user settings and data will be lost.",(()=>{isNode?ipc.send("resetApp"):(localStorage.clear(),location.reload())}));break;case"resetSizeButton":isNode&&ipc.send("resetSize");break;case"syntaxButton":syntaxToggle();break;case"bigNumWarn":showError('Using the BigNumber may break function plotting and is not compatible with some math functions. \n                It may also cause unexpected behavior and affect overall performance.<br><br>\n                <a target="_blank" href="https://mathjs.org/docs/datatypes/bignumbers.html">Read more on BigNumbers</a>',"Caution: BigNumber Limitations");break;case"currencyButton":$("currencyUpdate").style.display=$("currencyButton").checked?"block":"none";break;case"plotGrid":settings.plot.plotGrid=$("plotGrid").checked,ls.set("settings",settings),plot();break;case"plotCross":settings.plot.plotCross=$("plotCross").checked,ls.set("settings",settings),plot();break;case"plotArea":settings.plot.plotArea=$("plotArea").checked,ls.set("settings",settings),plot();break;case"restartButton":ipc.send("updateApp");break;case"demoButton":cm.setValue(demo),calculate(),UIkit.modal("#dialog-help").hide()}})),$("dialog-open").addEventListener("click",(e=>{var t,a=ls.get("saved");"load"==e.target.parentNode.getAttribute("data-action")&&(t=e.target.parentNode.parentNode.id,cm.setValue(a[t][1]),calculate(),UIkit.modal("#dialog-open").hide()),"delete"==e.target.getAttribute("data-action")&&(t=e.target.parentNode.id,confirm('Calculation "'+a[t][0]+'" will be deleted.',(()=>{delete a[t],ls.set("saved",a),populateSaved()})))})),UIkit.util.on("#dialog-open","beforeshow",(()=>populateSaved())),UIkit.util.on("#dialog-udfu","beforeshow",(()=>{$("udfSyntaxError").innerHTML="",$("uduSyntaxError").innerHTML="";var e=ls.get("udf").trim(),t=ls.get("udu").trim();udfInput.setValue(e),uduInput.setValue(t)})),UIkit.util.on("#dialog-udfu","shown",(()=>{udfInput.refresh(),uduInput.refresh()})),ls.get("udf")||ls.set("udf",""),ls.get("udu")||ls.set("udu",""),applyUdf(ls.get("udf")),applyUdu(ls.get("udu")),UIkit.util.on("#setswitch","beforeshow",(e=>e.stopPropagation())),UIkit.util.on("#dialog-settings","beforeshow",(()=>prepSettings())),UIkit.util.on("#dialog-settings","hidden",(()=>cm.focus())),$("numericOutput").addEventListener("change",bigNumberWarning),$("precisionRange").addEventListener("input",(()=>$("precision-label").innerHTML=$("precisionRange").value)),document.querySelectorAll(".settingItem").forEach((e=>e.addEventListener("change",(()=>saveSettings())))),$("searchBox").addEventListener("input",(()=>{var e=$("searchBox").value.trim();if(e)try{$("searchResults").innerHTML="";var t=JSON.stringify(math.help(e).toJSON()),a=JSON.parse(t);$("searchResults").innerHTML=`\n                    <div>Name:</div><div>${a.name}</div>\n                    <div>Description:</div><div>${a.description}</div>\n                    <div>Category:</div><div>${a.category}</div>\n                    <div>Syntax:</div><div>${String(a.syntax).split(",").join(", ")}</div>\n                    <div>Examples:</div><div>${String(a.examples).split(",").join(", ")}</div>\n                    <div>Also see:</div><div>${String(a.seealso).split(",").join(", ")}</div>\n                `}catch(t){$("searchResults").innerHTML=`No results for "${e}"`}else $("searchResults").innerHTML="Start typing above to search..."}));let isResizing=!1;const panel=$("panel"),divider=$("divider");function resetDivider(){settings.inputWidth=defaultSettings.inputWidth,ls.set("settings",settings),applySettings()}let func,activePlot;$("divider").addEventListener("dblclick",resetDivider),$("divider").addEventListener("mousedown",(e=>isResizing=e.target==divider)),$("panel").addEventListener("mouseup",(()=>isResizing=!1)),$("panel").addEventListener("mousemove",(e=>{var t=settings.app.lineNumbers?12:27,a=(e.clientX-panel.offsetLeft-t)/panel.clientWidth*100,i=a<0?0:a>100?100:a;isResizing&&($("input").style.width=i+"%",settings.inputWidth=i,ls.set("settings",settings),clearTimeout(resizeDelay),resizeDelay=setTimeout(calculate,10))}));const numaraPlot=window.functionPlot;function plot(){$("plotTitle").innerHTML=func;var e=func.split("=")[1],t=2*math.abs(math.evaluate(e,{x:0}));t!=1/0&&0!=t||(t=10);var a=activePlot?activePlot.meta.xScale.domain():[-t,t],i=activePlot?activePlot.meta.yScale.domain():[-t,t];activePlot=numaraPlot({target:"#plot",height:$("plot").clientHeight,width:$("plot").clientWidth,xAxis:{domain:a},yAxis:{domain:i},tip:{xLine:settings.plot.plotCross,yLine:settings.plot.plotCross},grid:settings.plot.plotGrid,data:[{fn:e,graphType:"polyline",closed:settings.plot.plotArea}],plugins:[numaraPlot.plugins.zoomBox()]})}let windowResizeDelay;function confirm(e,t){$("confirmMsg").innerHTML=e,showModal("#dialog-confirm");var a=e=>{t(),e.stopPropagation(),UIkit.modal("#dialog-confirm").hide(),$("confirm-yes").removeEventListener("click",a)};$("confirm-yes").addEventListener("click",a),UIkit.util.on("#dialog-confirm","hidden",(()=>$("confirm-yes").removeEventListener("click",a)))}function showError(e,t){UIkit.util.on("#dialog-error","beforeshow",(()=>{$("errTitle").innerHTML=t||"Error",$("errMsg").innerHTML=e})),showModal("#dialog-error")}function notify(e,t){UIkit.notification({message:e,status:t||"primary",pos:"bottom-center",timeout:3e3})}UIkit.util.on("#dialog-plot","shown",(()=>plot())),UIkit.util.on("#dialog-plot","hide",(()=>activePlot=!1)),window.addEventListener("resize",(()=>{activePlot&&$("dialog-plot").classList.contains("uk-open")&&plot(),clearTimeout(windowResizeDelay),windowResizeDelay=setTimeout(calculate,10),checkWindowSize()}));let inputScroll=!1,outputScroll=!1;const leftSide=document.getElementsByClassName("CodeMirror-scroll")[0],rightSide=$("output");leftSide.addEventListener("scroll",(()=>{inputScroll||(outputScroll=!0,rightSide.scrollTop=leftSide.scrollTop),inputScroll=!1})),rightSide.addEventListener("scroll",(()=>{outputScroll||(inputScroll=!0,leftSide.scrollTop=rightSide.scrollTop),outputScroll=!1,$("scrollTop").style.display=$("output").scrollTop>50?"block":"none"})),$("scrollTop").addEventListener("click",(()=>$("output").scrollTop=0));const traps={clearButton:["command+d","ctrl+d"],printButton:["command+p","ctrl+p"],saveButton:["command+s","ctrl+s"],openButton:["command+o","ctrl+o"]};Object.entries(traps).map((([e,t])=>{Mousetrap.bindGlobal(t,(t=>{t.preventDefault(),0===document.getElementsByClassName("uk-open").length&&$(e).click()}))})),isNode&&(ipc.send("checkUpdate"),ipc.on("notifyUpdate",(e=>{notify('Updating Numara to latest version... <a class="updateLink" onclick="$(\'aboutButton\').click()">View update status</a>'),$("notificationDot").style.display="block"})),ipc.on("updateStatus",((e,t)=>{"ready"==t?($("dialog-about-updateStatus").innerHTML="Restart Numara to finish updating.",$("restartButton").style.display="inline-block",$("dialog-about").classList.contains("uk-open")||notify('Restart Numara to finish updating. <a class="updateLink" onclick="$(\'restartButton\').click()">Restart Now</a>')):$("dialog-about-updateStatus").innerHTML=t})));const demo="1+2\n\n# In addition to mathjs functions, you can do:\nans // Get last answer\ntotal // Total up to this point\navg // Average up to this point\nline4 // Get answer from a line#\nsubtotal // Subtotal last block\n\n# Percentages:\n10% of 20\n40 + 30%\n\n# Dates\ntoday\nnow\ntoday - 3 weeks\nnow + 36 hours - 2 days\n\n# Currency conversion\n1 usd to try\n20 cad to usd\n\n# Plot functions\nf(x) = sin(x)\nf(x) = 2x^2 + 3x - 5\n"})(),window.addEventListener("load",(()=>{setTimeout((()=>document.getElementsByClassName("CodeMirror-code")[0].lastChild.scrollIntoView()),250),setTimeout((()=>cm.focus()),500)}));