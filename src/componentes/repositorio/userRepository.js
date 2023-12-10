import {FirebaseContext} from '../../firebase';
import { collection, addDoc, getDocs,doc,getDoc,updateDoc } from "firebase/firestore"; 
import { useContext } from "react";


const useUserRepository = () => {
  //Context con las operaciones de firebase 
  const {firebase} = useContext(FirebaseContext);
  const db = firebase.db;

const registerUser = async (user) => {
  try {
    await addDoc(collection(db, "usuarios"),user);
  } catch (error) {
    console.error('Error al registrar el usuario:', error.message);
  }
};

const getUser = async (user) => {
    try {
        const users = await getUsers()

        const userReturn = users.filter((x) => x.email.match(user.email));

        if(userReturn.length>0){
            return userReturn
        }

        return null

    }catch (error){

    }
}

const findUser = async (email) => {
  try{
    const users = await getUsers()
    
    if(users.length>0){
      return users.find(x=>x.email === email)
    }
    return null;

  }catch(error){
    console.error('Error al obtener el usuario', error.message);
  }


}


const updateUser = async (email, newPassword) => {
  try {
    const userReturn = await findUser(email);

    if (userReturn) {
      const userRef = doc(db, 'usuarios', userReturn.id);

      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          password: newPassword,
          confirmPassword: newPassword
        });

        return true;
      } else {
        console.error('El documento no existe para el usuario con email:', email);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('Error al actualizar el usuario', error.message);
    return false;
  }
};


const getUsers = async () => {
    try {
      const usuariosCollection =  await getDocs(collection(db, "usuarios"));
      

      const usuarios = usuariosCollection.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          date: data.date.toDate(),
          answer: data.answer
        };
      });

      return usuarios;

    } catch (error) {
      console.error('Error al obtener usuarios', error.message);
      throw error;
    }
  };

const loginUser = async (user) => {
  try {

    const userReturn = await getUser(user)

    if(userReturn.length>0){
        return true
    }

    return false

  } catch (error) {
    
  }
};

// Función para cerrar sesión
const logoutUser = async () => {
  try {

  } catch (error) {
    
  }
};

// Función para obtener información del usuario actual
const getCurrentUser = () => {
  //this.user
};

// Función para eliminar el usuario actual
const deleteUser = async () => {
    //This user
  try {
    
  } catch (error) {
    
  }
};

return {
    registerUser,getUsers,getUser,loginUser,updateUser
  };

}
export default useUserRepository;