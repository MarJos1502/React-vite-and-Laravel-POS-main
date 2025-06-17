interface RouteConfig {
    path: string;
    allowedRoles: string[];
}

export const routes: Record<string, RouteConfig> = {
    dashboard: {
        path: '/dashboard',
        allowedRoles: ['administrator', 'manager', 'cashier']
    },
    products: {
        path: '/products',
        allowedRoles: ['administrator', 'manager']
    },
    transactions: {
        path: '/transactions',
        allowedRoles: ['administrator', 'manager', 'cashier']
    },
    feedback: {
        path: '/feedback',
        allowedRoles: ['administrator', 'manager']
    },
    reports: {
        path: '/reports',
        allowedRoles: ['administrator', 'manager']
    },
    survey: {
        path: '/survey',
        allowedRoles: ['administrator', 'manager', 'cashier']
    }
};

export const getAuthorizedRoutes = (userRole: string): string[] => {
    return Object.values(routes)
        .filter(route => route.allowedRoles.includes(userRole))
        .map(route => route.path);
}; 