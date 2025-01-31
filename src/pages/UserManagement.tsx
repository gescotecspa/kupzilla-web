import { useEffect, useState } from 'react';
import { RootState } from '../redux/store/store';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import User from '../models/User';
import { assignRoleToUser, fetchAllUsers, fetchRoles, fetchStatuses, updateUser } from '../redux/actions/userActions';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import '../styles/pages/_userManagement.scss';
import RegisterPartnerModal from '../components/RegisterPartnerModal/RegisterPartnerModal';
import MarketStall from '../assets/icons/MarketStallwhite.svg';
import { fetchCategories } from '../redux/actions/globalDataActions';
import { createPartner, fetchBranchesByPartner, fetchPartnerById } from '../redux/actions/partnerActions';
import { deleteBranchById } from '../redux/actions/branchesActions';
import { translateRoleToSpanish, translateStatusToSpanish } from '../utils/utils';
import Pagination from '../components/Pagination/pagination';
import { useMediaQuery } from 'react-responsive';

const UserManagement = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const users = useAppSelector((state: RootState) => state.user.users);
    const roles = useAppSelector((state: RootState) => state.user.roles);
    const filteredRoles = roles?.filter(role => role.role_name !== 'admin');
    const statuses = useAppSelector((state: RootState) => state.user.statuses);
    const dispatch = useAppDispatch();
    const countries = useAppSelector((state: RootState) => state.globalData.countries);
    const MySwal = withReactContent(Swal);
    // console.log("todos los users", users[3],users);
    // console.log("todos los roles", roles);
    // console.log("todos los estados", statuses);
    //Filtros
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    // const [cityFilter, setCityFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    type StatusNames = "active" | "inactive" | "pending" | "suspended" | "associated";

    const statusTranslations: Record<StatusNames, string> = {
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    suspended: "Suspendido",
    associated: "Asociado",
    };
        
      type RoleNames = "admin" | "user" | "associated" | "tourist" | "partner";

    const roleTranslations: Record<RoleNames, string> = {
    admin: "Administrador",
    user: "Usuario",
    associated: "Asociado",
    tourist: "Turista",
    partner: "Asociado",
    };
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    useEffect(() => {
        dispatch(fetchAllUsers())
            .then(() => {
                setLoading(false); 
            })
            .catch(() => {
                setLoading(false);
            });
        dispatch(fetchRoles());
        dispatch(fetchStatuses());
        dispatch(fetchCategories())
    }, [dispatch]);
    
    const handleUserClick = (user: User) => {
        MySwal.fire({
            title: `Editar Usuario`,
            html: `
            <input type="text" id="first_name" class="swal2-input" placeholder="Nombre" value="${user.first_name}">
            <input type="text" id="last_name" class="swal2-input" placeholder="Apellido" value="${user.last_name}">
             <input type="email" id="email" class="swal2-input" placeholder="Email" value="${user.email}" readonly>
            <input type="text" id="phone_number" class="swal2-input" placeholder="Teléfono" value="${user.phone_number}">
            <input type="text" id="city" class="swal2-input" placeholder="Ciudad" value="${user.city}">
            <input type="text" id="country" class="swal2-input" placeholder="País" value="${user.country}">
            <input type="date" id="birth_date" class="swal2-input" placeholder="Fecha de Nacimiento" value="${user.birth_date}">
                <select id="gender" class="swal2-inputDate">
                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Masculino</option>
                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Femenino</option>
                <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Otro</option>
                <option value="prefer_not_to_say" ${user.gender === 'prefer_not_to_say' ? 'selected' : ''}>Prefiero no decirlo</option>
                </select>
                <select id="status" class="swal2-inputDate">
                    ${statuses?.filter(status => status.name !== 'deleted')
                    .map(status => `
                        <option value="${status.id}" ${user.status.name === status.name ? 'selected' : ''}>${statusTranslations[status.name as StatusNames]  || status.name}</option>
                    `).join('')}
                </select>
                    <div class= "status-role">
                    <div class="role">
                    <strong>Roles:</strong>
                    ${filteredRoles?.map(role => `
                        <div class="status">
                        <input type="checkbox" id="role_${role.role_name}" value="${role.role_id}" ${user.roles.some(userRole => userRole.role_name === role.role_name) ? 'checked' : ''}>
                        <label for="role_${role.role_name}">${roleTranslations[role.role_name as RoleNames]|| role.role_name}</label><br>
                        </div>
                        `).join('')}
                        </div>
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                const first_name = (document.getElementById('first_name') as HTMLInputElement).value;
                const last_name = (document.getElementById('last_name') as HTMLInputElement).value;
                const email = (document.getElementById('email') as HTMLInputElement).value;
                const phone_number = (document.getElementById('phone_number') as HTMLInputElement).value;
                const birth_date = (document.getElementById('birth_date') as HTMLInputElement).value;
                const city = (document.getElementById('city') as HTMLInputElement).value;
                const country = (document.getElementById('country') as HTMLInputElement).value;
                const gender = (document.getElementById('gender') as HTMLSelectElement).value;
                const status_id = parseInt((document.getElementById('status') as HTMLSelectElement).value, 10);
                // const subscribed_to_newsletter = (document.getElementById('subscribed_to_newsletter') as HTMLInputElement)?.checked;
                
                // Capturar roles seleccionados
                const selectedRoles = Array.from(document.querySelectorAll('.status-role input:checked'))
                .map((checkbox: any) => checkbox.value);
                
                return {
                    first_name, last_name, email, phone_number, birth_date,
                    city, country, gender, status_id, roles: selectedRoles
                };
            },
        }).then(result => {
            if (result.isConfirmed) {
                const { first_name, last_name, email, phone_number, birth_date, city, country, gender, status_id, roles } = result.value;
                
                // console.log( first_name, last_name, email, phone_number, birth_date, city, country, gender,"estados", status_id,"roles________________", roles );
                
                // Actualizar roles del usuario
                // Actualizar roles del usuario
          dispatch(assignRoleToUser({user_id:user.user_id, role_ids:roles}))
        
          .then((responseRol) => {
              console.log("respuesta de actualizacion de rol",responseRol);
            //   console.log("roles asignados____________",roles);
              
            const associatedRole = filteredRoles.find(r => r.role_name === "associated");
            // console.log("El rol asociado buscado",associatedRole,"roles a asignar", roles);
            
            const isAssociatedRoleAssigned = associatedRole && roles.includes(associatedRole.role_id.toString());
        
            // console.log("isAssociatedRoleAssigned??????????????",isAssociatedRoleAssigned);
            
            if (isAssociatedRoleAssigned) {
                dispatch(fetchPartnerById(user.user_id))
                .then((response: any) => {
                    // console.log("response____________",response);
                    
                    if (response?.data) {
                        console.log("El partner ya existe, no se necesita crear nuevamente.");
                    } else {
                        const partnerData = {
                            address: `${user.city}, ${user.country}`,
                            contact_info: user.email,
                            business_type: 'desconocido',
                            category_ids: [],
                            user_id: user.user_id
                        };
                        console.log("Creando partner:", partnerData);
                        // Aquí llamas la acción para crear el partner si no existe
                        dispatch(createPartner(partnerData))
                            .then(() => {
                                console.log("Partner creado exitosamente.");
                            })
                            .catch(error => {
                                console.error("Error al crear el partner:", error);
                            });
                    }
                })
                .catch((error:any) => {
                    console.error("Error al verificar el partner:", error);
                });
        }
                return dispatch(updateUser({
                    user_id: user.user_id,
                    data: {
                        first_name,
                        last_name,
                        email,
                        phone_number,
                        birth_date,
                        city,
                        country,
                        gender,
                        status_id
                    }
                }));
            })
            .then(() => {
                // Mostrar mensaje de éxito si todo salió bien
                MySwal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
                return dispatch(fetchAllUsers());
            })
            .catch((error) => {
                // Si ocurre un error en cualquiera de las operaciones, mostrar mensaje de error
                MySwal.fire('Error', error.message || 'No se pudo actualizar el usuario', 'error');
            });
            
        }
        });
    };
// console.log("estado eliminado", statuses?.find(status => status.name === 'deleted')?.id);

const handleDeleteUser = (userId: number) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Este cambio es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const deletedStatusId = statuses?.find(status => status.name === 'deleted')?.id;
  
        if (!deletedStatusId) {
          MySwal.fire('Error', 'No se pudo encontrar el estado "deleted"', 'error');
          return;
        }
  
        // Paso 1: Obtener sucursales asociadas al socio
        dispatch(fetchBranchesByPartner(userId))
          .then((branches: any) => {
            console.log("sucursales del usuario",branches);
            
            // Si no hay sucursales asociadas, solo elimina el usuario
            if (!branches || branches.length === 0) {
              dispatch(updateUser({
                user_id: userId,
                data: { status_id: deletedStatusId },
              }))
                .then(() => {
                  MySwal.fire('Usuario Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
                  dispatch(fetchAllUsers());
                })
                .catch((error) => {
                  console.error('Error al eliminar el usuario:', error);
                  MySwal.fire('Error', 'No se pudo eliminar al usuario', 'error');
                });
              return;
            }
  
            // Si hay sucursales, actualiza la primera a "deleted" antes de eliminar al usuario
            const branch = branches[0];
            console.log("sucursal 0", branch);
            
            dispatch(deleteBranchById(branch.branch_id, deletedStatusId ))
              .then(() => {
                dispatch(updateUser({
                  user_id: userId,
                  data: { status_id: deletedStatusId },
                }))
                  .then(() => {
                    MySwal.fire('Usuario Eliminado', 'El usuario y su sucursal han sido eliminados correctamente', 'success');
                    dispatch(fetchAllUsers());
                  })
                  .catch((error:any) => {
                    console.error('Error al eliminar el usuario:', error);
                    MySwal.fire('Error', 'No se pudo eliminar al usuario', 'error');
                  });
              })
              .catch((error:any) => {
                console.error('Error al actualizar la sucursal:', error);
                MySwal.fire('Error', 'No se pudo actualizar la sucursal', 'error');
              });
          })
          .catch((error:any) => {
            console.error('Error al obtener las sucursales:', error);
            MySwal.fire('Error', 'No se pudieron obtener las sucursales del socio', 'error');
          });
      }
    });
  };

    const filteredUsers = users?.filter((user: User) => {
        return (
            (nameFilter === '' || user.first_name.toLowerCase().includes(nameFilter.toLowerCase()) || user.last_name.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (emailFilter === '' || user.email.toLowerCase().includes(emailFilter.toLowerCase())) &&
            (roleFilter === '' || user.roles.some(role => role.role_name === roleFilter)) &&
            (statusFilter === '' || user.status.name === statusFilter) &&
            (countryFilter === '' || user.country.toLowerCase().includes(countryFilter.toLowerCase())) 
            // &&
            // (cityFilter === '' || user.city.toLowerCase().includes(cityFilter.toLowerCase()))
        );
    });
    const handleClearFilters = () => {
        setNameFilter('');
        setEmailFilter('');
        setRoleFilter('');
        setStatusFilter('');
        setCountryFilter('');
        // setCityFilter('');
    };
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="user-management">
           
            
            <div className='divbtnreg'>
            <button className='btnRegister' onClick={openModal}>
            <img src={MarketStall} className='iconos' />Registrar Asociado</button>    
            <h1>Gestión de Usuarios</h1>
            </div>
            
            {/* Filtros */}
            <div className="filters">
                <input 
                    className='inputFilter'
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    autoComplete="off"
                />
                <input 
                    className='inputFilter'
                    type="text"
                    placeholder="Filtrar por email"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    autoComplete="off"
                />
                <select id="country" 
                name="country" 
                className={isMobile? 'inputFilter': 'inputFilterStatus'}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                >
                    <option value="" >
                        Filtrar por país
                    </option>
                    {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                        {country.name}
                    </option>
                    ))}
                </select>
                <select
                    className={isMobile? 'inputFilter': 'inputFilterStatus'}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    autoComplete="off"
                >
                    <option value="">Filtrar por rol</option>
                    {roles?.map((role) => (
                        <option key={role.role_id} value={role.role_name}>
                            {translateRoleToSpanish(role.role_name)}
                        </option>
                    ))}
                </select>
                <select
                    className={isMobile? 'inputFilter': 'inputFilterStatus'}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Filtrar por estado</option>
                    {statuses?.map((status) => (
                        <option key={status.id} value={status.name}>
                            {translateStatusToSpanish(status.name)}
                        </option>
                    ))}
                </select>
                <button className='btnFilter' onClick={handleClearFilters}>Limpiar Filtros</button>
            </div>
            {/* <div className='contBtn'><button className='btnFilter' onClick={handleClearFilters}>Limpiar Filtros</button> </div> */}
            <div className="user-table-wrapper">
            <table className="user-table">
            {loading && (
                <div className='loaderUsers'>Cargando usuarios...</div>
            )}
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={6} className="no-results">No se encontraron resultados</td>
                </tr>
            ) : (currentUsers.map((user: User) => (
                        <tr key={user.user_id} >
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.map(role => role.role_name).join(', ')}</td>
                            <td>{translateStatusToSpanish(user.status.name) }</td>
                            <td>
                            <div className='btnsTable'>
                                <button className='buttonEd' onClick={() => handleUserClick(user)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="currentColor" d="M16 4s0-1-1-2s-1.9-1-1.9-1L12 2.1V0H0v16h12V8zm-9.7 7.4l-.6-.6l.3-1.1l1.5 1.5zm.9-1.9l-.6-.6l5.2-5.2c.2.1.4.3.6.5zm6.9-7l-.9 1c-.2-.2-.4-.3-.6-.5l.9-.9c.1.1.3.2.6.4M11 15H1V1h10v2.1L5.1 9L4 13.1L8.1 12L11 9z"/></svg>
                            </button>
                            <button className='buttonDel' onClick={() => handleDeleteUser(user.user_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 40 40"><path fill="currentColor" d="M32.937 7.304H27.19v-.956c0-1.345-.423-2.32-1.278-2.915c-.604-.39-1.353-.588-2.224-.588h-6.441l-.014.003l-.014-.003h-.909c-2.259 0-3.503 1.244-3.503 3.503v.956H7.063a.75.75 0 0 0 0 1.5h.647l1.946 25.785c0 1.631.945 2.566 2.594 2.566h15.461c1.611 0 2.557-.93 2.592-2.51L32.25 8.804h.686a.75.75 0 0 0 .001-1.5m-2.302 2.976H9.326l-.111-1.476h21.531zM14.308 6.348c0-1.423.58-2.003 2.003-2.003h7.378c.578 0 1.053.117 1.389.333c.413.287.613.833.613 1.67v.956H14.308zm14.498 28.224c-.019.81-.295 1.083-1.095 1.083H12.25c-.818 0-1.094-.269-1.096-1.123L9.439 11.779h21.082z"/><path fill="currentColor" d="M17.401 12.969a.75.75 0 0 0-.722.776l.704 19.354a.75.75 0 0 0 .748.723l.028-.001a.75.75 0 0 0 .722-.776l-.703-19.355c-.015-.414-.353-.757-.777-.721m-4.649.001a.75.75 0 0 0-.696.8l1.329 19.354a.75.75 0 0 0 .747.698l.053-.002a.75.75 0 0 0 .696-.8l-1.329-19.354a.756.756 0 0 0-.8-.696m9.784-.001c-.419-.04-.762.308-.776.722l-.705 19.354a.75.75 0 0 0 .722.776l.028.001a.75.75 0 0 0 .748-.723l.705-19.354a.75.75 0 0 0-.722-.776m4.649.001a.757.757 0 0 0-.8.696L25.056 33.02a.75.75 0 0 0 .696.8l.053.002a.75.75 0 0 0 .747-.698l1.329-19.354a.75.75 0 0 0-.696-.8"/></svg>
                            </button>
                            </div>
                            
                            </td>
                        </tr>
                        )
                    ))}
                </tbody>
            </table>
            </div>
            <div className='pagCont'>
                <Pagination
                    totalPages={totalPages} 
                    currentPage={currentPage} 
                    onPageChange={paginate} 
                />
            </div>
            {isModalOpen && <RegisterPartnerModal isOpen={isModalOpen} onClose={closeModal} />}
        </div>
    );
};

export default UserManagement;