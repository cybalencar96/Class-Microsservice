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
        findAndDeleteClass,
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

        const result = await db.collection('classes').find({ _id: searchInfo })
        const found = await result.toArray();
        if (found.length === 0) {
            return null
        }
        return found[0]
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
            return {
                isCreated: false,
                text: "Error",
                body: `teacherId ${err.response.data.body.error}`
            }
        }

        const result = await db.collection('classes').insertOne(newClass)
        
        const classInserted = await db.collection('classes').find({_id:result.insertedId}).toArray();
        return classInserted[0];
    }

    async function findAndDeleteClass(classId) {
        const db = await makeDb();
        const classs = await db.collection('classes').find({"_id": classId}).toArray();
        const allClasses = await db.collection('classes').find().sort({subject:1}).toArray();

        if (!classs[0]) {
            return {
                isDeleted: false,
                text: "Class doesn't exists. It may has been deleted already.",
                body: allClasses
            }
        }
        //const updateTeacherRes = 
        try {
            let userRes = await updateUserClasses(classs[0].teacherId,'remove','teaching',classId)
        }
        catch (err) {
            return {
                isDeleted: false,
                text: "Error",
                body: `teacherId ${err.response.data.body.error}`
            }
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

            return {
                isDeleted: false,
                text: "Error",
                body: `On learnings array,  studentId ${err.response.data.body.error}`
            }
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
                _id: editedClass.getId(),
                subject: editedClass.getSubject(),
                students: editedClass.getStudents(),
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
                body: newEditedClass
            }
        } else if (matchedCount === 1) {
            return {
                isModified: false,
                text: "Class found but not updated, no difference found",
                body: newEditedClass
            }
        } else {
            return {
                isModified: false,
                text: "Class not found",
                body: null
            }
        }
    }

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
                text: "Error",
                body: err.response.data.body
            }
        }
        
        let result;
        let bookedStudent;
        if (!classs){
            return {
                isBooked: false,
                text: "Class not found",
                body:null
            }
        }

        bookedStudent = classs.students.find(student => student === userId );

        if (operation === "book") {
            if (classs.teacherId === userId) {
                return {
                    isBooked: false,
                    text: "You are the teacher of this class",
                    body: classs
                }
            }
            if (classs.students.length < classs.maxStudents){
                if (!!bookedStudent) {
                    return {
                        isBooked: false,
                        text: "Student is already in this class",
                        body: classs
                    }
                }

                // ATUALIZAÇÃO DA BASE ALUNO DEVE SER CHAMADA VIA API DO MICROSSERVIÇO USER
                try {
                    const updateRes = await updateUserClasses(userId,'add','learnings',classId)
                }
                catch (err) {
                    return {
                        isBooked: false,
                        text: "Error",
                        body: err.response.data.body
                    }
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
                        body: updatedClass[0]
                    }
                } else {
                    return {
                        isBooked: false,
                        text: "booking failed",
                        body: null
                    }
                }
                
            }
            else {
                return {
                    isBooked: false,
                    text: "booking failed, class is full.",
                    body: classs
                }
            }
        } else if (operation === "unbook") {
            // se o estudante não tiver bookado ainda, retorna erro
            if (!bookedStudent) {
                return {
                    isUnbooked: false,
                    text: "Student is not in this class",
                    body: null
                }
            }

            try {
                const updateRes = await updateUserClasses(userId,'remove','learnings',classId)   
            }
            catch (err) {
                return {
                    isDeleted: false,
                    text: "Error",
                    body: err.response.data.body
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
                    body: updatedClass[0]
                }                
            })
            .catch(err => {
                console.log(err);
                return {
                    isUnbooked: false,
                    text: "Error on unbooking, try again later",
                    body: err
                }
            });
    
            return result;
        }
    }
}