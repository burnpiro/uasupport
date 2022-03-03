export function filterObjForAllowedKeys(obj, keys = []) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if ((typeof value === 'string' || typeof value === 'number') && keys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function getFilterFromQuery(query = '', allowedKeys = []) {
  const parsedQuery = JSON.parse(
    '{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    function (key, value) {
      return key === '' ? value : decodeURIComponent(value);
    }
  );

  return filterObjForAllowedKeys(parsedQuery, allowedKeys);
}

export function getSerializedQueryParam(filter, allowedKeys, query) {
  const serialized = filterObjForAllowedKeys(filter, allowedKeys);
  if (query.length > 0) {
    serialized['query'] = query;
  }
  return serialized;
}
