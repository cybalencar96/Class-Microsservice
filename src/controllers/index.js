import { addClass } from "../useCases/index.js";
import { listClasses } from "../useCases/index.js";
import makeGetClasses from "./getClasses.js";
import makePostClass from "./postClass.js";
import Id from "../Id/index.js";

const postClass = makePostClass({ addClass })
const getClasses = makeGetClasses({ listClasses, Id })

const classController = Object.freeze({
    postClass,
    getClasses
});

export default classController
export {
    postClass,
    getClasses
}