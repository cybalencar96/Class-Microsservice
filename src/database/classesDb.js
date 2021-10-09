import Id from "../Id/index.js"
import { validateUser,getUser,updateUserClasses } from "../services/usersApi.js";

export default function makeClassesDb({makeDb}) { 
    return Object.freeze({
        findAll,
        findByClassId,
        findByTeacherId,
        findBySubject,
        findByTeacherAndSubject,
        insert,
        deleteClass,
        updateClass,
        classReservation
    });

    async function findAll() {
        const db = await makeDb();
        const result = await db.collection('classes').find().sort({class: 1}).toArray();
        if (result.length === 0) {
            return null;
        }
        return result;
    }

    async function findByClassId(searchInfo) {
        const db = await makeDb()
        if (Array.isArray(searchInfo)) {
            let partialResult = {};
            let result = [];

            await Promise.all(searchInfo.map(async (_id) => {
                partialResult = await db.collection('classes').find({_id: _id});
                const found = await partialResult.toArray();
                result.push(found[0]);                
            }));

            if (result.length === 0){
                return null
            }
            return result;
        }

        const result = await db.collection('classes').find({ _id: searchInfo }).toArray();
        if (!result[0]) {
            return null
        }
        return result[0]
    }

    async function findByTeacherId(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({teacherId: searchInfo}).toArray();
        if (result.length === 0) {
            return null
        }
        return result;
    }

    async function findBySubject(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({subject: {$regex: searchInfo, $options: "$i"}}).sort({subject:1}).toArray();
        if (result.length === 0) {
            return null
        }
        return result;
    }

    async function findByTeacherAndSubject(searchInfo) {
        const db = await makeDb();
        const result = await db.collection('classes').find({teacherId: searchInfo.teacherId, subject: searchInfo.subject}).toArray();
        if (result.length === 0) {
            return null
        }
        return result[0];
    }

    async function insert({...classs }) {
        const db = await makeDb();
        const newClass = {
            _id: classs.getId(),
            teacherId: classs.getTeacherId(),
            createdAt: classs.getCreatedAt(),
            maxStudents: classs.getMaxStudents(),
            price: classs.getPrice(),
            subject: classs.getSubject(),
            classDates: classs.getClassDates(),
            students: classs.getStudents()
        }

        try {
            const updateRes = await updateUserClasses(newClass.teacherId,'add','teaching',newClass._id)
        }
        catch (err) {
            throw new Error (`teacherId ${err.response.data.body.error}`)
        }

        const result = await db.collection('classes').insertOne(newClass)
        
        const classInserted = await db.collection('classes').find({_id:result.insertedId}).toArray();
        return classInserted[0];
    }

    async function deleteClass(classId, userId) {
        const db = await makeDb();
        const classs = await db.collection('classes').find({"_id": classId}).toArray();
        const allClasses = await db.collection('classes').find().sort({subject:1}).toArray();

        //const updateTeacherRes = 
        try {
            let userRes = await updateUserClasses(classs[0].teacherId,'remove','teaching',classId)
        }
        catch (err) {
            throw new Error (`teacherId ${err.response.data.body.error}`)
        }

        let idx;
        try {
            for (let i = 0; i < classs[0].students.length; i++) {
                idx = i;
                let userRes = await updateUserClasses(classs[0].students[i],'remove','learnings',classId)
            }
        } 
        catch (err) {
            //caso dê erro, readiciona todos que tinham sido excluidos antes do erro
            if (idx > 0 ) {
                for (let i = 0; i < idx; i++) {
                    updateUserClasses(classs[0].students[i],'add','learnings',classId)
                }
            }
            throw new Error (`On learnings array,  studentId ${err.response.data.body.error}`)
        }
        

        const { acknowledged, deletedCount } = await db.collection('classes').deleteOne({_id: classId});
        const allClasses2 = await db.collection('classes').find().sort({subject:1}).toArray();
        

        if (acknowledged && deletedCount > 0) {
            return {
                isDeleted: true,
                text: "Class is deleted.",
                body: allClasses2
            }
        }

        if (acknowledged && deletedCount === 0) {
            return {
                isDeleted: false,
                text: "Class doesn't exists. It may has been deleted already.",
                body: allClasses2
            }
        }
        if (!acknowledged) {
            return {
                isDeleted: false,
                text: "Unknown error has occured on gateway",
                body: allClasses2
            }
        }
    }

    async function updateClass(editedClass) {
        const db = await makeDb();

        const updateDoc = {
            $set: {
                teacherId: editedClass.getTeacherId(),
                maxStudents: editedClass.getMaxStudents(),
                price: editedClass.getPrice(),
                subject: editedClass.getSubject(),
                classDates: editedClass.getClassDates()
            }
        }

        const {
            acknowledged,
            modifiedCount,
            matchedCount
        } = await db.collection('classes').updateOne({_id: editedClass.getId()},updateDoc)
        
        const newEditedClass = await db.collection('classes').find({_id: editedClass.getId()}).toArray();
        
        if (modifiedCount === 1) {
            return {
                isModified: true,
                text: "Class update successful",
                editedClass: newEditedClass[0]
            }
        } else if (matchedCount === 1) {
            return {
                isModified: false,
                text: "Class found but not updated, no difference found",
                editedClass: newEditedClass[0]
            }
        } else {
            return {
                isModified: false,
                text: "Class not found",
                editedClass: null
            }
        }
    }

    //"O" OPEN CLOSED PRINCIPLE - Função se extendeu para atividades de reserva
    async function classReservation(operation,userId,classId) {
        const db = await makeDb()
        const classes = db.collection('classes')
        const classs = await classes.findOne({"_id":classId});

        //VERIFICACAO DE USER DEVE SER FEITA PELO MICROSSERVIÇO USERS
        try {
            const res = await getUser(userId)
        }
        catch (err) {
            return {
                isBooked: false,
                text: `[Error] - ${err.response.data.body}`,
                bookedClass: null
            }
        }
        
        let result;
        let bookedStudent;

        bookedStudent = classs.students.find(student => student === userId );

        if (operation === "book") {

            // ATUALIZAÇÃO DA BASE ALUNO DEVE SER CHAMADA VIA API DO MICROSSERVIÇO USER
            try {
                const updateRes = await updateUserClasses(userId,'add','learnings',classId)
            }
            catch (err) {
                throw new Error (err.response.data.body)
            }

            const updateClassDoc = {
                $push: {
                    students: userId
                }
            }

            const {modifiedCount} = await classes.updateOne({"_id":classId},updateClassDoc)
            if (modifiedCount > 0) {
                const updatedClass = await classes.find({"_id": classId}).toArray()
                return {
                    isBooked: true,
                    text: "booking successfull",
                    bookedClass: updatedClass[0]
                }
            } else {
                return {
                    isBooked: false,
                    text: "booking failed",
                    bookedClass: null
                }
            }

        } else if (operation === "unbook") {
            try {
                const updateRes = await updateUserClasses(userId,'remove','learnings',classId)   
            }
            catch (err) {
                return {
                    isDeleted: false,
                    text: `[Error] - ${err.response.data.body}`,
                    unbookedClass: null
                }
            }

            const updateClassDoc = {
                $pull: {
                    students: userId
                }
            }
    
            result = await classes.updateOne({"_id":classId},updateClassDoc).catch(err => console.log(err))
            .then(async res => {
                const updatedClass = await classes.find({"_id":classId}).toArray();
                return {
                    isUnbooked: true,
                    text: "unbooking successfull",
                    unbookedClass: updatedClass[0]
                }                
            })
            .catch(err => {
                console.log(err);
                return {
                    isUnbooked: false,
                    text: "Error on unbooking, try again later",
                    unbookedClass: err
                }
            });
    
            return result;
        }
    }
}