import classesDb from "../database/index.js"
import makeAddClass from "./addClass.js"
import makeListClasses from "./listClasses.js";
import makeRemoveClass from "./removeClass.js";
import makeEditClass from "./editClass.js";
import makeRemoveReserveClass from './removeReserveClass.js';
import makeReserveClass from './reserveClass.js';

const addClass = makeAddClass({classesDb});
const listClasses = makeListClasses({classesDb});
const removeClass = makeRemoveClass({classesDb});
const editClass = makeEditClass({classesDb});
const reserveClass = makeReserveClass({classesDb});
const removeReserveClass = makeRemoveReserveClass({classesDb});

const classService = Object.freeze({
    addClass,
    listClasses,
    removeClass,
    editClass,
    reserveClass,
    removeReserveClass
})

export default classService
export {addClass, listClasses, removeClass, editClass,reserveClass,removeReserveClass}
