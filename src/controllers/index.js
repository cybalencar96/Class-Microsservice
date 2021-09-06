import classService from "../useCases/index.js";
import makeGetClasses from "./getClasses.js";
import makePostClass from "./postClass.js";
import Id from "../Id/index.js";
import makeDeleteClass from "./deleteClass.js";

const {
    addClass,
    listClasses,
    removeClass
} = classService

const postClass = makePostClass({ addClass })
const getClasses = makeGetClasses({ listClasses, Id })
const deleteClass = makeDeleteClass({ removeClass, Id })

const classController = Object.freeze({
    postClass,
    getClasses,
    deleteClass
});

export default classController
export {
    postClass,
    getClasses,
    deleteClass
}