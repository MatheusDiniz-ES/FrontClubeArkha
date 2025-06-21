import React from 'react';

const SubtitleTruncado = ({ subtitle }: any) => {
  const getPlainText = (htmlString: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  const plainText = getPlainText(subtitle);


  return (
    <p className="text-sm w-full opacity-90">
      {plainText }
    </p>
  );
};

export default SubtitleTruncado;