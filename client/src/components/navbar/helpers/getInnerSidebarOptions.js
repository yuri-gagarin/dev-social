export default function (leftInnerSidebarData, target) {
  const testString = target ? target.toLowerCase() : null;
  if(testString) {
    for (let key in leftInnerSidebarData) {
      if (key === testString) {
        return leftInnerSidebarData[key];
      }
    }
  }
  else {
    return [];
  }
};