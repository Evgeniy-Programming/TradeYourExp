import { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import style from './style.module.scss';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import ButtonAction from '../../ui/ButtonAction/ButtonAction';
import Dropdown from '../../ui/Dropdown/Dropdown';
import { categoriesView as categories } from '../../constants/categories';
import type { CategoryViewType, SkillSearchType } from '../../types/skill';
import ArrowSVG from '../../ui/svg/ArrowSVG';

export const SkillFilter = () => {
  const [skill, setSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryViewType>('Все категории');
  const [isOpenSelect, setOpenSelect] = useState(false);
  const [selectedSearchType, setSearchType] = useState<SkillSearchType>('Все');

  const searchSkill = () => {};

  const findByCategory = (category: CategoryViewType) => {
    setSelectedCategory(category);
  };

  return (
    <div className={style.filter}>
      <div className={style.filter__category}>
        {categories.map((category) => (
          <div key={category}>
            {selectedCategory === category ? (
              <Button onClick={() => findByCategory(category)}>{category}</Button>
            ) : (
              <ButtonSecondary onClick={() => findByCategory(category)}>{category}</ButtonSecondary>
            )}
          </div>
        ))}
      </div>

      <div className={style.filter__search}>
        <Input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Введите навык..."
        />
        <div className={style.filter__select}>
          <ButtonAction
            icon={<ArrowSVG direction={isOpenSelect ? 'down' : 'up'} />}
            onClick={() => setOpenSelect(true)}
          >
            <p>{selectedSearchType}</p>
          </ButtonAction>
          {isOpenSelect && (
            <Dropdown dropdownClose={() => setOpenSelect(false)} className={style.select}>
              <Button onClick={() => setSearchType('Все')}>Все</Button>
              <Button onClick={() => setSearchType('Получить')}>Получить</Button>
              <Button onClick={() => setSearchType('Обменять')}>Обменять</Button>
            </Dropdown>
          )}
        </div>
        <Button onClick={searchSkill}>Найти</Button>
      </div>
    </div>
  );
};
