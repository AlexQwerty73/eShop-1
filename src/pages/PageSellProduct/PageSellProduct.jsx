import React, { useState, useRef } from 'react';
import { useGetProductsQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetUsersQuery } from '../../redux';
import { useAuth } from '../../context';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import s from './pageSellProduct.module.css';

const COMMISSION_RATE = 0.10; // 10% marketplace commission
const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH'];

const emptyForm = {
   name: '',
   description: '',
   price: '',
   currency: 'USD',
   category: '',
   inventory: '',
   discount: '',
   variants: '',
};

export const PageSellProduct = () => {
   usePageTitle('Sell Product');
   const { userId, isAdmin } = useAuth();
   const { data: allProducts = [], isLoading } = useGetProductsQuery();
   const { data: currentUser } = useGetUsersQuery(userId, { skip: !userId || isAdmin });
   const [addProduct] = useAddProductMutation();
   const [updateProduct] = useUpdateProductMutation();
   const [deleteProduct] = useDeleteProductMutation();

   const [form, setForm] = useState(emptyForm);
   const [editingId, setEditingId] = useState(null);
   const [images, setImages] = useState([]); // base64 strings
   const [submitting, setSubmitting] = useState(false);
   const [successMsg, setSuccessMsg] = useState('');
   const [errorMsg, setErrorMsg] = useState('');
   const fileInputRef = useRef(null);

   // My products: seller created them, or admin sees all
   const myProducts = isAdmin
      ? allProducts
      : allProducts.filter((p) => p.seller_id === userId);

   const sellerPrice = form.price
      ? (parseFloat(form.price) * (1 - COMMISSION_RATE)).toFixed(2)
      : '0.00';

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
         const reader = new FileReader();
         reader.onload = (ev) => {
            setImages((prev) => [...prev, ev.target.result]);
         };
         reader.readAsDataURL(file);
      });
      // Reset so the same file can be selected again
      e.target.value = '';
   };

   const removeImage = (idx) => {
      setImages((prev) => prev.filter((_, i) => i !== idx));
   };

   const handleEditClick = (product) => {
      setEditingId(product.id);
      setForm({
         name: product.name || '',
         description: product.description || '',
         price: product.price || '',
         currency: product.currency || 'USD',
         category: (product.category || []).join(', '),
         inventory: product.inventory ?? '',
         discount: product.discount ? (product.discount * 100).toFixed(0) : '',
         variants: (product.variants || []).join(', '),
      });
      setImages(product.imgs || []);
      setSuccessMsg('');
      setErrorMsg('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleCancel = () => {
      setEditingId(null);
      setForm(emptyForm);
      setImages([]);
      setSuccessMsg('');
      setErrorMsg('');
   };

   const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this product?')) return;
      try {
         await deleteProduct(id).unwrap();
         setSuccessMsg('Product deleted.');
      } catch {
         setErrorMsg('Failed to delete product.');
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');

      if (!form.name.trim() || !form.price || !form.inventory) {
         setErrorMsg('Name, price and inventory are required.');
         return;
      }

      const priceNum = parseFloat(form.price);
      const discountNum = form.discount ? parseFloat(form.discount) / 100 : 0;
      const inventoryNum = parseInt(form.inventory);

      const categoryArr = form.category
         ? form.category.split(',').map((c) => c.trim()).filter(Boolean)
         : [];
      const variantsArr = form.variants
         ? form.variants.split(',').map((v) => v.trim()).filter(Boolean)
         : [];

      const productData = {
         name: form.name.trim(),
         description: form.description.trim(),
         price: priceNum,
         currency: form.currency,
         category: categoryArr,
         inventory: inventoryNum,
         discount: discountNum,
         variants: variantsArr,
         imgs: images,
         seller_id: isAdmin ? null : userId,
         seller_name: isAdmin ? null : `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || null,
         commission_rate: isAdmin ? 0 : COMMISSION_RATE,
         seller_price: isAdmin ? priceNum : parseFloat((priceNum * (1 - COMMISSION_RATE)).toFixed(2)),
         reviews: editingId ? undefined : [],
         is_available: true,
         updated_at: new Date().toISOString(),
      };

      setSubmitting(true);
      try {
         if (editingId) {
            // Fetch existing data to preserve reviews etc.
            const existing = allProducts.find((p) => p.id === editingId) || {};
            await updateProduct({
               productId: editingId,
               body: { ...existing, ...productData, reviews: existing.reviews || [] },
            }).unwrap();
            setSuccessMsg('Product updated successfully!');
         } else {
            productData.created_at = new Date().toISOString();
            await addProduct(productData).unwrap();
            setSuccessMsg('Product added successfully!');
         }
         setEditingId(null);
         setForm(emptyForm);
         setImages([]);
      } catch {
         setErrorMsg('Failed to save product. Please try again.');
      } finally {
         setSubmitting(false);
      }
   };

   if (!userId) {
      return (
         <div className="container">
            <p>Please <Link to="/login">log in</Link> to sell products.</p>
         </div>
      );
   }

   return (
      <div className={s.page}>
         <div className="container">
            <h1 className={s.title}>
               {isAdmin ? '🛠 Admin — Manage Products' : '🛒 Sell Your Product'}
            </h1>

            {/* FORM */}
            <form className={s.form} onSubmit={handleSubmit}>
               <h2 className={s.formTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

               <div className={s.grid}>
                  <div className={s.field}>
                     <label>Product Name *</label>
                     <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Headphones" required />
                  </div>

                  <div className={s.field}>
                     <label>Category (comma-separated)</label>
                     <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Electronics, Audio" />
                  </div>

                  <div className={s.field}>
                     <label>Price *</label>
                     <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required />
                  </div>

                  <div className={s.field}>
                     <label>Currency</label>
                     <select name="currency" value={form.currency} onChange={handleChange}>
                        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>

                  <div className={s.field}>
                     <label>Inventory (qty) *</label>
                     <input name="inventory" type="number" min="0" step="1" value={form.inventory} onChange={handleChange} placeholder="10" required />
                  </div>

                  <div className={s.field}>
                     <label>Discount (%)</label>
                     <input name="discount" type="number" min="0" max="90" step="1" value={form.discount} onChange={handleChange} placeholder="0" />
                  </div>

                  <div className={`${s.field} ${s.fullWidth}`}>
                     <label>Variants (comma-separated, format type:value)</label>
                     <input name="variants" value={form.variants} onChange={handleChange} placeholder="e.g. color:red, color:blue, size:M, size:L" />
                  </div>

                  <div className={`${s.field} ${s.fullWidth}`}>
                     <label>Description</label>
                     <textarea name="description" rows={4} value={form.description} onChange={handleChange} placeholder="Describe your product..." />
                  </div>
               </div>

               {/* Commission info */}
               {!isAdmin && form.price && (
                  <div className={s.commissionBox}>
                     <strong>💰 Revenue breakdown:</strong>
                     <ul>
                        <li>Listing price: <strong>{parseFloat(form.price).toFixed(2)} {form.currency}</strong></li>
                        <li>Platform commission ({(COMMISSION_RATE * 100).toFixed(0)}%): <strong>-{(parseFloat(form.price) * COMMISSION_RATE).toFixed(2)} {form.currency}</strong></li>
                        <li>You receive: <strong className={s.sellerPrice}>{sellerPrice} {form.currency}</strong></li>
                     </ul>
                  </div>
               )}

               {/* Image upload */}
               <div className={s.imageSection}>
                  <label className={s.imageLabel}>Product Images</label>
                  <button type="button" className={s.uploadBtn} onClick={() => fileInputRef.current.click()}>
                     + Upload Images
                  </button>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     multiple
                     style={{ display: 'none' }}
                     onChange={handleImageUpload}
                  />
                  {images.length > 0 && (
                     <div className={s.imagePreviewList}>
                        {images.map((src, idx) => (
                           <div key={idx} className={s.imagePreview}>
                              <img src={src} alt={`preview ${idx}`} />
                              <button type="button" className={s.removeImg} onClick={() => removeImage(idx)}>✕</button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {errorMsg && <div className={s.error}>{errorMsg}</div>}
               {successMsg && <div className={s.success}>{successMsg}</div>}

               <div className={s.formActions}>
                  <button type="submit" className={s.submitBtn} disabled={submitting}>
                     {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Product'}
                  </button>
                  {editingId && (
                     <button type="button" className={s.cancelBtn} onClick={handleCancel}>
                        Cancel
                     </button>
                  )}
               </div>
            </form>

            {/* My products list */}
            <div className={s.myProducts}>
               <h2 className={s.myProductsTitle}>
                  {isAdmin ? 'All Products' : 'My Products'} ({myProducts.length})
               </h2>

               {isLoading ? (
                  <p>Loading...</p>
               ) : myProducts.length === 0 ? (
                  <p className={s.empty}>You haven't published any products yet.</p>
               ) : (
                  <div className={s.productTable}>
                     <table>
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Category</th>
                              <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {myProducts.map((p) => (
                              <tr key={p.id}>
                                 <td>
                                    <Link to={`/product/${p.id}`} className={s.productLink}>{p.name}</Link>
                                 </td>
                                 <td>{p.price} {p.currency}</td>
                                 <td className={p.inventory === 0 ? s.outOfStock : ''}>{p.inventory}</td>
                                 <td>{(p.category || []).join(', ')}</td>
                                 <td>
                                    <button className={s.editBtn} onClick={() => handleEditClick(p)}>Edit</button>
                                    {(isAdmin || p.seller_id === userId) && (
                                       <button className={s.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
