const dig = (obj, keys) => {
  function digDeeper(obj, keys) {
    if (keys.length == 0) {
      return obj
    } else {
      let key, rest;

      [key, ...rest] = keys

      const value = obj[`${key}`]

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

export { dig }
