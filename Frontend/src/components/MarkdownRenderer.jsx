import ReactMarkdown from 'react-markdown';

// This component will render the chatbot's Markdown response as styled HTML.
// We use Tailwind's @apply in a real CSS file, but for a single file,
// we can define styles here or use a library like 'prose'.
// For simplicity, we will style the elements directly.
const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-800">
        <ReactMarkdown
            components={{
                // This will style the <ul> and <ol> elements
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                // This ensures paragraphs have a bit of space between them
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
