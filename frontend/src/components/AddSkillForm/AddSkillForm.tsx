import { useState } from 'react';
import Button from '../../ui/Button/Button';
import Input from '../../ui/Input/Input';
import style from './style.module.css';
import { AddSkillModal } from '../AddSkillModal/AddSkillModal';

interface AddSkillFormProps {
  onSubmit: (description: string) => void;
}

export const AddSkillForm: React.FC<AddSkillFormProps> = ({ onSubmit }) => {
  const [isOpenModal, setOpenModal] = useState(false);

  const [yourSkill, setYourSkill] = useState('');
  const [anotherSkill, setAnotherSkill] = useState('');

  return (
    <form className={style.form}>
      {isOpenModal && (
        <AddSkillModal
          onClose={() => setOpenModal(false)}
          yourSkill={yourSkill}
          anotherSkill={anotherSkill}
        />
      )}
      <div className={style.form__field}>
        <label htmlFor="addSkillFieldTo">Ваш навык, чем вы готовы поделиться</label>
        <Input
          value={yourSkill}
          onChange={(e) => setYourSkill(e.target.value)}
          id="addSkillFieldTo"
        />
      </div>
      <div className={style.form__field}>
        <label htmlFor="addSkillFieldFrom">Что вы хотите получить взамен</label>
        <Input
          value={anotherSkill}
          onChange={(e) => setAnotherSkill(e.target.value)}
          id="addSkillFieldFrom"
        />
      </div>
      <Button onClick={() => setOpenModal(true)}>Добавить предложение</Button>
    </form>
  );
};
