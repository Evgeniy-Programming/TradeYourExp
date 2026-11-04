import style from './style.module.scss';
import { GeneralLayout } from '../../layouts/GeneralLayout/GeneralLayout';
import IconButton from '../../ui/IconButton/IconButton';
import { useEffect, useState } from 'react';
import { PreviewSkillModal } from '../../components/PreviewSkillModal/PreviewSkillModal';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import Tooltip from '../../ui/Tooltip/Tooltip';
import { categories } from '../../constants/categories';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import type { CategoryType, ContactType } from '../../types/skill';
import { initEditSkill, setEditSkillField } from '../../store/slices/skillSlice';
import { skillAPI } from '../../api/skill';
import { useNavigate } from 'react-router-dom';
import { setErrorWithTimeout } from '../../store/slices/appSlice';
import PreviewSVG from '../../ui/svg/PreviewSVG';
import TextareaExpandable from '../../ui/TextareaExpandable/TextareaExpandable';
import { useTranslation } from 'react-i18next';
import { formatCategory } from '../../utils/formatCategory';

export const CreatorPage = () => {
  const { t } = useTranslation();
  const [isOpenViewModal, setOpenViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(
    'Наука, бизнес и саморазвитие'
  );
  const [fieldSkill, setFieldSkill] = useState('');
  const [fieldExchange, setFieldExchange] = useState('');
  const [fieldDesc, setFieldDesc] = useState('');
  const [fieldContactType, setFieldContactType] = useState<ContactType>('site');
  const [fieldContactValue, setFieldContactValue] = useState<string | null>(null);
  const [isOpenContact, setOpenContact] = useState(false);

  const navigate = useNavigate();

  const skill = useAppSelector((state) => state.skill.editSkill);
  const profile = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();

  const sendSkill = async () => {
    if (!skill || !profile) return;

    try {
      await skillAPI.sendSkill(skill, profile.username);
      navigate('/profile/history');
    } catch (error) {
      dispatch(setErrorWithTimeout(error));
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
        contactType: fieldContactType,
        contactValue: fieldContactValue,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    fieldDesc,
    fieldExchange,
    fieldSkill,
    fieldContactType,
    fieldContactValue,
  ]);

  const handleChangeContactType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as ContactType;
    setFieldContactType(selectedType);

    if (selectedType === 'site') {
      setOpenContact(false);
      setFieldContactValue(null);
    } else {
      setOpenContact(true);
    }
  };

  return (
    <GeneralLayout>
      {isOpenViewModal && (
        <PreviewSkillModal onClose={() => setOpenViewModal(false)} sendSkill={sendSkill} />
      )}
      <div className={style.page}>
        <div className={style.header}>
          <h2>{t('creator.title')}</h2>
          <div className={style.header__controls}>
            <IconButton icon={<PreviewSVG />} onClick={() => setOpenViewModal(true)} />
          </div>
        </div>

        <form className={style.form}>
          <div className={style.form__editor}>
            <div className={style.form__field}>
              <Tooltip text={t('creator.tooltipSkill')} className={style.form__field__tooltip} />
              <label htmlFor="fieldSkill">{t('creator.labelSkill')}</label>
              <Input
                id="fieldSkill"
                value={fieldSkill}
                onChange={(e) => setFieldSkill(e.target.value)}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip text={t('creator.tooltipExchange')} className={style.form__field__tooltip} />
              <label htmlFor="fieldExchange">{t('creator.labelExchange')}</label>
              <Input
                id="fieldExchange"
                value={fieldExchange}
                onChange={(e) => setFieldExchange(e.target.value)}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip text={t('creator.tooltipDesc')} className={style.form__field__tooltip} />
              <label htmlFor="fieldDesc">{t('creator.labelDesc')}</label>
              <TextareaExpandable
                id="fieldDesc"
                value={fieldDesc}
                onChange={(e) => setFieldDesc(e.target.value)}
                fieldClassName={style.form__textarea}
              />
            </div>
            <div className={style.form__field}>
              <Tooltip text={t('creator.tooltipCategory')} className={style.form__field__tooltip} />
              <label>{t('creator.labelCategory')}</label>
              <div className={style.form__field__category}>
                {categories.map((category) => (
                  <div key={category}>
                    {selectedCategory === category ? (
                      <Button onClick={() => setSelectedCategory(category)}>
                        {formatCategory(category, t)}
                      </Button>
                    ) : (
                      <ButtonSecondary onClick={() => setSelectedCategory(category)}>
                        {formatCategory(category, t)}
                      </ButtonSecondary>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={style.form__field}>
              <Tooltip text={t('creator.tooltipContact')} className={style.form__field__tooltip} />
              <label htmlFor="fieldContactType">{t('creator.labelContactType')}</label>
              <select
                id="fieldContactType"
                value={fieldContactType}
                onChange={handleChangeContactType}
              >
                <option value="site">{t('creator.contactSite')}</option>
                <option value="telegram">{t('creator.contactTelegram')}</option>
                <option value="vk">{t('creator.contactVk')}</option>
                <option value="wechat">{t('creator.contactWechat')}</option>
              </select>
              {isOpenContact && (
                <Input
                  placeholder={t('creator.contactPlaceholder')}
                  className={style.form__field__contactValue}
                  value={fieldContactValue || ''}
                  onChange={(e) => setFieldContactValue(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className={style.form__controls}>
            <Button onClick={sendSkill}>{t('creator.publish')}</Button>
          </div>
        </form>
      </div>
    </GeneralLayout>
  );
};
