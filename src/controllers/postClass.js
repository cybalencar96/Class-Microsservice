export default function makePostClass ({ addClass }) {
    return async function postClass (httpRequest) {
        try {
            const {...classInfo} = httpRequest.body
            const posted = await addClass({...classInfo})

            return {
                statusCode: 201,
                body: { posted }
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