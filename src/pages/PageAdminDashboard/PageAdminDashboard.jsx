import React, { useMemo, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useGetUsersQuery, useGetPromoCodesQuery, useUpdatePromoCodeMutation } from '../../redux';
import { useAuth } from '../../context';
import { usePageTitle } from '../../hooks';
import { averageRating } from '../../utils';
import s from './pageAdminDashboard.module.css';

export const PageAdminDashboard = () => {
   usePageTitle('Admin Dashboard');
   const { isAdmin } = useAuth();
   if (!isAdmin) return <Navigate to="/" replace />;

   return <DashboardContent />;
};

const DashboardContent = () => {
   const { data: products = [] } = useGetProductsQuery();
   const { data: allUsers = [] } = useGetUsersQuery();
   const { data: promoCodes = [] } = useGetPromoCodesQuery();
   const [updatePromoCode] = useUpdatePromoCodeMutation();

   const [activeTab, setActiveTab] = useState('overview');
   const [promoForm, setPromoForm] = useState(null); // editing promo

   const users = allUsers.filter((u) => u.id !== 'admin');

   // Stats
   const stats = useMemo(() => {
      const allOrders = users.flatMap((u) => u.orders || []);
      const revenue = allOrders.reduce((sum, o) => sum + (parseFloat(o.totalPrice) || 0), 0);
      const activeOrders = allOrders.filter((o) => !o.isCancelled && !o.isDelivered).length;
      const topProduct = [...products].sort(
         (a, b) => averageRating(b) - averageRating(a)
      )[0];
      return { users: users.length, products: products.length, orders: allOrders.length, revenue, activeOrders, topProduct };
   }, [products, users]);

   const handleTogglePromo = async (promo) => {
      await updatePromoCode({ ...promo, isActive: !promo.isActive });
   };

   const handleSavePromo = async (e) => {
      e.preventDefault();
      if (!promoForm) return;
      await updatePromoCode({ ...promoForm });
      setPromoForm(null);
   };

   return (
      <div className={s.page}>
         <div className="container">
            <h1 className={s.title}>🛠 Admin Dashboard</h1>

            {/* Tabs */}
            <div className={s.tabs}>
               {['overview', 'users', 'products', 'promoCodes'].map((tab) => (
                  <button
                     key={tab}
                     className={`${s.tab} ${activeTab === tab ? s.tabActive : ''}`}
                     onClick={() => setActiveTab(tab)}
                  >
                     {tab === 'overview'   && '📊 Overview'}
                     {tab === 'users'      && '👥 Users'}
                     {tab === 'products'   && '📦 Products'}
                     {tab === 'promoCodes' && '🎟 Promo Codes'}
                  </button>
               ))}
            </div>

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
               <div className={s.section}>
                  <div className={s.statGrid}>
                     <div className={s.statCard}>
                        <div className={s.statValue}>{stats.users}</div>
                        <div className={s.statLabel}>👥 Users</div>
                     </div>
                     <div className={s.statCard}>
                        <div className={s.statValue}>{stats.products}</div>
                        <div className={s.statLabel}>📦 Products</div>
                     </div>
                     <div className={s.statCard}>
                        <div className={s.statValue}>{stats.orders}</div>
                        <div className={s.statLabel}>🛒 Total Orders</div>
                     </div>
                     <div className={s.statCard}>
                        <div className={s.statValue}>${stats.revenue.toFixed(2)}</div>
                        <div className={s.statLabel}>💰 Revenue</div>
                     </div>
                     <div className={s.statCard}>
                        <div className={s.statValue}>{stats.activeOrders}</div>
                        <div className={s.statLabel}>⏳ Active Orders</div>
                     </div>
                     <div className={s.statCard}>
                        <div className={s.statValue}>{promoCodes.filter((p) => p.isActive).length}</div>
                        <div className={s.statLabel}>🎟 Active Promos</div>
                     </div>
                  </div>

                  {stats.topProduct && (
                     <div className={s.topProduct}>
                        <h3>⭐ Top Rated Product</h3>
                        <Link to={`/product/${stats.topProduct.id}`} className={s.topLink}>
                           {stats.topProduct.name} — {averageRating(stats.topProduct)}/5 ({(stats.topProduct.reviews || []).length} reviews)
                        </Link>
                     </div>
                  )}

                  <div className={s.quickLinks}>
                     <Link to="/admin/" className={s.quickBtn}>📦 Manage Products</Link>
                  </div>
               </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
               <div className={s.section}>
                  <h2>All Users ({users.length})</h2>
                  <table className={s.table}>
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th>Email</th>
                           <th>Orders</th>
                           <th>Spent</th>
                           <th>Joined</th>
                        </tr>
                     </thead>
                     <tbody>
                        {users.map((u) => {
                           const orders = u.orders || [];
                           const spent = orders.reduce((s, o) => s + (parseFloat(o.totalPrice) || 0), 0);
                           return (
                              <tr key={u.id}>
                                 <td>{u.first_name} {u.last_name}</td>
                                 <td>{u.email}</td>
                                 <td>{orders.length}</td>
                                 <td>${spent.toFixed(2)}</td>
                                 <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            )}

            {/* PRODUCTS */}
            {activeTab === 'products' && (
               <div className={s.section}>
                  <div className={s.sectionHeader}>
                     <h2>All Products ({products.length})</h2>
                     <Link to="/admin/" className={s.quickBtn}>+ Add / Edit</Link>
                  </div>
                  <table className={s.table}>
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th>Price</th>
                           <th>Stock</th>
                           <th>Rating</th>
                           <th>Seller</th>
                           <th>Reviews</th>
                        </tr>
                     </thead>
                     <tbody>
                        {products.map((p) => (
                           <tr key={p.id}>
                              <td><Link to={`/product/${p.id}`} className={s.tableLink}>{p.name}</Link></td>
                              <td>{p.price} {p.currency}</td>
                              <td className={p.inventory === 0 ? s.outStock : ''}>{p.inventory}</td>
                              <td>{averageRating(p)}/5</td>
                              <td>{p.seller_name || '—'}</td>
                              <td>{(p.reviews || []).length}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* PROMO CODES */}
            {activeTab === 'promoCodes' && (
               <div className={s.section}>
                  <h2>Promo Codes</h2>

                  {/* Edit form */}
                  {promoForm && (
                     <form className={s.promoEditForm} onSubmit={handleSavePromo}>
                        <h3>Edit: {promoForm.code}</h3>
                        <div className={s.promoEditGrid}>
                           <label>Description
                              <input value={promoForm.description} onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })} />
                           </label>
                           <label>Discount Type
                              <select value={promoForm.discountType} onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value })}>
                                 <option value="percent">Percent (%)</option>
                                 <option value="fixed">Fixed ($)</option>
                              </select>
                           </label>
                           <label>Discount Value
                              <input type="number" min="0" value={promoForm.discountType === 'percent' ? promoForm.discountPercent : promoForm.discountFixed}
                                 onChange={(e) => {
                                    const v = parseFloat(e.target.value) || 0;
                                    setPromoForm(promoForm.discountType === 'percent'
                                       ? { ...promoForm, discountPercent: v }
                                       : { ...promoForm, discountFixed: v });
                                 }} />
                           </label>
                           <label>Min Order ($)
                              <input type="number" min="0" value={promoForm.minOrderAmount} onChange={(e) => setPromoForm({ ...promoForm, minOrderAmount: parseFloat(e.target.value) || 0 })} />
                           </label>
                           <label>Max Uses
                              <input type="number" min="0" value={promoForm.maxUses} onChange={(e) => setPromoForm({ ...promoForm, maxUses: parseInt(e.target.value) || 0 })} />
                           </label>
                           <label>Expires At
                              <input type="datetime-local" value={promoForm.expiresAt?.slice(0, 16)} onChange={(e) => setPromoForm({ ...promoForm, expiresAt: new Date(e.target.value).toISOString() })} />
                           </label>
                        </div>
                        <div className={s.promoEditActions}>
                           <button type="submit" className={s.saveBtn}>Save</button>
                           <button type="button" className={s.cancelBtn} onClick={() => setPromoForm(null)}>Cancel</button>
                        </div>
                     </form>
                  )}

                  <table className={s.table}>
                     <thead>
                        <tr>
                           <th>Code</th>
                           <th>Discount</th>
                           <th>Min Order</th>
                           <th>Used / Max</th>
                           <th>Expires</th>
                           <th>Status</th>
                           <th>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {promoCodes.map((promo) => (
                           <tr key={promo.id}>
                              <td><code className={s.code}>{promo.code}</code></td>
                              <td>
                                 {promo.discountType === 'percent'
                                    ? `${promo.discountPercent}%`
                                    : `$${promo.discountFixed}`}
                              </td>
                              <td>${promo.minOrderAmount}</td>
                              <td>{promo.usedCount} / {promo.maxUses || '∞'}</td>
                              <td>{new Date(promo.expiresAt).toLocaleDateString()}</td>
                              <td>
                                 {promo.isActive && new Date(promo.expiresAt) > new Date()
                                    ? <span className={s.active}>Active</span>
                                    : <span className={s.inactive}>Inactive</span>
                                 }
                              </td>
                              <td className={s.actionCell}>
                                 <button className={s.editSmallBtn} onClick={() => setPromoForm({ ...promo })}>Edit</button>
                                 <button
                                    className={promo.isActive ? s.deactivateBtn : s.activateBtn}
                                    onClick={() => handleTogglePromo(promo)}
                                 >
                                    {promo.isActive ? 'Disable' : 'Enable'}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
   );
};
