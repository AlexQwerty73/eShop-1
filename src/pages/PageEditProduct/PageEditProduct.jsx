import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useUpdateProductMutation, useDeleteProductMutation, useGetUsersQuery } from '../../redux';
import { useAuth } from '../../context';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks';
import s from './pageEditProduct.module.css';

const COMMISSION_RATE = 0.10;
const CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH'];

export const PageEditProduct = () => {
   const { productId } = useParams();
   const { userId, isAdmin } = useAuth();
   const { showToast } = useToast();
   const navigate = useNavigate();

   const { data: allProducts = [], isLoading: productsLoading } = useGetProductsQuery();
   const { data: currentUser } = useGetUsersQuery(userId, { skip: !userId || isAdmin });
   const [updateProduct] = useUpdateProductMutation();
   const [deleteProduct] = useDeleteProductMutation();

   const product = allProducts.find((p) => String(p.id) === String(productId));

   usePageTitle(product ? `Edit: ${product.name}` : 'Edit Product');

   const [form, setForm] = useState(null);
   const [images, setImages] = useState([]);
   const [submitting, setSubmitting] = useState(false);
   const [errorMsg, setErrorMsg] = useState('');
   const fileInputRef = useRef(null);

   // Pre-fill form when product loads
   useEffect(() => {
      if (product && !form) {
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
      }
   }, [product, form]);

   // Access guard
   const canEdit = userId && (isAdmin || product?.seller_id === userId);

   if (productsLoading) {
      return <div className="container" style={{ padding: '40px 0' }}>Loading...</div>;
   }

   if (!product) {
      return (
         <div className="container" style={{ padding: '40px 0' }}>
            <h2>Product not found</h2>
            <Link to="/my-products/">← Back to My Products</Link>
         </div>
      );
   }

   if (!canEdit) {
      return (
         <div className="container" style={{ padding: '40px 0' }}>
            <h2>Access denied</h2>
            <p>You don't have permission to edit this product.</p>
            <Link to="/">← Go Home</Link>
         </div>
      );
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
         const reader = new FileReader();
         reader.onload = (ev) => setImages((prev) => [...prev, ev.target.result]);
         reader.readAsDataURL(file);
      });
      e.target.value = '';
   };

   const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMsg('');

      if (!form.name.trim() || !form.price || form.inventory === '') {
         setErrorMsg('Name, price and inventory are required.');
         return;
      }

      const priceNum     = parseFloat(form.price);
      const discountNum  = form.discount ? parseFloat(form.discount) / 100 : 0;
      const inventoryNum = parseInt(form.inventory, 10);
      const categoryArr  = form.category ? form.category.split(',').map((c) => c.trim()).filter(Boolean) : [];
      const variantsArr  = form.variants  ? form.variants.split(',').map((v) => v.trim()).filter(Boolean) : [];

      const updatedData = {
         ...product,
         name: form.name.trim(),
         description: form.description.trim(),
         price: priceNum,
         currency: form.currency,
         category: categoryArr,
         inventory: inventoryNum,
         discount: discountNum,
         variants: variantsArr,
         imgs: images,
         seller_price: isAdmin
            ? priceNum
            : parseFloat((priceNum * (1 - COMMISSION_RATE)).toFixed(2)),
         seller_name: isAdmin
            ? (product.seller_name || null)
            : `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || null,
         updated_at: new Date().toISOString(),
      };

      setSubmitting(true);
      try {
         await updateProduct({ productId: product.id, body: updatedData }).unwrap();
         showToast('Product updated!', 'success');
         navigate('/my-products/');
      } catch {
         setErrorMsg('Failed to save changes. Please try again.');
         showToast('Update failed', 'error');
      } finally {
         setSubmitting(false);
      }
   };

   const handleDelete = async () => {
      if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
      try {
         await deleteProduct(product.id).unwrap();
         showToast('Product deleted', 'info');
         navigate('/my-products/');
      } catch {
         showToast('Failed to delete product', 'error');
      }
   };

   if (!form) return null;

   const sellerRevenue = form.price
      ? (parseFloat(form.price) * (1 - COMMISSION_RATE)).toFixed(2)
      : '0.00';

   return (
      <div className={s.page}>
         <div className="container">
            {/* Breadcrumbs */}
            <nav className={s.breadcrumbs}>
               <Link to="/">Home</Link>
               <span className={s.sep}>›</span>
               <Link to="/my-products/">My Products</Link>
               <span className={s.sep}>›</span>
               <span>Edit: {product.name}</span>
            </nav>

            <div className={s.header}>
               <h1 className={s.title}>✏️ Edit Product</h1>
               <div className={s.headerActions}>
                  <Link to={`/product/${product.id}`} className={s.viewBtn} target="_blank" rel="noopener noreferrer">
                     👁 View Listing
                  </Link>
                  <button className={s.deleteBtn} onClick={handleDelete}>🗑 Delete</button>
               </div>
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
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

               {/* Commission info for sellers */}
               {!isAdmin && form.price && (
                  <div className={s.commissionBox}>
                     <strong>💰 Revenue breakdown:</strong>
                     <ul>
                        <li>Listing price: <strong>{parseFloat(form.price).toFixed(2)} {form.currency}</strong></li>
                        <li>Platform fee ({(COMMISSION_RATE * 100).toFixed(0)}%): <strong>−{(parseFloat(form.price) * COMMISSION_RATE).toFixed(2)} {form.currency}</strong></li>
                        <li>You receive: <strong className={s.sellerPrice}>{sellerRevenue} {form.currency}</strong></li>
                     </ul>
                  </div>
               )}

               {/* Image upload */}
               <div className={s.imageSection}>
                  <label className={s.imageLabel}>Product Images ({images.length})</label>
                  <button type="button" className={s.uploadBtn} onClick={() => fileInputRef.current.click()}>
                     + Upload Images
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
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

               <div className={s.formActions}>
                  <button type="submit" className={s.submitBtn} disabled={submitting}>
                     {submitting ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button type="button" className={s.cancelBtn} onClick={() => navigate('/my-products/')}>
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};
