import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Usuario from "../../models/User/User";
import { useNavigate } from "react-router-dom";
import Answer from "../../models/Answer/answer";
import useQuestionRepository from "../repositorio/answers.js";


const Formulario = ({ addUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  var isValid = false;
  const [preguntas, setPreguntas] = useState<{ option: any; label: any; }[]>([]);

  const useQuestion = useQuestionRepository();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await useQuestion.getQuestions();
        if (questions) {
          setPreguntas(questions);
        }
      } catch (error) {
        console.error('Error al obtener preguntas:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const [usuario, setUsuario] = useState<Usuario>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    date: new Date(),
    answer: {
      option: "",
      response: ""
    }
  });

  useEffect(() => { }, [isValid]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("El nombre es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    email: Yup.string()
      .email("El correo electrónico no es válido")
      .required("El correo electrónico es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("La confirmacion de la contraseña es requerida"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values)
    addUser(values);
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px]">
      <Formik
        initialValues={usuario}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-1 rounded shadow-md h-full overflow-y-auto max-w-[808px]">
            <div className="mb-4">
              <label htmlFor="firstName" className="block font-bold mb-1">
                First Name
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 mt-1 text-xs"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block font-bold mb-1">
                Last Name
              </label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 mt-1 text-xs"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-1">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1 text-xs"
              />
            </div>


            {/* Sección de Pregunta de Seguridad */}
            <div className="mb-4 rounded border p-4">
              <div className="mb-4">
                <label htmlFor="answer.option" className="block font-bold mb-1">
                  Pregunta de seguridad
                </label>
                <Field
                  as="select"
                  id="answer.option"
                  name="answer.option"
                  className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                >

                  <option value="" label="Seleccionar Pregunta" />
                  {loading ? (
                    <p>Cargando...</p> // Puedes personalizar el indicador de carga según tus necesidades
                  ) : (
                    preguntas.map((question) => (
                      <option key={question.option} value={question.option} label={question.label} />
                    ))
                  )}

                </Field>
                <ErrorMessage
                  name="securityQuestion"
                  component="div"
                  className="text-red-500 mt-1 text-xs"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="answer.response" className="block font-bold mb-1">
                  Respuesta de seguridad
                </label>
                <Field
                  type="text"
                  id="answer.response"
                  name="answer.response"
                  className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name="answer.response"
                  component="div"
                  className="text-red-500 mt-1 text-xs"
                />
              </div>
            </div>
            {/* Fin de la sección de Pregunta de Seguridad */}


            <div className="mb-4">
              <label htmlFor="password" className="block font-bold mb-1">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1 text-xs"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block font-bold mb-1">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="border border-gray-300 rounded py-2 px-3 w-full focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 mt-1 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Registrar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Formulario;
