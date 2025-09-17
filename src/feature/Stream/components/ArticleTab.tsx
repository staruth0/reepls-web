import React from 'react';
import { Publication } from '../../../models/datamodels';

interface streamprops {
  stream:Publication;
}


const ArticleTab: React.FC<streamprops> = ({stream}) => {


  return (
    <div className="pb-10 space-y-6">
    {stream._id}
    </div>
  );
};

export default ArticleTab;
