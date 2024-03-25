import { Img } from '../../../common';
import { Link } from 'react-router-dom';
import s from './footer.module.css';

export const ColumnsData = () => {
   const colunmsData = [
      {
         title: 'Media:',
         class: s.links__media,
         list: [
            <Img folder='logo' img='instagram.png' link='#' />,
            <Img folder='logo' img='facebook.png' link='#' />,
            <Img folder='logo' img='whatsup.png' link='#' />,
            <Img folder='logo' img='twitter.png' link='#' />,
         ]
      },
      {
         title: 'Legal:',
         class: s.links__legal,
         list: [
            <Link href="#" className={s.link}>Privacy Policy</Link>,
            <Link href="#" className={s.link}>Terms of Service</Link>,
            <Link href="#" className={s.link}>Copyright</Link>,
         ]
      },
      {
         title: 'Contact Us:',
         class: s.links__contact,
         list: [
            <Link href="#" className={s.link}>Email Us</Link>,
            <Link href="#" className={s.link}>Call Us</Link>,
            <Link href="#" className={s.link}>Visit Us</Link>,
         ]
      }
   ].map((column, index) => (
      <div key={index} className={s.column}>
         <h3>{column.title}</h3>
         <ul className={`${s.links__list} ${column.class}`}>
            {
               column.list.map((item, i) => <li key={i}>{item}</li>)
            }
         </ul>
      </div>
   ));

   return colunmsData;
}