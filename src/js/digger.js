const dig = (obj, keys) => {
  function digDeeper(obj, keys) {
    if (keys.length == 0) {
      return obj
    } else {
      let key, rest;

      [key, ...rest] = keys

      let value = obj[`${key}`]

      if (Array.isArray(value)) {
        let arrayElementKey
        [arrayElementKey, ...rest] = rest
        value = unshellArray(value, arrayElementKey)
      }

      if (value === undefined) {
        return 'undefined'
      } else if (value === null) {
        return 'null'
      } else {
        return digDeeper(value, rest)
      }
    }
  }

  return digDeeper(obj, keys)
}

function unshellArray(array, key) {
  return array[parseInt(key)]
}

export { dig }
