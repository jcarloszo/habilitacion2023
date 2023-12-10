import React, { useEffect, useState } from 'react';
import Header from "../Header/header.tsx";
import useUserRepository from '../repositorio/userRepository.js';
import useQuestionRepository from '../repositorio/answers.js';
import Usuario from '../../models/User/User.ts';
import { Link, useNavigate } from "react-router-dom";


const ForgotPassword = () => {

  const navigate = useNavigate();
  const [statusGeneral,setStatusGeneral] = useState(true)
  const [email, setEmail] = useState(''); 
  const [users, setUsers] = useState<Usuario[]>([]);
  const [questions, setQuestions] = useState<{ option: any; label: any; }[]>([]);
  const [question,setQuestion] = useState<{ option: any; label: any; }>();
  const [status,setStatus] = useState(false)
  const [user,setUser] = useState<Usuario>();
  const [response,setResponse] = useState('')
  const [userStatus,setUserStatus] = useState(false)
  const [statusUpdate,setStatusUpdate] = useState(false)
  const [newPassword,setNewPassword] = useState('')
  const [confirmNewPassword,setConfirmNewPassword] = useState('')
  const [statusVolver,setStatusVolver] = useState(false);
  const [statusMessageError,setStatusMessageError] = useState(false);
  const [statusMessageRecuperacion,setStatusMessageRecuperacion] = useState(false);
  const [statusMessageCoincide,setStatusMessageCoincide] = useState(false);

  const usersRepository = useUserRepository();
  const questionRepository = useQuestionRepository();

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const u = await usersRepository.getUsers();
            const q = await questionRepository.getQuestions();
            setQuestions(q);
            setUsers(u);
          } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
          }
        };
      
        fetchUsers();
      }, []);


      const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(x => x.email.toLowerCase() === email.toLowerCase());
        if (user) {
            setUser(user);
            const question = questions.find(y => y.option == user?.answer.option)
            setQuestion(question);
            setStatus(true)
            setStatusGeneral(false)
            setStatusMessageError(false)
        } else {
            setStatus(false)
            setStatusMessageError(true)
        }
      };

      const handleResponse = (e) => {
        const response = e.target.value.toLocaleUpperCase()
        setResponse(response);
      };

      const handleIdentidad = (e) => {
        e.preventDefault();
        if(user?.answer.response.trim().toLocaleUpperCase() === response.trim()){
            setUserStatus(true)
            setStatus(false)
            setStatusMessageRecuperacion(false);
        }else{
            setStatusMessageRecuperacion(true);
        }

      };

      const handleNewPasswordChange = (e) => {
        e.preventDefault();
        const newPassword = e.target.value.toLocaleUpperCase()
        setNewPassword(newPassword);
      }

      const handleConfirmPasswordChange = (e) => {
        e.preventDefault();
        const confirmNewPassword = e.target.value.toLocaleUpperCase()
        setConfirmNewPassword(confirmNewPassword);
      }

      const handleEnviar = async (e) => {
        e.preventDefault();
        //Comprobar que las contraseñas sean las mismas
        if(newPassword.toLocaleUpperCase().trim() === confirmNewPassword.toLocaleUpperCase().trim()){
            const response = await usersRepository.updateUser(user?.email,newPassword)
            if(response){
                setStatusMessageCoincide(false);
                console.log("Modificado con exito")
                setStatusUpdate(response);
                setStatus(false)
                setUserStatus(false)
                setStatusGeneral(false)
                setStatusVolver(true);

                setTimeout(() => {
                    navigate('/')
                }, 6000);
            }
        }else{
            setStatusMessageCoincide(true);
        }
       
      }




  return (
    <>
    
          <div className="mb-2">
              <div className="form mb-4">
                  <h2 className="text-4xl font-bold p-4 text-white mb-5 rounded-md">Recuperar Contraseña</h2>
                  <div className="inputs animate__animated animate__backInRight">
                      <label htmlFor="email" className="text-white block text-center mb-5">
                          Correo Electrónico
                      </label>
                      <input
                          id="email"
                          className="mb-5 border text-center rounded-md bg-blue-100 py-2 px-4 w-full focus:outline-none focus:border-blue-500"
                          placeholder="user@user.com"
                          type="email"
                          disabled={status}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div className="text-center">
  {statusGeneral && (
    <button
      type="submit"
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleSubmit}
    >
      Enviar Solicitud
    </button>
  )}
</div>

{status && (
  <div className="text-white text-center mt-3 p-3">
    <p>✅ Usuario encontrado...</p>

    {/* Agregar el select y el textbox aquí */}
    <div className="mt-3">
      <label htmlFor="option" className="text-white block mb-1">
        Pregunta de Recuperación
      </label>
      <select
        id="option"
        className="mb-2 border text-center rounded-md bg-blue-100 text-black py-2 px-4 w-full focus:outline-none focus:border-blue-500"
      >
        <option key={question?.option}>{question?.label}</option>
      </select>

      <label htmlFor="response" className="text-white block mb-1">
        Respuesta de Recuperación
      </label>
      <input
        id="response"
        onChange={handleResponse}
        className="mb-2 border text-center rounded-md bg-blue-100 py-2 px-4 w-full focus:outline-none focus:border-blue-500 text-black"
        placeholder="Escribe tu respuesta"
        type="text"
      />
      <div className="text-center">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleIdentidad}
        >
          Validar Identidad
        </button>
      </div>
    </div>
  </div>
)}

{statusMessageError&& (
  <div className="text-red-500 text-center mt-3 p-3">
    ❌ Usuario no encontrado. Por favor, verifica tu información.
  </div>
)}

{userStatus && (
  <div className="text-white text-center mb-2">
    <p>✅ Identidad Confirmada</p>
    
    {/* Agregar campos para nueva contraseña */}
    <label htmlFor="newPassword" className="text-white block mb-1 p-2">
      Nueva Contraseña
    </label>
    <input
      id="newPassword"
      onChange={handleNewPasswordChange}
      className="mb-2 border text-center rounded-md bg-blue-100 py-2 px-4 w-full focus:outline-none focus:border-blue-500 text-black"
      placeholder="Nueva contraseña"
      type="password"
    />

    {/* Agregar campos para confirmar contraseña */}
    <label htmlFor="confirmPassword" className="text-white block mb-1">
      Confirmar Contraseña
    </label>
    <input
      id="confirmPassword"
      onChange={handleConfirmPasswordChange}
      className="mb-2 border text-center rounded-md bg-blue-100 py-2 px-4 w-full focus:outline-none focus:border-blue-500 text-black"
      placeholder="Confirmar contraseña"
      type="password"
    />

    {/* Agregar botón para enviar */}
    <button
      type="submit"
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleEnviar}
    >
      Enviar
    </button>
  </div>
)}

{statusMessageRecuperacion&& (
  <div className="text-red-500 text-center mt-3 p-3">
    ❌ Respuesta Incorrecta. Intente nuevamente
  </div>
)}



{statusMessageCoincide&& (
  <div className="text-red-500 text-center mt-3 p-3">
    ❌ Las contraseñas no coinciden. Intente nuevamente. 
  </div>
)}

{statusVolver && (
  <div className="text-white text-center mt-3 p-3">
    ✅Modificado con éxito... Regresando a la página principal 💨
  </div>
)}


    
  </div>
</div>


  </>
  );
};

export default ForgotPassword;