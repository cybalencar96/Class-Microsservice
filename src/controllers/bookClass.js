export default function makeBookClass ({reserveClass, Id}) {
    return async function bookClass (httpRequest) {
        const classId  = httpRequest.params.id
        const { userId } = httpRequest.body

        if (!Id.isValidId(classId) || !classId) {
            throw new Error('class Id is not valid');
        }
        if (!Id.isValidId(userId) || !userId) {
            throw new Error('user Id is not valid');
        }

        try {
            const {isBooked, text, bookedClass} = await reserveClass(userId, classId);
            //TODO: chamar 
            return {
                statusCode: isBooked ? 200 : 401,
                text,
                bookedClass
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