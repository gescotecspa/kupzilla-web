import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/Register.scss";
import { FieldError, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import logo from "../assets/images/logok.png";
import logo2 from "../assets/images/KUPZILLAName.png";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { RootState } from "../redux/store/store";
import Loader from "../components/Loader/Loader";
import { fetchRoles, fetchStatuses } from "../redux/actions/userActions";
import { fetchCountries } from "../redux/actions/globalDataActions";
import { useMediaQuery } from "react-responsive";
import apiClient from "../api/axiosConfig";
import axios from "axios";
import { TermsResponse } from "../redux/types/types";

// Actualiza el modelo para reflejar los nuevos campos
interface UserRegister {
  email: string;
  password: string;
  confirmPassword?: string;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  status_id: number | undefined;
  phone_number?: string;
  gender?: string;
  otro_genero?: string;
  birth_date?: string;
  subscribed_to_newsletter?: boolean;
  accept_terms: boolean
}

const Register = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const URL = import.meta.env.VITE_API_URL;
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<UserRegister>({
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtroGenero, setShowOtroGenero] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const roles = useAppSelector((state: RootState) => state.user.roles);
  const statusActive = useAppSelector(
    (state: RootState) => state.user.statuses
  ).find((s) => s.name === "active");
  const countries = useAppSelector(
    (state: RootState) => state.globalData.countries
  );
  const birthDate = watch("birth_date");
  const dispatch = useAppDispatch();
  const [terms, setTerms] = useState<TermsResponse | null>(null);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  console.log("terminos y condiciones", terms);

  // console.log("rol de turista",roles);
  // console.log("estado de turista",statusActive);
  useEffect(() => {
    axios
      .get<TermsResponse>(`${URL}/terms`)
      .then((response) => setTerms(response.data))
      .catch((error) => console.error("Error fetching terms:", error));
  }, []);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
    dispatch(fetchCountries());
  }, [dispatch]);

  const onSubmit = async (data: UserRegister) => {
    // console.log("presiono submit...............");
    if (!accepted) {
      setFormError(
        "Debes aceptar los términos y condiciones para registrarte."
      );
      return;
    }
    setFormError("");
    const { confirmPassword, otro_genero, ...userData } = data;
    userData.email = userData.email.trim().toLowerCase();
    userData.status_id = statusActive?.id;
    userData.birth_date =
      userData.birth_date === "" ? undefined : userData.birth_date;
    userData.accept_terms = accepted;
    userData.gender = userData.gender === "" ? undefined : userData.gender;
    if (otro_genero) {
      userData.gender = otro_genero;
    }
    // console.log("data user a enviar",userData);

    try {
      // Registro del usuario
      setIsLoading(true);
      const userResponse = await apiClient.post(`${URL}/signup`, userData);

      // console.log("respuesta de creacion de usuario", userResponse);

      // Si la respuesta del registro del usuario es exitosa (status 201 o 200)
      if (userResponse.status === 201 || userResponse.status === 200) {
        const userId = userResponse.data.user_id;

        // Registro del turista
        const touristData = {
          user_id: userId,
          origin: userData.country,
          birthday: userData.birth_date,
          gender: userData.gender,
          category_ids: [],
        };

        const touristResponse = await apiClient.post(
          `${URL}/tourists`,
          touristData
        );
        // console.log("respuesta de creacion de turista", touristResponse);
        // Asignar el rol de turista si el registro del turista fue exitoso
        if (touristResponse.status === 201 || touristResponse.status === 200) {
          const touristRole = roles.find(
            (role) => role.role_name === "tourist"
          );
          if (touristRole) {
            const responseRol = await apiClient.post(
              `${URL}/assign_roles_to_user`,
              {
                role_ids: [touristRole.role_id],
                user_id: userId,
              }
            );
            // console.log("respuesta de creacion de usuario", responseRol);
            if (responseRol.status === 201 || responseRol.status === 200) {
              Swal.fire({
                icon: "success",
                title: `Registro exitoso del turista, <span style="color: #007A8C;">revise su email</span>`,
                confirmButtonText: "OK",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/");
                }
              });
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error en el registro:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error durante el registro.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          errorMessage == "A user with that email already exists."
            ? "El usuario ya existe"
            : "Ocurrió un error durante el registro.",
        width: "20rem",
        padding: "0.5rem",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowOtroGenero(e.target.value === "Otro");
  };

  const handleCancel = () => {
    navigate("/");
  };
  const firstName = watch("first_name");
  const lastName = watch("last_name");
  const country = watch("country");
  const email = watch("email");
  const confirmPassword = watch("confirmPassword");
  const password = watch("password");
  console.log(
    !firstName,
    !lastName,
    !country,
    !email,
    !password,
    !confirmPassword
  );

  // Verifica si todos los campos obligatorios están completos
  const isFormValid =
    !firstName ||
    !lastName ||
    !country ||
    !email ||
    !password ||
    !confirmPassword;
  console.log("formulario valido?", isFormValid);

  // console.log("fecha de nacimiento", register);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  console.log(errors.password, "errores", Object.keys(errors).length);

  return (
    <div className="register-container">
      {isLoading && <Loader></Loader>}

      {showModal && terms && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3>Términos y Condiciones (Versión {terms.version})</h3>
            <div
              className="terms-content"
              dangerouslySetInnerHTML={{ __html: terms.content }}
            />
          </div>
        </div>
      )}
      <div className="content">
        <div className="form-container">
          <div className="divLogoReg">
            <Link className="divLogoReg2" to="/">
              <img className="logoregister" src={logo} alt="logoregister" />
              <img className="logo2register" src={logo2} alt="logo2register" />
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
            <div className="form-grid">
              <input
                type="text"
                placeholder="* Nombre"
                className="form-input"
                {...register("first_name", {
                  required: "Nombre requerido",
                  maxLength: {
                    value: 30,
                    message: "El nombre no debe exceder los 30 caracteres.",
                  },
                })}
              />
              {errors.first_name && (
                <span className="form-error">{errors.first_name.message}</span>
              )}
              <div>
                <input
                  type="text"
                  placeholder="* Apellido"
                  className="form-input"
                  {...register("last_name", {
                    required: "Apellido requerido",
                    maxLength: {
                      value: 30,
                      message: "El apellido no debe exceder los 30 caracteres.",
                    },
                  })}
                />
                {errors.last_name && (
                  <span
                    className={isMobile ? "form-error" : "form-error-right"}
                  >
                    {errors.last_name.message}
                  </span>
                )}
              </div>

              <select
                className="form-input"
                {...register("country", { required: "País requerido" })}
              >
                <option value="">* Seleccione País</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="form-error">
                  {(errors.country as FieldError).message}
                </span>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="form-input"
                  {...register("city", {
                    maxLength: {
                      value: 50,
                      message: "La ciudad no debe exceder los 50 caracteres.",
                    },
                  })}
                />
                {errors.city && (
                  <span className="form-error">{errors.city.message}</span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="* Correo electrónico"
                  className="form-input"
                  {...register("email", {
                    required: "Correo electrónico requerido",
                    maxLength: {
                      value: 50,
                      message: "El correo no debe exceder los 50 caracteres.",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Correo electrónico no válido",
                    },
                  })}
                />
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Número de Teléfono"
                  className="form-input"
                  {...register("phone_number", {
                    pattern: {
                      value: /^[0-9]{7,15}$/,
                      message:
                        "Número de teléfono no válido. Debe ser número y contener entre 7 y 15 dígitos.",
                    },
                  })}
                />
                {errors.phone_number && (
                  <span className="form-error">
                    {errors.phone_number.message}
                  </span>
                )}
              </div>
              <select
                className="form-input"
                {...register("gender")}
                onChange={handleGeneroChange}
              >
                <option value="">Seleccione Género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <div className="divFecha">
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className="form-input"
                  {...register("birth_date")}
                />
                {!birthDate && (
                  <span className="BirthDate">Fecha de nacimiento</span>
                )}
              </div>
              {showOtroGenero ? (
                <input
                  type="text"
                  placeholder="Especificar género si lo desea"
                  className="form-input"
                  {...register("otro_genero", {
                    required: "Especificar género si lo desea.",
                  })}
                />
              ) : (
                <div></div>
              )}
            </div>
            <p className="datos_obligatorios">* datos obligatorios para registrarse</p>
            <div className="divmsgpss">
              {errors.confirmPassword && (
                <span className="form-error">
                  {(errors.confirmPassword as FieldError).message}
                </span>
              )}
            </div>

            <div className="password-divider">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="* Contraseña"
                  className="form-input"
                  {...register("password", {
                    required: "Contraseña requerida",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                      message:
                        "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial",
                    },
                  })}
                />
                <button
                  type="button"
                  className="toggle-password-visibility"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#007a8c"
                        d="m15.446 12.646l-.796-.796q.225-1.31-.742-2.267T11.65 8.85l-.796-.796q.252-.104.526-.156t.62-.052q1.529 0 2.591 1.063t1.063 2.591q0 .346-.052.64q-.052.293-.156.506m3.162 3.073l-.758-.669q.95-.725 1.688-1.588T20.8 11.5q-1.25-2.525-3.588-4.012T12 6q-.725 0-1.425.1T9.2 6.4l-.78-.78q.87-.33 1.772-.475T12 5q3.256 0 5.956 1.79q2.7 1.789 3.967 4.71q-.536 1.206-1.358 2.266t-1.957 1.953m1.115 5.42l-3.892-3.881q-.664.294-1.647.518Q13.2 18 12 18q-3.275 0-5.956-1.79q-2.68-1.789-3.967-4.71q.583-1.325 1.537-2.482q.953-1.157 2.036-1.941l-2.789-2.8l.708-.708l16.862 16.862zM6.358 7.785q-.86.611-1.758 1.607q-.898.997-1.4 2.108q1.25 2.525 3.587 4.013T12 17q.865 0 1.744-.168t1.322-.34l-1.632-1.642q-.236.133-.659.218t-.775.086q-1.529 0-2.591-1.063T8.346 11.5q0-.333.086-.746t.218-.688zm4.354 4.354"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#007a8c"
                        d="M12 14.2q-1.125 0-1.912-.787T9.3 11.5t.788-1.912T12 8.8t1.913.788t.787 1.912t-.787 1.913T12 14.2m.006 3.8q-3.252 0-5.925-1.768T2.077 11.5q1.33-2.964 4.002-4.732T12 5q3.102 0 5.688 1.621T21.685 11h-1.16q-1.3-2.325-3.575-3.662T12 6Q9.175 6 6.813 7.488T3.2 11.5q1.25 2.525 3.613 4.013T12 17q.442 0 .891-.04t.898-.122v1.006q-.446.067-.892.111q-.445.045-.89.045M12 15.154q.523 0 1.01-.144q.488-.144.9-.408q.182-.827.614-1.5t1.092-1.158q.019-.108.028-.222t.01-.222q0-1.522-1.067-2.588t-2.591-1.066t-2.587 1.067t-1.063 2.592t1.066 2.586q1.065 1.063 2.588 1.063m4.596 4.865q-.343 0-.575-.232t-.233-.575V16.5q0-.348.269-.568t.635-.22v-1q0-.707.504-1.21t1.21-.502t1.199.503t.491 1.209v1q.368 0 .636.22T21 16.5v2.712q0 .343-.232.575t-.576.232zm.866-4.307h1.865v-1q0-.426-.249-.684q-.25-.259-.674-.259t-.684.259q-.258.258-.258.683z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="* Confirmar contraseña"
                  className="form-input"
                  {...register("confirmPassword", {
                    required: "Confirmar contraseña requerida",
                    validate: (value) =>
                      value === watch("password") ||
                      "Las contraseñas no coinciden",
                  })}
                />
              </div>
            </div>
            
            {/* {errors.password && (
                <span className="form-error">{(errors.password as FieldError).message}</span>
                )} */}

            {password && (
              <div className="password-requirements">
                <p>Tu contraseña debe:</p>
                <ul>
                  <li
                    className="rulePass"
                    style={{ color: password.length >= 8 ? "green" : "red" }}
                  >
                    Tener al menos 8 caracteres
                  </li>
                  <li
                    className="rulePass"
                    style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}
                  >
                    Incluir al menos una letra mayúscula
                  </li>
                  <li
                    className="rulePass"
                    style={{ color: /[a-z]/.test(password) ? "green" : "red" }}
                  >
                    Incluir al menos una letra minúscula
                  </li>
                  <li
                    className="rulePass"
                    style={{ color: /\d/.test(password) ? "green" : "red" }}
                  >
                    Incluir al menos un número
                  </li>
                  <li
                    className="rulePass"
                    style={{
                      color: /[@$!%*?&]/.test(password) ? "green" : "red",
                    }}
                  >
                    Incluir al menos un carácter especial
                  </li>
                </ul>
              </div>
            )}

            {formError && <p style={{ color: "red" }}>{formError}</p>}
            <div className="terms-all">
              <div className="terms-container">
                <div className="checkbox-section">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <label htmlFor="acceptTerms">
                    Acepto los términos y condiciones
                  </label>
                </div>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShowModal(true)}
                >
                  Ver términos y condiciones
                </button>
              </div>
            </div>
            <div className="btnsReg">
              <button
                type="submit"
                className="submit-button"
                disabled={isFormValid}
              >
                Registrar
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>

            
            {/* <Link to="/login" className="already-account-button">Si ya tienes cuenta, ingresa aquí</Link> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
