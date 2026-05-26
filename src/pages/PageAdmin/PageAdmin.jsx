import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { PageSellProduct } from '../PageSellProduct';

/**
 * Admin panel — wraps the seller page with an admin-only guard.
 * The PageSellProduct already shows "All Products" and allows full CRUD when isAdmin === true.
 */
export const PageAdmin = () => {
   const { isAdmin } = useAuth();

   if (!isAdmin) return <Navigate to="/" replace />;

   return <PageSellProduct />;
};
