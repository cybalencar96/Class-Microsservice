export default function makePutClass({editClass, Id}) {
    return async function putClass(httpRequest) {

        try {
            const {...classInfo} = httpRequest.body;
            const {
                teacherId,
                maxStudents,
                price,
                _id,
                subject,
                classDates
            } = classInfo

            if (!Id.isValidId(_id) || !Id.isValidId(teacherId)) {
                throw new Error ('Class id or teacher Id is not valid.')
            } 
            if (!maxStudents) {
                throw new Error ('ClassInfo must have maxStudents attribute and must be greater than 1')
            }
            if (price !== 0 && (price < 0 || !price)) {
                throw new Error ('ClassInfo must have price attribute and it must be >= 0')
            }
            if (!subject) {
                throw new Error ('ClassInfo must have subject attribute')
            }
            if (!classDates) {
                throw new Error ('ClassInfo must have classDates attribute')
            }

            const {isModified, text, body} = await editClass({...classInfo});
            return {
                statusCode: isModified ? 200 : 401,
                text,
                body,
            };
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