import {FirebaseContext} from '../../firebase';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { useContext } from "react";


const usePoints = () =>{

    //Context con las operaciones de firebase 
    const { firebase } = useContext(FirebaseContext);
    const db = firebase.db;

    const getFacultades = async () => {
        const facultadesCollection = collection(db,'facultades');
        const facultadesSnapshot = await getDocs(facultadesCollection);

        try{
            //TODO:
            const facultades = facultadesSnapshot.docs.map((doc)=>{
                const data = doc.data();
                
                return { 
                    punto:{
                        latitud: data.punto._lat,
                        longitud: data.punto._long
                    },
                    description: data.description
                }
                
            })

            return facultades;

        }catch(error){
            console.error('Error al obtener las facultades:',error.message)
        }

    };


    const getMuseos = async () => {
        const museosCollection = collection(db,'museos');
        const museosSnapshot = await getDocs(museosCollection);

        try{
            //TODO:
            const museos = museosSnapshot.docs.map((doc)=>{
                const data = doc.data();
                
                return { 
                    punto:{
                        latitud: data.punto._lat,
                        longitud: data.punto._long
                    },
                    description: data.description
                }
                
            })

            return museos;
        }catch(error){
            console.error('Error al obtener los museos:',error.message)
        }

    };

    const getHospitales = async () => {
        const hospitalesCollection = collection(db,'hospitales');
        const hospitalesSnapshot = await getDocs(hospitalesCollection);

        try{
            //TODO:
            const hospitales = hospitalesSnapshot.docs.map((doc)=>{
                const data = doc.data();
                
                return { 
                    punto:{
                        latitud: data.punto._lat,
                        longitud: data.punto._long
                    },
                    description: data.description
                }
                
            })

            return hospitales;
        }catch(error){
            console.error('Error al obtener los hospitales:',error.message)
        }

    };


    const getParks = async () => {
        const parksCollection = collection(db,'parks');
        const parksSnapshot = await getDocs(parksCollection);

        try{
            //TODO:
            const parks = parksSnapshot.docs.map((doc)=>{
                const data = doc.data();
                
                return { 
                    punto:{
                        latitud: data.punto._lat,
                        longitud: data.punto._long
                    },
                    description: data.description
                }
                
            })

            return parks;
        }catch(error){
            console.error('Error al obtener los parques:',error.message)
        }

    };


    return{
        getFacultades,getMuseos,getHospitales,getParks
    };

}

export default usePoints;