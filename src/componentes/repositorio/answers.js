import {FirebaseContext} from '../../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useContext } from "react";

const useQuestionRepository = () => {

    //Context con las operaciones de firebase 
    const { firebase } = useContext(FirebaseContext);
    const db = firebase.db;

    const getQuestions = async () => {
        const questionsCollection  = collection(db,'questions');
        const questionsSnapshot  = await getDocs(questionsCollection);
        try {
            const questions = questionsSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  option: data.option,
                  label: data.label,
                };
              });
              return questions;
        } catch (error) {
           console.error('Error al cargar las preguntas:', error.message);
        }
      };
    return {
        getQuestions
    };
}

export default useQuestionRepository