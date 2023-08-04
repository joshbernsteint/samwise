/** 
 * @param {*} element: Variable to be searched for in `list`
 * @param {*} list: List that will be searched for `element`
 * @returns: `true` if `element` is found in `list`, `false` otherwise
 */
export function isIn(element,list){
    for (let index = 0; index < list.length; index++) {
        if(element === list[index]){
            return true;
        }
    }
    return false
}