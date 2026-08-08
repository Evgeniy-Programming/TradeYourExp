import { Link } from 'react-router';

import style from './ReplyMessage.module.scss';
import { RelatedType } from '../../types/entities/commentType';

interface ReplyMessageProps {
  id: number;
  authorUsername: string;
  text: string;
  relatedType: RelatedType;
}

const ReplyMessage: React.FC<ReplyMessageProps> = ({ id, authorUsername, relatedType, text }) => {
  text = text.slice(0, 10) + '...';

  return (
    <Link to={`#comment-${relatedType}-${id}`} className={style.reply}>
      <p className={style.reply__author}>{authorUsername}</p>
      <p className={style.reply__text}>{text}</p>
    </Link>
  );
};

export default ReplyMessage;
