import style from './style.module.scss';
import { GeneralLayout } from '../../layouts/GeneralLayout/GeneralLayout';
import IconButton from '../../ui/IconButton/IconButton';
import EyeOpenSVG from '../../ui/svg/EyeOpenSVG';
import { useEffect, useState } from 'react';
import { PreviewSkillModal } from '../../components/PreviewSkillModal/PreviewSkillModal';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import Tooltip from '../../ui/Tooltip/Tooltip';
import { categories } from '../../constants/categories';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import type { CategoryType } from '../../types/skill';
import { initEditSkill, setEditSkillField } from '../../store/slices/skillSlice';
import { skillAPI } from '../../api/skill';
import { useNavigate } from 'react-router-dom';
import { setError } from '../../store/slices/appSlice';
import { parseError } from '../../utils/parseError';

export const CreatorPage = () => {
  const [isOpenViewModal, setOpenViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    'Наука, бизнес и саморазвитие'
  );
  const [fieldSkill, setFieldSkill] = useState('');
  const [fieldExchange, setFieldExchange] = useState('');
  const [fieldDesc, setFieldDesc] = useState('');

  const navigate = useNavigate();

  const skill = useAppSelector((state) => state.skill.editSkill);
  const dispatch = useAppDispatch();

  const sendSkill = async () => {
    if (!skill) return;

    try {
      await skillAPI.sendSkill(skill);
      navigate('/profile');
    } catch (error) {
      dispatch(setError(parseError(error)));
    }
  };

  useEffect(() => {
    dispatch(initEditSkill());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      setEditSkillField({
        category: selectedCategory,
        exchange: fieldExchange,
        skill: fieldSkill,
        description: fieldDesc,
      })
    );
  }, [dispatch, selectedCategory, fieldDesc, fieldExchange, fieldSkill]);

  return (
    <GeneralLayout>
      {isOpenViewModal && (
        <PreviewSkillModal onClose={() => setOpenViewModal(false)} sendSkill={sendSkill} />
      )}
      <div className={style.page}>
        <div className={style.header}>
          <h2>Создание обмена</h2>
          <div className={style.header__controls}>
            <IconButton icon={<EyeOpenSVG />} onClick={() => setOpenViewModal(true)} />
          </div>
        </div>

        <form className={style.form}>
          <div className={style.form__editor}>
            <div className={style.form__field}>
              <Tooltip
                text="Напишите коротко чему вы сможете научить"
                className={style.form__field__tooltip}
              />
              <label htmlFor="fieldExchange">Чему хотите научить</label>
              <Input
                id="fieldExchange"
                value={fieldSkill}
                onChange={(e) => setFieldSkill(e.target.value)}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip
                text="Напишите коротко что хотите получить взамен на ваш навык"
                className={style.form__field__tooltip}
              />
              <label htmlFor="fieldSkill">Что хотите получить</label>
              <Input
                id="fieldSkill"
                value={fieldExchange}
                onChange={(e) => setFieldExchange(e.target.value)}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip
                text="Расскажите подробнее что для вас нужно и что вы можете дать взамен"
                className={style.form__field__tooltip}
              />
              <label htmlFor="fieldDesc">Подробное описание</label>
              <textarea
                id="fieldDesc"
                value={fieldDesc}
                onChange={(e) => setFieldDesc(e.target.value)}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip
                text="Выберите одну из категорий ниже, которая подходит под ваш навык"
                className={style.form__field__tooltip}
              />
              <label>Категория</label>
              <div className={style.form__field__category}>
                {categories.map((category) => (
                  <div key={category}>
                    {selectedCategory === category ? (
                      <Button onClick={() => setSelectedCategory(category)}>{category}</Button>
                    ) : (
                      <ButtonSecondary onClick={() => setSelectedCategory(category)}>
                        {category}
                      </ButtonSecondary>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={style.form__controls}>
            <Button onClick={sendSkill}>Опубликовать</Button>
          </div>
        </form>
      </div>
    </GeneralLayout>
  );
};
