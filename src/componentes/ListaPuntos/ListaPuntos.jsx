import React from 'react';

const ListaPuntos = ({puntos, eliminar}) => {
    return (

<div className="flex">
      <div className="w-1/2 w-full">
        <ul className="divide-y divide-gray-300">
          {puntos.map((punto) => (
            
            <div className='flex  mt-5 '>
                <div className='col'>
                <li className="p-4">
              <h3 className="text-sm font-bold animate__animated  animate__backInRight">{punto[2]}</h3>
            </li>
                </div>
            <div className='col p-3'>
            <div><button onClick={() => eliminar(punto)} className=" text-xl text-red-500  animate__animated  animate__backInRight">X</button></div>
            </div>
            
            </div>
          )
          )}
        </ul>
      </div>
    </div>

        // <>
        //     <h1 className="text-3xl font-bold">
        //         Test
        //     </h1>
        //     {
        //         puntos.map((punto) => {
        //             return (



        //                 // <div>
        //                 //     <div className="text-gray-300 w-2/3 overflow-hidden">{punto[2]}</div>
        //                 //     <div><button onClick={() => eliminar(punto)} className=" text-white bg-red-500">Borrar</button></div>
        //                 // </div>
        //             )
        //         })
        //     }
        // </>
    )
}

export default ListaPuntos;