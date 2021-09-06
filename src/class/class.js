//Minha entidade
export default function buildMakeClass({ Id }) {
    return function makeClass ({
        teacherId,
        maxStudents = 20,
        price = 0,
        _id = Id.makeId(),
        createdAt = Date.now(),
        subject,
        students = [],
        classDates
    }) {
        if (!Id.isValidId(_id)) {
            throw new Error('Class must have valid id');
        }
        if (!teacherId) {
            throw new Error('Class must have a teacherId')
        }
        if (maxStudents < 1) {
            throw new Error ("maxStudents can't be less than 1.")
        }
        if (!Id.isValidId(teacherId)) {
            //TODO: verificar se o teacherId existe
            throw new Error('teacherId must have valid id');
        }
        if (!subject || subject.length < 2) {
            throw new Error('Class must have subject. Subject must have more than 2 characteres')
        }
        if (classDates.length === 0 || classDates === null || classDates === undefined) {
            throw new Error('Class must have class dates objects')
        } else {
            classDates.map(classDate => {
                if (!classDate.weekday || !classDate.hasOwnProperty('hasClass')  || !classDate.startHour || !classDate.endHour) {
                    throw new Error('classDate objects must have attributes weekday, hasClass, startHour and endHour')
                }
            })
        }

        return Object.freeze({
            getTeacherId: () => teacherId,
            getCreatedAt: () => createdAt,
            getId: () => _id,
            getMaxStudents: () => maxStudents,
            getPrice: () => price,
            getSubject: () => subject,
            getClassDates: () => classDates,
            getStudents: () => students
        })
    }
}