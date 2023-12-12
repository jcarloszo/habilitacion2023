import {FirebaseContext} from '../../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useContext } from "react";

const useLayers = () => {
    //Context con las operaciones de firebase 
    const { firebase } = useContext(FirebaseContext);
    const db = firebase.db;

    const getLayers = async  () => {
        const layersCollection = collection(db,'layers');
        const layersSnapshot = await getDocs(layersCollection);

        try{
            const layers = layersSnapshot.docs.map((doc)=> {
                const data = doc.data();

                return {
                    url: data.url,
                    type: data.type
                }

            })

            return layers;

        }catch(error){
            console.error('Error al obtener los tipos de capas:',error.message);
        }


    }

    return{
        getLayers  
    };
}

export default useLayers;