import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders AI output. Raw HTML in the response is not rendered, because no
 * rehype-raw plugin is registered, so a model reply cannot inject markup.
 */
export default function Markdown({ children, className = '' }) {
  return (
    <div className={`prose-study ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children || ''}
      </ReactMarkdown>
    </div>
  );
}
