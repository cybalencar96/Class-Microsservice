import classesDb from "../database/index.js"
import makeAddClass from "./addClass.js"
import makeListClasses from "./listClasses.js";

const addClass = makeAddClass({classesDb});
const listClasses = makeListClasses({classesDb});
//const editClass = makeEditClass({classesDb});

const classService = Object.freeze({
    addClass,
    listClasses
    //editClass,
})

export default classService
export {addClass, listClasses}
