import React from 'react';

const SubtitleTruncado = ({ subtitle }: any) => {
  const getPlainText = (htmlString: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  const plainText = getPlainText(subtitle);
  const truncated = plainText.length > 60 ? plainText.slice(0, 60) + '...' : plainText;

  return (
    <p className="text-sm w-full opacity-90">
      {truncated}
    </p>
  );
};

export default SubtitleTruncado;