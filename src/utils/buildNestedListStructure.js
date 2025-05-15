export function buildNestedListStructure(flatList, maxDepth = 2) {
  const map = {};
  flatList.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  const nested = [];
  flatList.forEach((item) => {
    if (item.parent) {
      map[item.parent]?.children.push(map[item.id]);
    } else {
      nested.push(map[item.id]);
    }
  });

  const sortRecursive = (list, depth = 0) =>
    list
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) =>
        depth < maxDepth
          ? { ...item, children: sortRecursive(item.children, depth + 1) }
          : item
      );

  return sortRecursive(nested);
}
