import classesDb from "../database/index.js"
import makeAddClass from "./addClass.js"
import makeListClasses from "./listClasses.js";
import makeRemoveClass from "./removeClass.js";

const addClass = makeAddClass({classesDb});
const listClasses = makeListClasses({classesDb});
const removeClass = makeRemoveClass({classesDb});
//const editClass = makeEditClass({classesDb});

const classService = Object.freeze({
    addClass,
    listClasses,
    removeClass
    //editClass,
})

export default classService
export {addClass, listClasses, removeClass}
