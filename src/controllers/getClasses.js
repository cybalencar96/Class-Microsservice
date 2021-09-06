import Id from "../Id/index.js"

export default function makeGetClasses({ listClasses, Id }) {
    return async function getClasses(httpRequest) {
        const { type, ...searchInfo } = httpRequest.body
        const headers = {
            'Content-Type': 'application/json'
        }
        try {
            let list;
            if (type === null || type === undefined){
                list = await listClasses();
                console.log(list);
            }
            if (type === "byClassId") {
                if(!isClassIdValid(searchInfo)) {
                    throw new Error('Class Id(s) passed on GET request is(are) not valid.')
                }
                list = await listClasses(type,searchInfo)
            }
            if (type === "byTeacherId"){
                if (!Id.isValidId(searchInfo)) {
                    throw new Error('Teacher Id passed on GET request is not valid')
                }
                list = await listClasses(type,searchInfo);
            }
            if (type === "byClassName") {
                if(!isClassNameValid(searchInfo)) {
                    throw new Error('Class Name must be a string with more than 2 characteres');
                }
                list = await listClasses(type,searchInfo);
            }
            return {
                headers,
                statusCode: 200,
                body: list
            }
        }
        catch (e) {
            console.log(e)
            return {
                headers,
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}

function isClassIdValid(searchInfo) {
    if (typeof(searchInfo) !== "string" && !Array.isArray(searchInfo)) {
        return false
    }
    if (typeof(searchInfo) === "string") {
        if(!Id.isValidId(searchInfo)) {
            return false
        }
    }
    if (Array.isArray(searchInfo)) {
        searchInfo.map(id => {
            if (!Id.isValidId(id)) {
                return false
            }
        })
    }

    return true;
}

function isClassNameValid(searchInfo) {
    if (typeof(searchInfo) !== 'string' || searchInfo.length < 2) {
        return false;
    }
}