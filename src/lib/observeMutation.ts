export default function observeMutation(data: {
    targetSelector: string,
    hookInterval: number,
    itemFn: MutationCallback
}) {
    const observer = new MutationObserver(data.itemFn);
    function addFunctionOnTarget(){
        let target = document.querySelector(data.targetSelector);
        if(!target){ return setTimeout(addFunctionOnTarget, data.hookInterval); }
        
        observer.observe(target, { attributes: true, childList: true, subtree: true, characterData:true });
    }
    addFunctionOnTarget()
}