const dig = (obj, keys) => {
  function digDeeper(obj, keys) {
    if (keys === []) {
      return obj
    } else {
      let key, rest;

      [key, ...rest] = keys

      const value = obj[`${key}`]

      if (value === undefined) {
        return obj
      } else {
        return digDeeper(value, rest)
      }
    }
  }

  return digDeeper(obj, keys)
}

export { dig }
