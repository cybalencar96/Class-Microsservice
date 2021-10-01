import classService from "../useCases/index.js";
import makeGetClasses from "./getClasses.js";
import makePostClass from "./postClass.js";
import Id from "../Id/index.js";
import makeDeleteClass from "./deleteClass.js";
import makePutClass from "./putClass.js";
import makeBookClass from "./bookClass.js";
import makeUnbookClass from "./unbookClass.js";

const {
    addClass,
    listClasses,
    removeClass,
    editClass,
    reserveClass,
    removeReserveClass,
} = classService

const postClass = makePostClass({ addClass })
const getClasses = makeGetClasses({ listClasses, Id })
const deleteClass = makeDeleteClass({ removeClass, Id })
const putClass = makePutClass ({ editClass, Id })
const bookClass = makeBookClass ({ reserveClass, Id })
const unbookClass = makeUnbookClass ({ removeReserveClass, Id })

const classController = Object.freeze({
    postClass,
    getClasses,
    deleteClass,
    putClass,
    bookClass,
    unbookClass,
});

export default classController
export {
    postClass,
    getClasses,
    deleteClass,
    putClass,
    bookClass,
    //unbookClass,
}