export default function makeDeleteClass ({removeClass, Id}) {
    return async function deleteClass (httpRequest) {
        const { classId }  = httpRequest.body      
        
        try {
            if (!Id.isValidId(classId) || !classId) {
                throw new Error('class Id is not valid');
            }
            const {isDeleted, text, body} = await removeClass(classId);
            return {
                statusCode: isDeleted ? 200 : 401,
                text,
                body
            }
        }
        catch (e) {
            console.log(e)
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}