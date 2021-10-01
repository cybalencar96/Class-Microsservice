export default function makeUnbookClass ({removeReserveClass, Id}) {
    return async function unbookClass (httpRequest) {
        const classId = httpRequest.params.id
        const { userId }  = httpRequest.body      
        
        try {
            if (!Id.isValidId(classId)) {
                throw new Error('class Id is not valid');
            }
            if (!Id.isValidId(userId) || !userId) {
                throw new Error('user Id is not valid');
            }
            const {isUnbooked, text, body} = await removeReserveClass(userId, classId);

            return {
                statusCode: isUnbooked ? 200 : 401,
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