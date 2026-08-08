import Markdown from 'markdown-to-jsx';

interface FormattedTextProps {
  text?: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  return (
    <Markdown
      className={className}
      options={{
        overrides: {
          p: { component: 'p' },
          strong: { component: 'strong' },
          em: { component: 'em' },
          a: {
            component: 'a',
            props: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        },
      }}
    >
      {text}
    </Markdown>
  );
};

export default FormattedText;
