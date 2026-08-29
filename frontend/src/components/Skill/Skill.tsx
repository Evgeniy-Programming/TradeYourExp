import style from './style.module.css';

interface SkillPropsType {
  author: string;
  authorSkill: string;
  requestSkill: string;
  contactType: string;
  username: string | null;
}

export const Skill: React.FC<SkillPropsType> = ({
  author,
  authorSkill,
  requestSkill,
  contactType,
  username,
}) => {
  return (
    <div className={style.skill}>
      <div className={style.skill__content}>
        <b>
          {author}: {authorSkill} ↔ {requestSkill}
        </b>
      </div>
      <div className={style.skill__contact}>
        <p>
          Тип связи: {contactType}, Имя: {username}
        </p>
      </div>
    </div>
  );
};
