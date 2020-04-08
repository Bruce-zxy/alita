const toTransformAreaTreeProps = (data, map) => data.map(node => {
  let node_object = {
    label: node[map.key || 'key'],
    value: node[map.value || 'value']
  }
  if (node.children) {
    node_object[map.children || 'children'] = toTransformAreaTreeProps(node.children, map);
  }
  return node_object;
});

export default toTransformAreaTreeProps;