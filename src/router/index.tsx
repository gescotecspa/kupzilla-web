import { Outlet, Route } from "react-router-dom";
import { Fragment, LazyExoticComponent, Suspense, lazy } from "react";
import AuthGuard from "../utils/Auth";
import Loader from "../components/Loader/Loader";

interface RouteProps {
    path?: string;
    element?: LazyExoticComponent<() => JSX.Element> | null;
    layout?: LazyExoticComponent<(props: { children: React.ReactNode }) => JSX.Element> | ((props: { children: React.ReactNode }) => JSX.Element) | null;
    children?: RouteProps[];
    name?: string;
    authorization?: {
        allowedRoles: string[]
    } | null;
}

export const renderRoutes = (routes: RouteProps[]) => {
    return routes.map((route, index) => {
        const Component = route.element || Fragment;
        const LayoutComponent = route.layout !== null && route.layout !== undefined ? route.layout : Fragment;
        const allowedRoles = route.authorization?.allowedRoles || [];

        return (
            <Route
                key={index}
                path={route.path}
                element={
                    <Suspense fallback={<Loader />}>
                        {route.authorization ? (
                            <AuthGuard allowedRoles={allowedRoles}>
                                <LayoutComponent>
                                    {route.children ? <Outlet /> : <Component />}
                                </LayoutComponent>
                            </AuthGuard>
                        ) : (
                            <LayoutComponent>
                                {route.children ? <Outlet /> : <Component />}
                            </LayoutComponent>
                        )}
                    </Suspense>
                }
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        );
    });
};

export const routes: RouteProps[] = [
    {
        path: "/",
        element: lazy(async () => await import("../pages/HomePage")),
        name: "Home",
        layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/qr-code",
        element: lazy(async () => await import("../pages/QRCodePage")),
        name: "QR",
        layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/PromotionDetail/:id",
        element: lazy(async () => await import("../components/RedirectToAppStore/RedirectToAppStore")),
        name: "Redirect",
        // layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/BranchDetails/:id",
        element: lazy(async () => await import("../components/RedirectToAppStore/RedirectToAppStore")),
        name: "Redirect",
        // layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/login",
        element: lazy(async () => await import("../pages/Login")),
        name: "Login"
    },
    {
        path: "/register",
        element: lazy(async () => await import("../pages/Register")),
        name: "Register"
    },
    {
        path: "/home",
        element: lazy(async () => await import("../pages/HomePage")),
        name: "Home",
        layout: lazy(async () => await import("../pages/Layout/layout"))
    },
    {
        path: "/reset_password",
        element: lazy(async () => await import("../pages/PasswordReset")),
        name: "PasswordReset"
    },
    {
        path: "/open_app_instruction",
        element: lazy(async () => await import("../pages/OpenAppMessage")),
        name: "EnConstruccion"
    },
    {
        path: "/userProfile",
        element: lazy(async () => await import("../pages/UserProfile")),
        name: "UserProfile",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/dashboard",
        element: lazy(async () => await import("../pages/Dashboard")),
        name: "Panel",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/users-management",
        element: lazy(async () => await import("../pages/UserManagement")),
        name: "Panel",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/tourist-points",
        element: lazy(async () => await import("../pages/TouristPointsList")),
        name: "TouristPoints",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/tourist-points/:id",
        element: lazy(async () => await import("../pages/TouristPointDetail")),
        name: "TouristPoints",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/create-tourist-point",
        element: lazy(async () => await import("../components/FormTouristPoint/CreateTouristPoint ")),
        name: "CreateTouristPoints",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/notifications",
        element: lazy(async () => await import("../pages/UnderConstruction")),
        name: "Notifications",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/configuration",
        element: lazy(async () => await import("../pages/Configuration")),
        name: "Configuration",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    // {
    //     path: "/reports",
    //     element: lazy(async () => await import("../pages/UnderConstruction")),
    //     name: "Reports",
    //     layout: lazy(async () => await import("../pages/Layout/layout")),
    //     authorization: {
    //         allowedRoles: ['admin']
    //     }
    // },
    {
        path: "/socioPerfil",
        element: lazy(async () => await import("../pages/PartnerDetail")),
        name: "Reports",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['associated']
        }
    },
    {
        path: "/promotions",
        element: lazy(async () => await import("../pages/AllPromotions")),
        name: "Promociones",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/partner",
        element: lazy(async () => await import("../pages/PartnerDetail")),
        name: "Sucursales",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/new-branch",
        element: lazy(async () => await import("../pages/CreateBranchPage")),
        name: "Crear-Sucursal",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/branches",
        element: lazy(async () => await import("../pages/BranchesTable")),
        name: "Sucursales",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/branches/:branch_id",
        element: lazy(async () => await import("../components/BranchDetails/BranchDetails")),
        name: "DetalleSucursal",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    },
    {
        path: "/comments-moderation",
        element: lazy(async () => await import("../pages/CommentModeration")),
        name: "Moderar Comentarios",
        layout: lazy(async () => await import("../pages/Layout/layout")),
        authorization: {
            allowedRoles: ['admin']
        }
    }
];
