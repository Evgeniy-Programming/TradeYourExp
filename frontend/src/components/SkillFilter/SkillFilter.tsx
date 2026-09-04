import { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import style from './style.module.scss';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import Dropdown from '../../ui/Dropdown/Dropdown';

const categories = [
  'Все категории',
  'Языки и коммуникация',
  'Технологии и IT',
  'Творчество и дизайн',
  'Наука, бизнес и саморазвитие',
  'Хобби, здоровье и образ жизни',
];

export const SkillFilter = () => {
  const [skill, setSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Все категории');
  const [isOpenSelect, setOpenSelect] = useState(false);

  const searchSkill = () => {};

  const findByCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className={style.filter}>
      <div className={style.filter__category}>
        {categories.map((category) => (
          <>
            {selectedCategory === category ? (
              <Button onClick={() => findByCategory(category)}>{category}</Button>
            ) : (
              <ButtonSecondary onClick={() => findByCategory(category)}>{category}</ButtonSecondary>
            )}
          </>
        ))}
      </div>

      <div className={style.filter__search}>
        <Input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Введите навык..."
        />
        <div className={style.filter__select}>
          <ButtonSecondary onClick={() => setOpenSelect(true)}>Обменять</ButtonSecondary>
          {isOpenSelect && (
            <Dropdown dropdownClose={() => setOpenSelect(false)} className={style.select}>
              <Button>Все</Button>
              <Button>Получить</Button>
              <Button>Обменять</Button>
            </Dropdown>
          )}
        </div>
        <Button onClick={searchSkill}>Найти</Button>
      </div>
    </div>
  );
};
