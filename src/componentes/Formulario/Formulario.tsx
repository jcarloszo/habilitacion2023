import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Usuario from "../../models/User/User";
import { useNavigate } from "react-router-dom";

const Formulario = ({ addUser }) => {
  const navigate = useNavigate();
  var isValid = false;

  const [usuario, setUsuario] = useState<Usuario>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    date: new Date(),
  });

  useEffect(() => {}, [isValid]);

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
    addUser(values);
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto animate__animated  animate__rubberBand ">
      <Formik
        initialValues={usuario}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-4 rounded shadow-md">
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
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Formulario;
