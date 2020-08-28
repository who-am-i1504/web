const constant = {}

constant.dict = {
  '\r': '\\r',
  '\n': '\\n',
  '\v': '\\v',
  '\x1c': '\\x1c'
}

constant.redict = {
  '\\r': '\r',
  '\\n': '\n',
  '\\v': '\v',
  '\\x1c': '\x1c'
}

constant.charDeal = function charDeal(target) {
  target = String(target)
  var result = ''
  var dic = constant.dict
  for (var i = 0; i < target.length; i++) {
    if (target[i] in dic) {
      result += dic[target[i]]
    } else {
      result += target[i]
    }
  }
  return result
}

constant.changeString = function changeString(target) {
  target = String(target)
  var result = target
  for (var x in constant.redict) {
    result = result.replace(new RegExp(x, "gm"), constant.redict[x]);
  }
  return result
}

constant.changeIntString = function changeIntString(target) {
  target = target.split(' ')
  var result = ''
  for (var x in target) {
    var str = Number(target[x])
    result += String.fromCharCode(str)
  }
  return result
}

constant.characterDeal = function characterDeal(target) {
  if (typeof target === 'number') {
    return String(target)
  }
  var result = ''
  for (var i = 0; i < target.length; i++) {
    result += target.charCodeAt(i) + ' '
  }
  return result
}

export default constant
