import {db} from '../../../../../Firebase'

const checkCollaborator = async docId => {
    const collaborator = await db.collection('collaborators').doc(docId).get();
    return collaborator.exists;
}

export default checkCollaborator