# sensitiveWordFilter
DFA算法过滤敏感词汇,敏感词库

开箱即用

filterWord为方法 

```javascript
/*使用方法 :
引入 TextFilter方法 
TextFilter(filterText,sensitiveWordList) 
filterText为需要过滤的内容 
sensitiveWordList为敏感词数组
敏感数组可以传可不传,默认使用sensitiveWordList.js敏感词库
*/
 import TextFilter from 'filterWord.js';
let sensitiveWordList = ['敏感词', '敏感词2'];
let filterText = "敏感词没有了";
let result = TextFilter(filterText, sensitiveWordList);
console.log(result) //{txt:"*没有了";flag:true} 
// txt 为过滤后的内容 flag 为判断是否被修改过,false为没修改,true为修改
```



sensitiveWordList.js敏感词库 (5974)条敏感词

