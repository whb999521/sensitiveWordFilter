import sensitiveWord from './sensitiveWordList.js';

/**
 * @description
 * 构造敏感词map
 * @parma sensitiveWordList array  自定义的敏感词数组
 */
// 构建敏感Map格式数据
function makeSensitiveMap(sensitiveWordList) {
    // 构造根节点
    const result = new Map();
    for (const word of sensitiveWordList) {
        let map = result;
        for (let i = 0; i < word.length; i++) {
            // 依次获取字
            const char = word.charAt(i);
            // 判断是否存在
            /*
             *存在则获取下一层
             *不存在则设置结尾节点 'laster'
             */
            if (map.get(char)) {
                // 获取下一层节点
                map = map.get(char);
            } else {
                // 将当前节点设置为非结尾节点

                if (map.get('laster') === true) {
                    map.set('laster', false);
                }
                const item = new Map();
                // 新增节点默认为结尾节点
                item.set('laster', true);
                map.set(char, item);
                map = map.get(char);
            }
        }
    }
    return result;
}

/**
 * 检查敏感词是否存在
 * @param {Map格式} sensitiveMap
 * @param {any} txt
 * @param {any} index
 * @returns {flag,sensitiveWord}
 */
function checkSensitiveWord(sensitiveMap, txt, index) {
    let currentMap = sensitiveMap;
    let flag = false;
    let filterNum = 0; //记录过滤数量
    let sensitiveWord = ''; //记录过滤出来的敏感词
    for (let i = index; i < txt.length; i++) {
        const word = txt.charAt(i);
        currentMap = currentMap.get(word);
        if (currentMap) {
            filterNum++;
            sensitiveWord += word;
            if (currentMap.get('laster') === true) {
                // 表示已到词的结尾
                flag = true;
                break;
            }
        } else {
            break;
        }
    }
    // 两字成词
    if (filterNum < 2) {
        flag = false;
    }
    return { flag, sensitiveWord };
}

/**
 * 判断文本中是否存在敏感词
 * @param {any} txt
 * @returns
 */
function filterSensitiveWord(txt, sensitiveMap) {
    let flag = false; //用于判断是否被修改
    let matchResult = { flag: false, sensitiveWord: '' };
    // 过滤掉除了中文、英文、数字之外的内容
    const txtTrim = txt.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '');
    for (let i = 0; i < txtTrim.length; i++) {
        matchResult = checkSensitiveWord(sensitiveMap, txtTrim, i);
        if (matchResult.flag) {
            flag = true;
            txt = txt.replace(new RegExp(matchResult.sensitiveWord, 'gi'), '*');
        }
    }
    // flag为true表示修改了 false为没修改
    return { txt, flag };
}
/**
 * 新增敏感词合并并且去重
 * @param {Array} newWord
 * @returns  {newWordList}
 **/
function mergeWordList(newWord) {
    const initWordList = sensitiveWord; //默认词库
    let result = [];
    if (newWord && newWord.length > 0) {
        //合并并且去重
        const tempWordList = new Set([...newWord, ...initWordList]); //使用set去重
        result = Array.from(tempWordList); //伪数组转换为数组
    } else {
        result = initWordList;
    }
    return result;
}

/**
 * 方法的集合,开箱即用
 * @param {string} filterText
 * @returns  { txt, flag: matchResult.flag };
 */
export default function TextFilter(filterText, sensitiveWordList) {
    // 如果有新数组则使用合并且去除重复 没有则不传参,返回默认词库
    let tempSensitiveWordList =
        sensitiveWordList.length > 0 ? mergeWordList(sensitiveWordList) : mergeWordList();
    try {
        const newSensitiveWordList = makeSensitiveMap(tempSensitiveWordList);
        return filterSensitiveWord(filterText, newSensitiveWordList);
    } catch (error) {
        if (filterText.length < 1) throw new Error(`The argument passed in cannot be empty`);
        if (typeof filterText !== 'string' && filterText.constructor == String)
            throw new Error(`${filterText} is not a String`);
    }
}
