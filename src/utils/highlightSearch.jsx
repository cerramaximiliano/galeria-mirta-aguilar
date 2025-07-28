export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return `<mark class="bg-yellow-200 px-0.5 rounded">${part}</mark>`;
    }
    return part;
  }).join('');
};

export const HighlightedText = ({ text, searchTerm, className = '' }) => {
  if (!searchTerm || !text) return <span className={className}>{text}</span>;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <mark key={index} className="bg-yellow-200 px-0.5 rounded">
              {part}
            </mark>
          );
        }
        return part;
      })}
    </span>
  );
};