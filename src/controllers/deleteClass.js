export default function makeDeleteClass ({removeClass, Id}) {
    return async function deleteClass (httpRequest) {
        const { classId, userId }  = httpRequest.body      
        
        try {
            if (!Id.isValidId(classId) || !classId) {
                throw new Error('class Id is not valid');
            }

            if (!Id.isValidId(userId) || !userId) {
                throw new Error('userId is not valid');
            }

            const {isDeleted, text, body} = await removeClass(classId,userId);
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