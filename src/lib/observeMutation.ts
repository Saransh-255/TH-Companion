export default function observeMutation(data: {
    targetSelector: string,
    hookInterval: number,
    itemFn: MutationCallback,
    settings: {
      attributes: boolean,
      childList: boolean,
      subtree: boolean,
      characterData: boolean
    }
}) {
  const observer = new MutationObserver(data.itemFn);
  function addFunctionOnTarget() {
    let target = document.querySelector(data.targetSelector);
    if (!target) return setTimeout(addFunctionOnTarget, data.hookInterval);
    
    observer.observe(target, { 
      attributes: data.settings.attributes, 
      childList: data.settings.childList, 
      subtree: data.settings.subtree, 
      characterData: data.settings.characterData 
    });
  }

  addFunctionOnTarget();
}