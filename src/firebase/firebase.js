import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from './config'


class Firebase {
    constructor(){
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }
}

const firebase = new Firebase();

export default firebase;