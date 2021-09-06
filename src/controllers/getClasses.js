import Id from "../Id/index.js";

export default function makeGetClasses({ listClasses, Id }) {
    return async function getClasses(httpRequest) {
        const { type, searchInfo } = httpRequest.body
        console.log(httpRequest.body);
        const headers = {
            'Content-Type': 'application/json'
        }
        try {
            let list;
            let calculated = false

            if ((type === null || type === undefined) && !searchInfo){
                list = await listClasses();
                calculated = true;
            }
            if (type === "byClassId") {
                if(!isClassIdValid(searchInfo)) {
                    throw new Error('Class Id(s) passed on GET request is(are) not valid.')
                }
                list = await listClasses(type,searchInfo);
                calculated = true;
            }
            if (type === "byTeacherId"){
                if (!Id.isValidId(searchInfo)) {
                    throw new Error('Teacher Id passed on GET request is not valid')
                }
                list = await listClasses(type,searchInfo);
                calculated = true;
            }
            if (type === "bySubject") {
                if(!isClassNameValid(searchInfo)) {
                    throw new Error('Subject must be a string with more than 2 characteres');
                }
                list = await listClasses(type,searchInfo);
                calculated = true;
            }
            if (!calculated) {
                list = {
                    text: "Bad Request",
                    description: "Invalid parameters on GET classes. Verify documentation"
                }
            }
            return {
                headers,
                statusCode: calculated ? 200 : 400,
                body: list ? list : []
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
            console.log("entrei 2")
            return false
        }
    }
    if (Array.isArray(searchInfo)) {
        searchInfo.map(id => {
            if (!Id.isValidId(id)) {
                console.log("entrei 3")
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
    return true;
}