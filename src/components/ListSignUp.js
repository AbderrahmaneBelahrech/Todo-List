// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const REST_API_BASE_URL = 'http://localhost:8082/api/users/test';

// // Fonction pour récupérer la liste des utilisateurs depuis l'API
// const fetchUsers = () => {
//   return axios.get(REST_API_BASE_URL);
// };

// const ListSignUp = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // Utilisation de la fonction fetchUsers pour récupérer les utilisateurs
//     fetchUsers()
//       .then(response => {
//         // Mise à jour de l'état avec les utilisateurs récupérés depuis l'API
//         setUsers(response.data);
//       })
//       .catch(error => {
//         console.error('Erreur lors de la récupération des utilisateurs :', error);
//       });
//   }, []); // Le tableau vide en deuxième argument signifie que ce useEffect ne s'exécute qu'une seule fois après le rendu initial

//   return (
//     <div>
//       <h2>Liste des utilisateurs inscrits :</h2>
//       <ul>
//         {/* Parcourir la liste des utilisateurs et afficher leurs informations */}
//         {users.map(user => (
//           <li key={user.id}>
//             <strong>Nom :</strong> {user.name}, <strong>Email :</strong> {user.email}, <strong>Téléphone :</strong> {user.phone}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ListSignUp;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
const REST_API_BASE_URL = 'http://localhost:8082/api/users/test';

// Fonction pour récupérer la liste des utilisateurs depuis l'API
const fetchUsers = () => {
  return axios.get(REST_API_BASE_URL);
};

const ListSignUp = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Utilisation de la fonction fetchUsers pour récupérer les utilisateurs
    fetchUsers()
      .then(response => {
        // Mise à jour de l'état avec les utilisateurs récupérés depuis l'API
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      });
  }, []); // Ce useEffect ne s'exécute qu'une seule fois après le rendu initial

  return (
    <table className="table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nom</th>
          <th scope="col">Email</th>
          <th scope="col">Téléphone</th>
        </tr>
      </thead>
      <tbody>
        {/* Parcourir la liste des utilisateurs et afficher leurs informations dans le tableau */}
        {users.map((user, index) => (
          <tr key={user.id}>
            <th scope="row">{index + 1}</th>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListSignUp;
