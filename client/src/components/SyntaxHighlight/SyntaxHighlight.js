import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlight = {
  code({ node, inline, className, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={dark}
        language={match[1]}
        PreTag="div"
        className="codeStyle"
        {...props}
      />
    ) : (
      <code className={className} {...props} />
    );
  },
};

export default SyntaxHighlight;
