//Minha entidade
export default function buildMakeClass({ Id }) {
    return function makeClass ({
        teacherId,
        maxStudents = 20,
        price = 0,
        id = Id.makeId(),
        createdAt = Date.now(),
        subject,
        students = [],
        classDates
    }) {
        if (!Id.isValidId(id)) {
            throw new Error('Class must have valid id');
        }
        if (!teacherId) {
            throw new Error('Class must have a teacherId')
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
                console.log(classDate.weekday,classDate.hasClass,classDate.startHour,classDate.endHour)
                if (!classDate.weekday || !classDate.hasOwnProperty('hasClass')  || !classDate.startHour || !classDate.endHour) {
                    throw new Error('classDate objects must have attributes weekday, hasClass, startHour and endHour')
                }
            })
        }

        return Object.freeze({
            getTeacherId: () => teacherId,
            getCreatedAt: () => createdAt,
            getId: () => id,
            getMaxStudents: () => maxStudents,
            getPrice: () => price,
            getSubject: () => subject,
            getClassDates: () => classDates,
            getStudents: () => students
        })
    }
}

function isHexa(str) {
    const hexa = "0123456789abcdef";
    for (let i = 0; i < str.length; i++) {
        if (!hexa.includes(str[i])) {
            return false;
        }
    }
    return true;
}