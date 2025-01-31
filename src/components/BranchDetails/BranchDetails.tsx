import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import {
  fetchBranchById,
  resetBranch,
  deleteBranchById,
  inactivateBranch,
} from "../../redux/actions/branchesActions";
import { useEffect, useState } from "react";
import "../../styles/components/BranchDetails.scss";
import { FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import EditBranchModal from "../EditBranchModal/EditBranchModal";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import noimage from "../../assets/images/noImageAvailable.png";
import { useMediaQuery } from "react-responsive";
import MapComponent from "../MapFunctions/MapComponent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
} from "@mui/material";

const BranchDetails = () => {
  const { branch_id } = useParams<{ branch_id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const URL = import.meta.env.VITE_API_URL;
  const branch = useAppSelector((state: any) => state.branches.selectedBranch);
  const statuses = useAppSelector((state: any) => state.user.statuses);
  const [isActive, setIsActive] = useState<boolean>(branch?.status?.name == "active");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [statusToUpdate, setStatusToUpdate] = useState<boolean>(true);

  const statusInactive = statuses?.find((s: any) => s.name === "inactive");
  const statusActive = statuses?.find((s: any) => s.name === "active");

  console.log(isActive);
  // console.log(branch.image_url);
  useEffect(() => {
    if (branch_id) {
      dispatch(fetchBranchById(Number(branch_id)));
    }
  }, [branch_id, dispatch, showModal, isActive]);

  const handleBack = () => {
    dispatch(resetBranch());
    navigate(-1);
  };

  const handleDelete = () => {
    const statusDeleted = statuses.find((s: any) => s.name === "deleted");
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La sucursal será eliminada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result: any) => {
      if (result.isConfirmed && branch_id) {
        const deleteBranch = {
          status_id: statusDeleted?.id,
        };
        // console.log("id de la sucursal a eliminar", deleteBranch);

        dispatch(deleteBranchById(Number(branch_id), deleteBranch));
        Swal.fire(
          "¡Eliminado!",
          "La sucursal ha sido marcada como eliminada.",
          "success"
        );
        navigate("/branches");
      }
    });
  };

  const handleInactivate = (checked: boolean) => {
    setStatusToUpdate(checked);
    setOpenDialog(true); 
  };
  const handleDialogClose = (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      if (
        branch_id &&
        (statusToUpdate ? statusActive?.id : statusInactive?.id)
      ) {
        const newStatusId = statusToUpdate
          ? statusActive?.id
          : statusInactive?.id;
        
        dispatch(inactivateBranch(Number(branch_id), newStatusId))
          .then(() => {
            // Actualiza el estado `isActive` después de la acción exitosa
            setIsActive(statusToUpdate);
            Swal.fire(
              statusToUpdate ? "¡Activada!" : "¡Inactivada!",
              `La sucursal ha sido marcada como ${
                statusToUpdate ? "activa" : "inactiva"
              }.`,
              "success"
            );
          })
          .catch((error:any) => {
            Swal.fire("Error", "Hubo un error al cambiar el estado de la sucursal", error);
          });
      }
    } else {
      // Si el usuario cancela, restablecer el slider a lo que estaba previamente
      setIsActive(!statusToUpdate);
    }
  };

  if (!branch) {
    return (
      <div className="branch-details">
        <p>Cargando detalles de la sucursal...</p>
      </div>
    );
  }

  return (
    <div className="branch-details">
      <div className="textInfo">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft className="back-icon" />
          {!isMobile && <h4> Volver</h4>}
        </button>
        {branch && branch.image_url ? (
          <img
            src={`${URL}${branch.image_url}`}
            alt={branch.name}
            className="branch-details__image"
          />
        ) : (
          <img
            src={noimage}
            alt={branch.name}
            className="branch-details__image"
          />
        )}
        <h2 className="branch-details__title">
          {branch.name || "Nombre no disponible"}
        </h2>
        <p className="branch-details__description">
          {branch.description || "Descripción no disponible"}
        </p>
        <p className="branch-details__address">
          {branch.address || "Dirección no disponible"}
        </p>
        <p
          className={`branch-details__status branch-details__status--${
            branch.status?.name?.toLowerCase() || "unknown"
          }`}
        >
          {branch.status?.name || "Estado no disponible"}
        </p>
        <div className="branch-details__status-toggle">
          <p className="stateChange">Cambiar estado:</p>
          <Switch
            checked={isActive}
            onChange={(e) => handleInactivate(e.target.checked)}
            // color="primary"
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: '#007a8c',
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#d1d1d1',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#007a8c',
              },
              '& .MuiSwitch-switchBase': {
                color: '#d1d1d1', 
              },
              // '&:hover': {
              //   backgroundColor: '#005e6b',
              // },
            }}
          />
        </div>
        <div className="branch-details__actions">
          <EditButton onClick={() => setShowModal(true)} />
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <div className="MapInfo">
        {branch.latitude && branch.longitude && (
          <div className="branch-details__map">
            <MapComponent
              center={{ lat: branch.latitude, lng: branch.longitude }}
              zoom={15}
              markerPosition={{ lat: branch.latitude, lng: branch.longitude }}
              editMode={false}
              onLocationChange={() => {}}
            />
          </div>
        )}
      </div>
      {/* Mostrar el modal de edición */}
      <EditBranchModal
        showModal={showModal}
        branch={branch}
        onClose={() => setShowModal(false)}
        branchId={Number(branch_id)}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
         sx={{
          '& .MuiDialogTitle-root': {
            backgroundColor: '#027a8c',
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
          },
          '& .MuiDialogContent-root': {
            backgroundColor: 'rgba(2, 122, 140,0.1)',
            textAlign: 'center', 
            fontSize: '1rem', 
            minWidth: '20%', 
            padding: '50px ', 
          },
          '& .MuiDialogActions-root': {
            justifyContent: 'center',
            padding: '10px ', 
          },
        }}>
        <DialogTitle>
          {statusToUpdate ? "¿Activar sucursal?" : "¿Inactivar sucursal?"}
        </DialogTitle>
        <DialogContent>
          {statusToUpdate
            ? "La sucursal será activada."
            : "La sucursal y sus promociones serán inactivadas."}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary"
            sx={{
              backgroundColor: '#af2a2a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#ce3333',
              },
              fontSize: '16px',
              padding: '8px 16px',
              borderRadius: '4px',
            }}>
            Cancelar
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary"
            sx={{
              backgroundColor: '#027a8c',
              color: 'white',
              '&:hover': {
                backgroundColor: '#01a2b7',
              },
              fontSize: '16px',
              padding: '8px 16px',
              borderRadius: '4px',
            }}>
            {statusToUpdate ? "Sí, activar" : "Sí, inactivar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BranchDetails;
