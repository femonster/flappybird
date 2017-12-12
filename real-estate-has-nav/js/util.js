function istype(o, type) {
    if (type) {
        var _type = type.toLowerCase();
    }
    switch (_type) {
        case 'string':
            return Object.prototype.toString.call(o) === '[object String]';
        case 'number':
            return Object.prototype.toString.call(o) === '[object Number]';
        case 'boolean':
            return Object.prototype.toString.call(o) === '[object Boolean]';
        case 'undefined':
            return Object.prototype.toString.call(o) === '[object Undefined]';
        case 'null':
            return Object.prototype.toString.call(o) === '[object Null]';
        case 'function':
            return Object.prototype.toString.call(o) === '[object Function]';
        case 'array':
            return Object.prototype.toString.call(o) === '[object Array]';
        case 'object':
            return Object.prototype.toString.call(o) === '[object Object]';
        case 'nan':
            return isNaN(o);
        case 'elements':
            return Object.prototype.toString.call(o).indexOf('HTML') !== -1
        default:
            return Object.prototype.toString.call(o)
    }
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }

    var newClass = el.className.split(" ")
    newClass.push(className)
    el.className = newClass.join(' ')
}


function hasClass(el, className) {
    // 匹配 "className" 或者 " className "
    var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}


function removeClass(obj, classStr) {
    if ((istype(obj, 'array') || istype(obj, 'elements')) && obj.length > 1) {
        for (var i = 0, len = obj.length; i < len; i++) {
            if (hasClass(obj[i], classStr)) {
                var reg = new RegExp('(\\s|^)' + classStr + '(\\s|$)');
                obj[i].className = obj[i].className.replace(reg, '');
            }
        }
    } else {
        if (hasClass(obj, classStr)) {
            var reg = new RegExp('(\\s|^)' + classStr + '(\\s|$)');
            obj.className = obj.className.replace(reg, '');
        }
    }
}


function replaceClass(obj, newName, oldName) {
    removeClass(obj, oldName);
    addClass(obj, newName);
}


function prependChild(parent, newChild) {
    console.log("utils:", parent, newChild);
    if (parent.firstChild) {
        parent.insertBefore(newChild, parent.firstChild);
    } else {
        parent.appendChild(newChild);
    }
    return parent;
}

function siblings(elem) { //参数elem就是想取谁的兄弟节点，就把那个元素传进去 
    var nodes = []; //定义一个数组，用来存elem的兄弟元素 
    var previ = elem.previousSibling;
    while (previ) { //先取o的哥哥们 判断有没有上一个哥哥元素，如果有则往下执行 previ表示previousSibling 
        if (previ.nodeType === 1) {
            nodes.push(previ);
        }
        previ = previ.previousSibling; //最后把上一个节点赋给previ 
    }
    nodes.reverse(); //把顺序反转一下 这样元素的顺序就是按先后的了 
    var nexts = elem.nextSibling; //再取elem的弟弟 
    while (nexts) { //判断有没有下一个弟弟结点 nexts是nextSibling的意思 
        if (nexts.nodeType === 1) {
            nodes.push(nexts);
        }
        nexts = nexts.nextSibling;
    }
    return nodes; //最后按从老大到老小的顺序，把这一组元素返回 
}