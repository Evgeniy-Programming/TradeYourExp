import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import style from './TextareaExpandable.module.scss';
import IconButton from '../IconButton/IconButton';
import MaximizeSVG from '../svg/MaximizeSVG';
import MinimizeSVG from '../svg/MinimizeSVG';

interface TextareaExpandableProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  className?: string;
  fieldClassName?: string;
}

const TextareaExpandable: React.FC<TextareaExpandableProps> = ({
  className,
  fieldClassName,
  value,
  onChange,
  ...rest
}) => {
  const [isExpanded, setExpanded] = useState(false);
  const inlineRef = useRef<HTMLTextAreaElement>(null);
  const expandedRef = useRef<HTMLTextAreaElement>(null);

  // Блокировка скролла body, пока открыт полноэкранный режим
  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflowY;
    document.body.style.overflowY = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflowY = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Фокус на нужной textarea при переключении режима
  useEffect(() => {
    const target = isExpanded ? expandedRef.current : inlineRef.current;
    if (!target) return;
    target.focus();
    // Курсор в конец текста
    const len = target.value.length;
    target.setSelectionRange(len, len);
  }, [isExpanded]);

  return (
    <>
      <div className={classNames(style.field, fieldClassName, className)}>
        <textarea
          ref={inlineRef}
          className={style.field__textarea}
          value={value}
          onChange={onChange}
          {...rest}
        />
        <div className={style.field__controls}>
          <IconButton
            type="button"
            icon={<MaximizeSVG size={25} />}
            onClick={() => setExpanded(true)}
            title="Развернуть на весь экран"
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className={style.overlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setExpanded(false);
          }}
        >
          <div className={style.expanded}>
            <div className={style.expanded__header}>
              <span className={style.expanded__title}>Подробное описание</span>
              <IconButton
                type="button"
                icon={<MinimizeSVG size={25} />}
                onClick={() => setExpanded(false)}
                title="Свернуть"
              />
            </div>

            <textarea
              ref={expandedRef}
              className={style.expanded__textarea}
              value={value}
              onChange={onChange}
              {...rest}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TextareaExpandable;
