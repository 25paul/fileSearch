const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
var { saveAs }  = require('file-saver');

const searchBtn = document.querySelector('.search-btn')
const searchResult = document.querySelector('.search-result')
const searchInput = document.querySelector('.search-input')
const noValueTip = document.querySelector('.no-value-tip')
const unworkValueTip = document.querySelector('.unwork-value-tip')
const resultContainer = document.querySelector('.result-container')
const resultExport = document.querySelector('.result-export')
const allBox = document.querySelector('.all-box')
const nextPage = document.querySelector('.next-page')
const pageIndex = document.querySelector('.page-index')
const selectAll = document.querySelector('.select-all')

var u = navigator.userAgent, app = navigator.appVersion;
let isMac = (u.indexOf('Mac') > -1)
let isWindow = (u.indexOf('Windows') > -1)
console.log(u)

 
var pathName = isMac ? "/users/admin/Documents/test" : "D:/test";

console.log(pathName)

let searchFilelist = [];    //搜索结果的文件列表
let pageCourt = 0;    //页面数
let curPageIndex = 0    //当前页面index
let selectFiles = [];    //选择的文件列表


window.onload = ()=>{

    let repeatOrspace = function (arr) {
        let repeatArr = [...new Set(arr)];
        let spaceArr = repeatArr.filter(function (i) {
            return i && i.trim();
        });
        return spaceArr;
    }

    let searchHandle = function () {
        searchFilelist = [];
        pageCourt = 0;    
        curPageIndex = 0;
        selectFiles = [];
        resultContainer.innerHTML = '';
        pageIndex.innerHTML = '';
        nextPage.style.display = "none";
        let inputVal = searchInput.value;
        let inputValArr = repeatOrspace(inputVal.split(' '))
        noValueTip.style.display = "none";
        unworkValueTip.style.display = "none";
        searchResult.style.display = "block";
        if(inputVal.length > 0 && inputValArr.length > 0){
            fs.readdir(pathName, function(err, files){console.log(files)
                let curPageStart = curPageIndex * 10;
                let curPageEnd = curPageIndex * 10 + 10;

                let dirs = [];
                let oFrag=document.createDocumentFragment();
                for (let i=0; i<files.length; i++){
                    for (let j=0; j<inputValArr.length; j++){
                        if(files[i].indexOf(inputValArr[j]) > 0 || files[i].indexOf(inputValArr[j]) === 0) {
                            searchFilelist.push(files[i])
                        }    
                    }   
                }

                if (searchFilelist.length <= 0) {
                    searchResult.style.display = "none";
                    unworkValueTip.style.display = "block";
                    return;
                }

                pageCourt = Math.ceil(searchFilelist.length/10);
                
                if (pageCourt === 1) {
                    curPageEnd = searchFilelist.length;
                } else {
                    curPageEnd = curPageIndex * 10 + 10;
                }

                for (let i=curPageStart; i<curPageEnd; i++){
                    let oDiv=document.createElement('div');
                    oDiv.setAttribute('class', 'search-list');
                    oDiv.setAttribute('filename', searchFilelist[i]);
                    oDiv.setAttribute('title', searchFilelist[i]);
                    let selectDiv=document.createElement('div');
                    selectDiv.setAttribute('class', 'select-box');
                    oDiv.appendChild(selectDiv);
                    let textDiv=document.createElement('div');
                    textDiv.setAttribute('class', 'select-text');
                    let txt = document.createTextNode(searchFilelist[i]);
                    textDiv.appendChild(txt);
                    oDiv.appendChild(textDiv);
                    oFrag.appendChild(oDiv);
                }
                resultContainer.appendChild(oFrag);
                // if(resultContainer.childNodes.length === 0){
                //     unworkValueTip.style.display = "block";
                // } 

                let oPageFrag=document.createDocumentFragment();
                if(pageCourt > 1){
                    for(let i=0; i<pageCourt; i++){
                        let oDiv=document.createElement('div');
                        oDiv.setAttribute('class','item-index');
                        oDiv.setAttribute('dataIndex',i)
                        let txt = document.createTextNode(i+1);
                        oDiv.appendChild(txt);
                        oPageFrag.appendChild(oDiv);
                    }
                    pageIndex.appendChild(oPageFrag);
                    nextPage.style.display = "block";
                }
            });
        } else {
            searchResult.style.display = "none";
            noValueTip.style.display = "block";
        }
    }

    searchBtn.onclick = ()=>{
        searchHandle();
        
    }

    searchInput.onkeypress = (e) => {
        if(e.keyCode == 13) {  
            searchHandle();
        }  
    }

    searchInput.oninput = (e) => {
        if (!e.target.value) {
            searchResult.style.display = "none";
            resultContainer.innerHTML = '';
            pageIndex.innerHTML = '';
            nextPage.style.display = "none";
        }
    }

    //选择文件
    resultContainer.onclick = (e) => {
        // 去掉全选选择的符号
        let selectAllClass = selectAll.getAttribute('class');
        let selectAllClassIndex = selectAllClass.split(' ').indexOf('selected');
        if(selectAllClassIndex >=0){
            selectAllClass = selectAllClass.split(' ');
            selectAllClass.splice(selectAllClassIndex, 1)
            selectAllClass = selectAllClass.join(' ');
            selectAll.setAttribute('class', selectAllClass)
        }
        console.log(e.target)
        let divClass = e.target.getAttribute('class').split(' ')
        if (divClass.indexOf('selected') < 0) {
            divClass.push('selected');
            divClass = divClass.join(' ')
            e.target.setAttribute('class', divClass)
        } else {
            let index = divClass.indexOf('selected'); 
            divClass.splice(index, 1); 
            e.target.setAttribute('class', divClass)
        }
        let divName = e.target.getAttribute('filename');
        if (selectFiles.indexOf(divName) < 0) {
            selectFiles.push(divName)
        } else {
            let index = selectFiles.indexOf(divName); 
            selectFiles.splice(index, 1); 
        }
    }

    // 全选当前页面文件
    selectAll.onclick = (e) => {
        let divClass = e.target.getAttribute('class').split(' ');
        var selectChild = resultContainer.querySelectorAll('.search-list');
        if (divClass.indexOf('selected') < 0) {
            divClass.push('selected');
            divClass = divClass.join(' ')
            e.target.setAttribute('class', divClass);
            for (let i=0; i<selectChild.length; i++) {
                let filename = selectChild[i].getAttribute('filename');
                if (selectFiles.indexOf(filename) < 0){
                    selectFiles.push(filename)
                }
                let itemClass = selectChild[i].getAttribute('class').split(' ');
                if (itemClass.indexOf('selected') < 0) {
                    itemClass.push('selected');
                    itemClass = itemClass.join(' ')
                    selectChild[i].setAttribute('class', itemClass)
                }
            }
        } else {
            let index = divClass.indexOf('selected'); 
            divClass.splice(index, 1); 
            e.target.setAttribute('class', divClass);
            for (let i=0; i<selectChild.length; i++) {
                let filename = selectChild[i].getAttribute('filename');
                let selectFilesIndex = selectFiles.indexOf(filename)
                if (selectFilesIndex >= 0){
                    selectFiles.splice(selectFilesIndex, 1);
                }
                let itemClass = selectChild[i].getAttribute('class').split(' ');
                if (itemClass.indexOf('selected') >= 0) {
                    let index = itemClass.indexOf('selected'); 
                    itemClass.splice(index, 1); 
                    selectChild[i].setAttribute('class', itemClass)
                }
            }
        }
    }

    // 跳转到特定页数
    pageIndex.onclick = (e) => {
        if (e.target.hasAttribute('dataIndex')) {
            resultContainer.innerHTML = '';
            curPageIndex = e.target.getAttribute('dataIndex');
            let oFrag=document.createDocumentFragment();
            let curPageStart = curPageIndex * 10;
            let curPageEnd
            if (curPageIndex < pageCourt - 1) {
                curPageEnd = curPageIndex * 10 + 10;
            } else {
                curPageEnd = searchFilelist.length;
            }
            
            for (let i=curPageStart; i<curPageEnd; i++){
                let oDiv=document.createElement('div');
                // oDiv.setAttribute('class', 'search-list');
                if(selectFiles.indexOf(searchFilelist[i]) >= 0) {
                    oDiv.setAttribute('class', 'search-list selected');
                } else {
                    oDiv.setAttribute('class', 'search-list');
                }
                oDiv.setAttribute('filename', searchFilelist[i]);
                oDiv.setAttribute('title', searchFilelist[i]);
                let selectDiv=document.createElement('div');
                selectDiv.setAttribute('class', 'select-box');
                oDiv.appendChild(selectDiv)
                let textDiv=document.createElement('div');
                textDiv.setAttribute('class', 'select-text');
                
                let txt = document.createTextNode(searchFilelist[i]);
                textDiv.appendChild(txt);
                oDiv.appendChild(textDiv);
                oFrag.appendChild(oDiv);
            }
            resultContainer.appendChild(oFrag);
        }
    }

    // 下一页
    nextPage.onclick = () => {
        if (curPageIndex + 1 < pageCourt) {
            console.log('最后一页啦')
            curPageIndex = curPageIndex + 1;
            resultContainer.innerHTML = '';
            let oFrag=document.createDocumentFragment();
            let curPageStart = curPageIndex * 10;
            let curPageEnd
            if (curPageIndex < pageCourt - 1) {
                curPageEnd = curPageIndex * 10 + 10;
            } else {
                curPageEnd = searchFilelist.length;
            }
            
            for (let i=curPageStart; i<curPageEnd; i++){
                let oDiv=document.createElement('div');
                oDiv.setAttribute('filename', searchFilelist[i]);
                oDiv.setAttribute('title', searchFilelist[i]);
                if(selectFiles.indexOf(searchFilelist[i]) >= 0) {
                    oDiv.setAttribute('class', 'search-list selected');
                } else {
                    oDiv.setAttribute('class', 'search-list');
                }
                let selectDiv=document.createElement('div');
                selectDiv.setAttribute('class', 'select-box');
                oDiv.appendChild(selectDiv)
                let textDiv=document.createElement('div');
                textDiv.setAttribute('class', 'select-text');
                let txt = document.createTextNode(searchFilelist[i]);
                textDiv.appendChild(txt);
                oDiv.appendChild(textDiv);
                oFrag.appendChild(oDiv);
            }
            resultContainer.appendChild(oFrag);
        }
    }

    // 全选当前页
    allBox.onclick = () => {

    }

    //导出按钮
    resultExport.onclick = () => {
        if (selectFiles.length > 0) {
            var zip = new JSZip();
            for (let i=0; i<selectFiles.length; i++){
                var data = fs.readFileSync(pathName+"/"+selectFiles[i]);
                var result = zip.folder("result");
                result.file(selectFiles[i], data);
            }
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "result.zip");
            });
        } else {
            alert('请选择文件！')
        }
    }
}
