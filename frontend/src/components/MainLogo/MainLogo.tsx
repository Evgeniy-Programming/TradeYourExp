import logoIMG from './../../assets/img/logo.png';
import style from './style.module.css';

export const MainLogo = () => {
  return (
    <div className={style.intro}>
      <img src={logoIMG} alt="Логотип" />
      <h1>Обмен навыками</h1>
    </div>
  );
};
