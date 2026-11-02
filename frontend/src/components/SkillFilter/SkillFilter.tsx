import { useEffect, useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import style from './style.module.scss';
import ButtonSecondary from '../../ui/ButtonSecondary/ButtonSecondary';
import { categoriesView as categories } from '../../constants/categories';
import type { CategoryViewType } from '../../types/skill';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchSkills } from '../../store/slices/skillSlice';
import { setErrorWithTimeout } from '../../store/slices/appSlice';

export const SkillFilter = () => {
  const [skill, setSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryViewType>('Все категории');
  const [appliedSearch, setAppliedSearch] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchSkills({
        category: selectedCategory,
        search: appliedSearch,
      })
    )
      .unwrap()
      .catch((error) => dispatch(setErrorWithTimeout(error)));
  }, [dispatch, selectedCategory, appliedSearch]);

  const searchSkill = () => {
    setAppliedSearch(skill.trim());
  };

  const findByCategory = (category: CategoryViewType) => {
    setSelectedCategory(category);
  };

  return (
    <div className={style.filter}>
      <p className="label">Категории предлагаемых навыков</p>
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

      <p className="label">Поиск по названию и описанию</p>
      <div className={style.filter__search}>
        <Input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Введите навык..."
        />
        <Button onClick={searchSkill}>Найти</Button>
      </div>
    </div>
  );
};
